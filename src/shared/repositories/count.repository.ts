import { CountEntity, COUNT_TABLE } from "../../entities/count.entity";
import { DatabaseService } from "../services/database.service";
import { createRepository } from "../services/repository.service";

export const {
    getById: getCountById,
    getManyByIds: getCountsByIds,
    insert: insertCount,
    select: selectCount,
    update: updateCount,
    delete: deleteCount,
    deleteAll: deleteAllCounts,
    count: countCounts,
} = createRepository<CountEntity>(COUNT_TABLE, 'id');


export const upsertCountEntity = async (entity: string, db: DatabaseService) => {
    const count = await selectCount(db).where("name", "=", entity).first()
    if (!count) {
        await insertCount(db)({
            count: 1,
            name: entity
        })
    } else {
        await updateCount(db)({
            count: count.count + 1
        })(db => db.where("id", "=", count.id))
    }
}