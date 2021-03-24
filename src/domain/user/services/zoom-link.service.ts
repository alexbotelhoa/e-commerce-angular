import { FastifyLoggerInstance } from 'fastify';
import { DatabaseService } from '../../../shared/services/database.service';
import { environmentFactory } from '../../../shared/services/environment.service';
import axios from 'axios';

interface ZoomResponseLink {
    zoom_personal_meeting_url: string
}

export const getZoomLink = async (teacherId: string, database: DatabaseService<any, any>, logger: FastifyLoggerInstance) => {
    const env = environmentFactory()
    const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "portalservices")}/users/${teacherId}/zoom`
    console.log(url)
    try {
        const integrationRequest = await axios.get<ZoomResponseLink>(url, {
            headers: {
                'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
        console.log(integrationRequest, "OOOOOOOOOOOIIIIIIIIIIIIII")
        return integrationRequest.data.zoom_personal_meeting_url;
    } catch (error) {
        logger.error({
            msg: 'zoom url request error',
            errorMessage: error.message || "",
            data: {
                teacherId
            }
        });
        throw error;
    }
}
