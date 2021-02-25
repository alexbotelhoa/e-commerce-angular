import { GQLEventAdressResolvers } from "../../resolvers-types";
import { EventAdressEntity } from "../../entities/event-adress.entity";



export const EventAdressEntityResolvers: Pick<GQLEventAdressResolvers, keyof EventAdressEntity> = {
    id: obj => obj.id,
    city: obj => obj.city,
    complement: obj => obj.complement,
    district: obj => obj.district,
    eventId: obj => obj.eventId,
    number: obj => obj.number,
    postalCode: obj => obj.postalCode,
    state: obj => obj.state,
    street: obj => obj.street,
}


export const eventAdressResolvers: GQLEventAdressResolvers = {
    ...EventAdressEntityResolvers,
}
