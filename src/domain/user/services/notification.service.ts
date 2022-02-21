import axios from 'axios';
import { FastifyLoggerInstance } from 'fastify';
import { NotificationResponse } from '../types/notification.type';
import { environmentFactory } from '../../../shared/services/environment.service';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getNotificationsByUser = async (userId: string, logger: FastifyLoggerInstance) => {
    const env = environmentFactory()
    const url = `${env.STUDENT_GRADE_INTEGRATION_URL.replace("lxp", "dadosacademicos")}/${userId}/notificacoes`
    console.log(url)
    try {
        const integrationRequest = await axios.get<NotificationResponse>(url, {
            headers: {
                'apikey': env.STUDENT_GRADE_INTEGRATION_API_KEY,
            },
            responseType: 'json',
        });
        console.log(integrationRequest.data, "OOOOOOOOOOOIIIIIIIIIIIIII")
        logger.info({
            msg: 'notification process request response received',
            data: {
                responseData: integrationRequest.data,
                status: integrationRequest.status,
                headers: integrationRequest.headers,
                statusText: integrationRequest.statusText,
                userId
            }
        });

        return integrationRequest.data;
    } catch (error: any) {
        logger.error({
            msg: 'notification query request error',
            errorMessage: error.message || error.response.data.error || "",
            data: {
                userId
            }
        });
        const simpleError = {
            message: error.response.data.error,
            success: false,
        }
        return simpleError
    }
}
