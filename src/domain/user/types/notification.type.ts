export interface NotificationResponse {
    notifications: Notification[];
}

interface Notification {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    link: string;
    isAlert: boolean;
}