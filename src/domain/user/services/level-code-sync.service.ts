import { FastifyLoggerInstance } from "fastify";
import { getLevelCodeById, insertLevelCode, updateLevelCode  } from "../../../shared/repositories/level-code.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { WebhookResponse, LevelCodeSyncEvent } from "../types/webhook-events.types";

export const processLevelCodeSync =
    (db: DatabaseService, log: FastifyLoggerInstance) => async (event: LevelCodeSyncEvent): Promise<WebhookResponse> => {
        const hasLevelCode = await getLevelCodeById(db)(event.data.levelCodeId)
        
        if (!hasLevelCode) {
            await insertLevelCode(db)({
                id: event.data.levelCodeId,
                active: event.data.active,
                code: event.data.code,
                description: event.data.description,
                levelId: null,
                learningMore: event.data.learningMore,
            });
        }
        else{
            await updateLevelCode(db)({
                active: event.data.active,
                code: event.data.code,
                description: event.data.description,
                learningMore: event.data.learningMore,
            })(qb => qb.andWhere('id', event.data.levelCodeId));
        }
        return {
            success: true,
        }
    }