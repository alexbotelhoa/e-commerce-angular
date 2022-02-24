import { GQLQueryResolvers } from "../../resolvers-types";
import { selectBackup } from "../../shared/repositories/backup.repository";

export const backupQueryResolver: GQLQueryResolvers['backup'] = async (obj, params, context) => {
    const query = selectBackup(context.database);    
    query.orderBy('id', 'desc');
    if (params.id) {
        query.where('id', params.id);
    }
    if (params.name) {
        query.where('name', 'like', `%${params.name}%`);
    }
    if (!params.withAutomatic) {
        query.where('name', 'not like', `%automatic%`);
    }
    return await query;
}
