import { FastifyLoggerInstance } from 'fastify';
import { environmentFactory } from '../../../shared/services/environment.service';
import axios from 'axios';

interface ServiceNowResponseLink {
    url_access_service_now: string;
}

export const getServiceNowLink = async (userId: string, userIsAdult: boolean, logger: FastifyLoggerInstance) => {
    const env = environmentFactory()
    const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "autoservices")}/users/${userId}/token/adult/${userIsAdult ? "true" : "false"}`
    console.log(url)
    try {
        const integrationRequest = await axios.get<ServiceNowResponseLink>(url, {
            headers: {
                'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
        return integrationRequest.data.url_access_service_now;
    } catch (error) {
        logger.error({
            msg: 'service url request error',
            errorMessage: error.message || "",
            data: {
                userId
            }
        });
        throw error;
    }
}