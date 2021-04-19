
import { GQLMutationResolvers } from "../../../resolvers-types";
import { insertLog } from "../../../shared/repositories/log.repository";
import { callAudit } from "../../user/services/audit.service";

export const auditResolver: GQLMutationResolvers['audit'] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) throw new Error("user not found")
    try {
        await callAudit({
            id_plataforma: params.data.id_plataforma,
            id_recurso: params.data.id_recurso,
            id_turma: params.data.id_turma,
            userId: userId,
        }, context.logger);
        await insertLog(context.database)({
            status: "audit-success",
            key: params.data.id_turma,
            body: JSON.stringify({ ...params.data, tentativas: 1 })
        })
        return true;
    } catch (error) {
        await insertLog(context.database)({
            status: "audit-error",
            key: params.data.id_turma,
            body: JSON.stringify({ ...params.data, tentativas: 1 })
        })
        return false;
    }


}