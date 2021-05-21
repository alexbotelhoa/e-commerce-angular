import { GQLNotification, GQLQueryResolvers } from "../../../resolvers-types";
import { getNotificationsByUser } from "../../user/services/notification.service";


export const notificationQueryResolver: GQLQueryResolvers['Notification'] = async (obj, params, context) => {
    if (context.currentUser?.id) {
        const userId = context.currentUser?.id;
        //console.log(userId);
        if (context.redisClient) {
            const response = await context.redisClient.get("notification-" + userId)
            if (response && (JSON.parse(response).length > 0)) {
                context.logger.info(" notification cache used for user, id: " + userId + "notification-" + userId)
                return JSON.parse(response);
            }
        }
        const notifications = await getNotificationsByUser(userId, context.logger);
        const notificationsResponse = "notifications" in notifications ? notifications.notifications.map<GQLNotification>(item => {
            return {
                id: item.id,
                userId: item.userId,
                title: item.title,
                description: item.description,
                category: item.category,
                link: item.link,
                isAlert: item.isAlert,
                __typename: "Notification"
            }
        }) : []
        if (context.redisClient) {
            if (notificationsResponse.length === 0) {
                await context.redisClient.del("notification-" + userId)
            } else {
                await context.redisClient.set("notification-" + userId, JSON.stringify(notificationsResponse), 'ex', 21600)
            }
        }
        return notificationsResponse;
    } else {
        return [];
    }
}
