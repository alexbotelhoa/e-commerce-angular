import axios from 'axios';
import { FastifyLoggerInstance } from 'fastify';
import { GQLEvent } from '../../../resolvers-types';
import { insertEventAdress, selectEventAdress, updateEventAdress } from '../../../shared/repositories/event-adress.repository';
import { insertEventInfo, selectEventInfo, updateEventInfo } from '../../../shared/repositories/event-info.repository';
import { insertEventInstructor, selectEventInstructor, updateEventInstructor } from '../../../shared/repositories/event-instructor.repository';
import { insertEvent, selectEvent, updateEvent } from '../../../shared/repositories/event.repository';
import { DatabaseService } from '../../../shared/services/database.service';
import { environmentFactory } from '../../../shared/services/environment.service';
import { EventDataRequest } from '../types/event-data.type';


export const eventProcess = async (userId: string, database: DatabaseService<any, any>, logger: FastifyLoggerInstance) => {
    const env = environmentFactory()
    const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "dadosacademicos")}/${userId}/eventos`
    console.log(url)
    try {
        const integrationRequest = await axios.get<EventDataRequest>(url, {
            headers: {
                'apikey': "Af9lMDeGfD9lZqn4aBfutv9ShC0h9K4O" || env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
        console.log(integrationRequest, "OOOOOOOOOOOIIIIIIIIIIIIII")
        logger.info({
            msg: 'event process request response received',
            data: {
                responseData: integrationRequest,
                userId
            }
        });
        const ActualEvents = await selectEvent(database).where("userId", "=", userId)
        const transformedData = await transformEventData(integrationRequest.data, userId)
        console.log(transformedData.length, "quanto eventos tem ?")
        const response = []
        for (const event of transformedData) {
            const eventCp: any = { ...event }
            delete eventCp.__typename;
            delete eventCp.adress;
            delete eventCp.instructor;
            delete eventCp.eventInfo;

            if (ActualEvents.some(e => e.classId === event.classId)) {
                const actualEventToUpdate = ActualEvents.find(e => e.classId === event.classId)
                const eventId = await updateEvent(database)(eventCp)(builder => builder.andWhere("id", actualEventToUpdate?.id))

                // if (event.adress) {
                //     await updateEventAdress(database)({ ...event.adress, eventId: eventId.toString() })(builder => builder.andWhere("eventId", actualEventToUpdate?.id))
                // }
                // if (event.instructor && event.instructor?.length > 0) {
                //     for (const teacher of event.instructor) {
                //         await updateEventInstructor(database)({ ...teacher, eventId: eventId.toString() })(builder => builder.andWhere("eventId", actualEventToUpdate?.id))
                //     }
                // }

                // if (event.eventInfo && event.eventInfo?.length > 0) {
                //     for (const eventInfo of event.eventInfo) {
                //         await updateEventInfo(database)({ ...eventInfo, eventId: eventId.toString() })(builder => builder.andWhere("eventId", actualEventToUpdate?.id))
                //     }
                // }
            } else {
                const eventId = await insertEvent(database)(eventCp)
                if (event.adress) {
                    await insertEventAdress(database)({ ...event.adress, eventId: eventId.toString() })
                }
                if (event.instructor && event.instructor?.length > 0) {
                    for (const teacher of event.instructor) {
                        await insertEventInstructor(database)({ ...teacher, eventId: eventId.toString() })
                    }
                }
                if (event.eventInfo && event.eventInfo?.length > 0) {
                    for (const eventInfo of event.eventInfo) {
                        await insertEventInfo(database)({ ...eventInfo, eventId: eventId.toString() })
                    }
                }

            }
        }
        const evententity = (await selectEvent(database).where("userId", "=", userId))
        for (const event of evententity) {
            const eventData: GQLEvent = {
                ...event || {},
                adress: (await selectEventAdress(database).where("eventId", "=", event.id))[0] || {},
                eventInfo: (await selectEventInfo(database).where("eventId", "=", event.id)) || [],
                instructor: (await selectEventInstructor(database).where("eventId", "=", event.id)) || [],
            }
            response.push(eventData)
        }
        return response;
    } catch (error) {
        logger.error({
            msg: 'event process request error',
            errorMessage: error.message || "",
            data: {
                userId
            }
        });
        return []
    }
}

async function transformEventData(eventDataRequest: EventDataRequest, userId: string) {
    return eventDataRequest.Turmas.map(event => {
        return {
            adress: event.endereco ? {
                city: event.endereco.cidade,
                complement: event.endereco.complemento,
                district: event.endereco.bairro,
                number: event.endereco.numero,
                postalCode: event.endereco.CEP,
                state: event.endereco.estado,
                street: event.endereco.rua,
            } : undefined,
            career: event.carreira,
            category: event.categoria,
            daysOfWeekSchedule: event.diasdasemanahorario,
            enrolled: event.matriculados,
            sessionId: event.aula,
            periodId: event.periodo,
            link: event.link_estatico,
            zoomRoom: event.sala_zoom,
            status: event.status,
            classId: event.turma,
            endDate: event.final_da_aula,
            startDate: event.inicio_da_aula,
            statusEnrollment: event.status_matricula,
            teacherConclusion: event.professor_conc,
            typeFaceToFace: event.typeFaceToFace,
            subject: event.materia,
            vacancies: event.vagas,
            __typename: "Event",
            userId,
            eventInfo: event.dados_aula ? event.dados_aula.map(dados => {
                return {
                    classId: event.turma,
                    classMtgNbr: dados.class_mtg_nbr,
                    classSection: dados.class_section,
                    crseId: dados.crseid,
                    crseOfferNbr: dados.class_mtg_nbr,
                    endDate: dados.end_dt,
                    eventId: "0",
                    facilityId: dados.facility_id,
                    fri: dados.fri,
                    meetingEndTime: dados.meeting_time_end,
                    meetingStartTime: dados.meeting_time_start,
                    mon: dados.mon,
                    sat: dados.sat,
                    sessionCode: dados.session_code,
                    startDate: dados.start_dt,
                    strm: dados.strm,
                    sun: dados.sun,
                    thurs: dados.thurs,
                    tues: dados.tues,
                    wed: dados.wed,
                    userId,
                }
            }) : undefined,
            instructor: event.dados_aula ? [...event.dados_aula.map(dados => {
                return dados.instrutor_orientador.map(t => {
                    return {
                        name: t.nome,
                        macId: t.macID,
                        macPass: t.macPass
                    }
                })
            }).reduce((acc, item, index) => {
                acc.push(...item)
                return acc
            }, [])] : undefined,
        }
    })
}
