import { FastifyLoggerInstance } from 'fastify';
import { environmentFactory } from '../../../shared/services/environment.service';
import axios from 'axios';

interface OccResponseData {
    tokenSaml: string,
    urlSubmit: string,
}

export const callOccLogin = async (userId: string, logger: FastifyLoggerInstance) => {
    const env = environmentFactory()
    const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "commerce-services")}/occ/login/${userId}?apikey=${env.STUDENT_GRADE_INTEGRATION_API_KEY}`
    try {
        return await axios.get<OccResponseData>(url, {
            headers: {
                'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
    } catch (error) {
        logger.error({
            msg: 'occ log service request error',
            errorMessage: error.message || "",
            data: {
                userId,
            }
        });
        throw error;
    }
}
