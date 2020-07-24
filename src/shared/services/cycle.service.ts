import { GQLCycleData } from "../../resolvers-types"
import { DatabaseService } from "./database.service";
import { getOneOrFail } from "../utils/get-one-or-null.util";
import { CYCLE_TABLE, CycleEntity } from "../../entities/cycle.entity"

export const insert =
    (db: DatabaseService) =>
        (data: Partial<CycleEntity> | Array<Partial<CycleEntity>>): Promise<number> => {
            return db.insert(data).into(CYCLE_TABLE).then(getOneOrFail);
        }
