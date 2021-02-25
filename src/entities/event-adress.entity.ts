export interface EventAdressEntity {
    id: string;
    eventId: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    postalCode: string;
    city: string;
    state: string;
}

export const EVENT_ADRESS_TABLE = "event-adress";