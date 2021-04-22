import { GQLNotification, GQLQueryResolvers } from "../../../resolvers-types";
import { SimpleError } from "../../../shared/types/errors/simple-error.type";
import { getNotificationsByUser } from "../../user/services/notification.service";


export const notificationQueryResolver: GQLQueryResolvers['Notification'] = async (obj, params, context) => {
    if (context.currentUser?.id) {
        const userId = context.currentUser?.id;
        //console.log(userId);
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
        return notificationsResponse;
    } else {
        return [];
    }
}
