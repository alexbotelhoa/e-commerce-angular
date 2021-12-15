import { GQLQueryResolvers } from "../../../../resolvers-types";
import { selectBackup } from "../../../../shared/repositories/backup.repository";

export const backupQueryResolver: GQLQueryResolvers['backup'] = async (obj, params, context) => {
    const query = selectBackup(context.database);    
    if (params.id) {
        query.where('id', params.id);
    }
    return await query;
}
