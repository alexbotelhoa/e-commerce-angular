import { GQLNotificationResolvers } from "../../resolvers-types";

export const notificationResolver: GQLNotificationResolvers = {
    category: (obj) => obj.category,
    description: (obj) => obj.description,
    id: (obj) => obj.id,
    isAlert: (obj) => obj.isAlert,
    link: (obj) => obj.link,
    title: (obj) => obj.title,
    userId: (obj) => obj.title,
}
