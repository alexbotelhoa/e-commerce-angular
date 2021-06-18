// import axios from 'axios';
// import { format, differenceInMinutes } from 'date-fns';
// import { FastifyLoggerInstance } from 'fastify';
// // import { GQLEvent } from '../../../resolvers-types';
// import { insertEventAdress, selectEventAdress } from '../../../shared/repositories/event-adress.repository';
// import { insertEventInfo, selectEventInfo } from '../../../shared/repositories/event-info.repository';
// import { insertEventInstructor, selectEventInstructor } from '../../../shared/repositories/event-instructor.repository';
// import { insertEvent, selectEvent, updateEvent } from '../../../shared/repositories/event.repository';
// import { DatabaseService } from '../../../shared/services/database.service';
// import { environmentFactory } from '../../../shared/services/environment.service';
// import { EventDataRequest } from '../types/event-data.type';


// export const eventProcess = async (userId: string, database: DatabaseService<any, any>, logger: FastifyLoggerInstance) => {
//     const env = environmentFactory()
//     const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "dadosacademicos")}/${userId}/eventos`
//     console.log(url)
//     try {
//         const integrationRequest = await axios.get<EventDataRequest>(url, {
//             headers: {
//                 'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
//             },
//             responseType: 'json',
//         });
//         logger.info({
//             msg: 'event process request response received',
//             data: {
//                 responseData: integrationRequest,
//                 userId
//             }
//         });
//         // const ActualEvents = await selectEvent(database).where("userId", "=", userId)
//         const transformedData = await transformEventData(integrationRequest.data, userId)
//         console.log(transformedData.length, "quanto eventos tem ?")
//         // return transformedData;
//         const response = []
//         for (const event of transformedData) {
//             const eventData: GQLEvent = {
//                 ...event || {},
//                 id: "",
//                 lastUpdateTime: "",
//                 __typename: "Event",
//                 adress: event.adress as any || {},
//                 eventInfo: event.eventInfo as any || [],
//                 instructor: event.instructor as any || [],
//             }
//             response.push(eventData)
//         }
//         return response;
//         // for (const event of transformedData) {
//         //     const eventCp: any = { ...event }
//         //     delete eventCp.__typename;
//         //     delete eventCp.adress;
//         //     delete eventCp.instructor;
//         //     delete eventCp.eventInfo;

//         //     if (ActualEvents.some(e => e.classId === event.classId)) {
//         //         const actualEventToUpdate = ActualEvents.find(e => e.classId === event.classId)
//         //         // if (actualEventToUpdate?.lastUpdateTime && differenceInMinutes(new Date(actualEventToUpdate.lastUpdateTime), new Date()) > 4) {

//         //         // }
//         //         const eventId = await updateEvent(database)({ ...eventCp, lastUpdateTime: new Date().toJSON() })(builder => builder.andWhere("id", actualEventToUpdate?.id))

//         //         // if (event.adress) {
//         //         //     await updateEventAdress(database)({ ...event.adress, eventId: eventId.toString() })(builder => builder.andWhere("eventId", actualEventToUpdate?.id))
//         //         // }
//         //         // if (event.instructor && event.instructor?.length > 0) {
//         //         //     for (const teacher of event.instructor) {
//         //         //         await updateEventInstructor(database)({ ...teacher, eventId: eventId.toString() })(builder => builder.andWhere("eventId", actualEventToUpdate?.id))
//         //         //     }
//         //         // }

//         //         // if (event.eventInfo && event.eventInfo?.length > 0) {
//         //         //     for (const eventInfo of event.eventInfo) {
//         //         //         await updateEventInfo(database)({ ...eventInfo, eventId: eventId.toString() })(builder => builder.andWhere("eventId", actualEventToUpdate?.id))
//         //         //     }
//         //         // }
//         //     } else {
//         //         // const eventId = await insertEvent(database)({ ...eventCp, lastUpdateTime: new Date().toJSON() })
//         //         // if (event.adress) {
//         //         //     await insertEventAdress(database)({ ...event.adress, eventId: eventId.toString() })
//         //         // }
//         //         // if (event.instructor && event.instructor?.length > 0) {
//         //         //     for (const teacher of event.instructor) {
//         //         //         await insertEventInstructor(database)({ ...teacher, eventId: eventId.toString() })
//         //         //     }
//         //         // }
//         //         // if (event.eventInfo && event.eventInfo?.length > 0) {
//         //         //     for (const eventInfo of event.eventInfo) {
//         //         //         await insertEventInfo(database)({ ...eventInfo, eventId: eventId.toString() })
//         //         //     }
//         //         // }

//         //     }
//         // }
//         // const evententity = (await selectEvent(database).where("userId", "=", userId))
//         // for (const event of evententity) {
//         //     const eventData: GQLEvent = {
//         //         ...event || {},
//         //         adress: (await selectEventAdress(database).where("eventId", "=", event.id))[0] || {},
//         //         eventInfo: (await selectEventInfo(database).where("eventId", "=", event.id)) || [],
//         //         instructor: (await selectEventInstructor(database).where("eventId", "=", event.id)) || [],
//         //     }
//         //     response.push(eventData)
//         // }
//         // return response;
//     } catch (error) {
//         logger.error({
//             msg: 'event process request error',
//             errorMessage: error.message || "",
//             data: {
//                 userId
//             }
//         });
//         return []
//     }
// }

// async function transformEventData(eventDataRequest: EventDataRequest, userId: string) {
//     return eventDataRequest.Turmas.map(event => {
//         return {
//             adress: event.endereco ? {
//                 city: event.endereco.cidade,
//                 complement: event.endereco.complemento,
//                 district: event.endereco.bairro,
//                 number: event.endereco.numero,
//                 postalCode: event.endereco.CEP,
//                 state: event.endereco.estado,
//                 street: event.endereco.rua,
//             } : undefined,
//             career: event.carreira,
//             title: event.descr_materia,
//             category: event.categoria,
//             daysOfWeekSchedule: event.diasdasemanahorario,
//             enrolled: event.matriculados,
//             sessionId: event.aula,
//             periodId: event.periodo,
//             link: event.link_estatico,
//             zoomRoom: event.sala_zoom,
//             status: event.status,
//             classId: event.turma,
//             endDate: event.final_da_aula,
//             startDate: event.inicio_da_aula,
//             statusEnrollment: event.matriculado,
//             teacherConclusion: event.professor_conc,
//             typeFaceToFace: event.typeFaceToFace,
//             subject: event.materia,
//             vacancies: event.vagas,
//             __typename: "Event",
//             userId,
//             eventInfo: event.dados_aula ? event.dados_aula.map(dados => {
//                 return {
//                     classId: event.turma,
//                     classMtgNbr: dados.class_mtg_nbr,
//                     classSection: dados.class_section,
//                     crseId: dados.crseid,
//                     crseOfferNbr: dados.class_mtg_nbr,
//                     endDate: dados.end_dt,
//                     eventId: "0",
//                     facilityId: dados.facility_id,
//                     fri: dados.fri,
//                     meetingEndTime: dados.meeting_time_end,
//                     meetingStartTime: dados.meeting_time_start,
//                     mon: dados.mon,
//                     sat: dados.sat,
//                     sessionCode: dados.session_code,
//                     startDate: dados.start_dt,
//                     strm: dados.strm,
//                     sun: dados.sun,
//                     thurs: dados.thurs,
//                     tues: dados.tues,
//                     wed: dados.wed,
//                     userId,
//                 }
//             }) : undefined,
//             instructor: event.dados_aula ? [...event.dados_aula.map(dados => {
//                 return dados.instrutor_orientador.map(t => {
//                     return {
//                         name: t.nome,
//                         macId: t.macID,
//                         macPass: t.macPass
//                     }
//                 })
//             }).reduce((acc, item) => {
//                 acc.push(...item)
//                 return acc
//             }, [])] : undefined,
//         }
//     })
// }
