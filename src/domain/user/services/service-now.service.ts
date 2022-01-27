import axios from 'axios';
import { FastifyLoggerInstance } from 'fastify';
import { environmentFactory } from '../../../shared/services/environment.service';

interface ServiceNowResponseLink {
    url_access_service_now: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
    } catch (error: any) {
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