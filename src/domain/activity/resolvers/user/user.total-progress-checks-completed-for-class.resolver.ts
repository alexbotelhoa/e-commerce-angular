import { ACTIVITY_TIMER_TABLE } from "../../../../entities/activities/activity-timer.entity";
import { GQLUserResolvers } from "../../../../resolvers-types";
import { CountObj } from "../../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../../shared/utils/dataloader-count-sort";

export const userTotalProgressChecksCompletedForClassResolver: GQLUserResolvers['totalProgressChecksCompletedForClass'] =
    async (obj, args, context) => {
        const dataloader = context.getDatabaseLoader(userTotalProgressChecksCompletedForClassLoader, args.classId);
        return dataloader.load(obj.id);

    }

export type UserTotalProgressChecksCompletedForClassRow = CountObj & {
    userId: string;
}

export const userTotalProgressChecksCompletedForClassSorter =
    createDataloaderCountSort<UserTotalProgressChecksCompletedForClassRow, string>('userId');

export const userTotalProgressChecksCompletedForClassLoader
    : DatabaseLoaderFactory<string, number, number, string> = {
    id: 'userTotalProgressChecksCompletedForClassLoader',
    batchFn: (db, classId) => async (userIds) => {
        const entities: UserTotalProgressChecksCompletedForClassRow[] = await db
            .count('*')
            .select([`${ACTIVITY_TIMER_TABLE}.userId AS userId`])
            .from(ACTIVITY_TIMER_TABLE)
            .whereIn(`${ACTIVITY_TIMER_TABLE}.userId`, userIds)
            .andWhere(`${ACTIVITY_TIMER_TABLE}.classId`, classId)
            .groupBy(`${ACTIVITY_TIMER_TABLE}.userId`);

        // FALTA COLOCAR OS JOINS COM ACTIVITY PARA PEGAR O NOME DA ATIVIDADE E VERIFICAR QUE É PROGRESS CHECK

        return userTotalProgressChecksCompletedForClassSorter(userIds)(entities);
    }
}
