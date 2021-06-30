import { GQLQueryResolvers } from "../../resolvers-types";
import { selectPermission } from "../../shared/repositories/carrer-permission-repository";
import { selectCarrer } from "../../shared/repositories/carrer.repository";

export const getCarrersResolver: GQLQueryResolvers['Carrer'] = async (obj, params, context) => {
    const user = context.currentUser;
    if (!user) {
        const carrers = await selectCarrer(context.readonlyDatabase);
        const response = []
        for (const carrer of carrers) {
            response.push({
                ...carrer,
                permissions: await selectPermission(context.database).where("carrerId", carrer.carrerId)
            })
        }
        return response;
    }
    const [userCarrers]: { carrerId: string }[][] = await context.readonlyDatabase.raw(`
    SELECT distinct(c.carrerId) as carrerId FROM class c, user u, enrollment e, enrollment_class ec
WHERE c.id = ec.classId
and e.id = ec.enrollmentId
and u.id = e.userId
and u.id = ${user.id}`
    )
    console.log(userCarrers)
    const carrers = await selectCarrer(context.readonlyDatabase).whereIn("carrerId", userCarrers.map(item => item.carrerId)).andWhere("active", "=", true);
    return carrers as any;
}
