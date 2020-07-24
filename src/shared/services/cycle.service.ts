import Knex from "knex";
import { GQLCycleData } from "../../resolvers-types"
import { DatabaseService } from "./database.service";
import { getOneOrFail } from "../utils/get-one-or-null.util";
import { CYCLE_TABLE } from "../../entities/cycle.entity"

export const insert =
    (db: DatabaseService) =>
        (data: GQLCycleData): Promise<number> => {
            const { activityIds } = data,
                insertData = { ...data }

            delete insertData['activityIds']

            if (activityIds) {
                // future for creating relationships with activities
            }

            return db.insert(insertData).into(CYCLE_TABLE).then(getOneOrFail);
        }
