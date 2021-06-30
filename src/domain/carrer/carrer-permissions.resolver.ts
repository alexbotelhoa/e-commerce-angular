import { GQLQueryResolvers } from "../../resolvers-types";
import { selectPermission } from "../../shared/repositories/carrer-permission-repository";
import { selectCarrer } from "../../shared/repositories/carrer.repository";

export const getCarrersResolver: GQLQueryResolvers['Carrer'] = async (obj, params, context) => {
    const carrers = await selectCarrer(context.readonlyDatabase);
    const response = [
    ]
    for (const carrer of carrers) {
        response.push({
            ...carrer,
            permissions: await selectPermission(context.database).where("carrerId", carrer.carrerId)
        })
    }
    return response;
}
