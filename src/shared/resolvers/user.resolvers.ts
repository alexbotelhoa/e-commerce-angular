import { GQLResolvers, GQLUserResolvers } from "../../resolvers-types"
import { UserEntity } from "../../entities/user.entity";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { UserRoleEntity } from "../../entities/user-role.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { selectUserRole } from "../repositories/user-role.repository";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
}

const userUserRoleSorter = createDataloaderMultiSort<UserRoleEntity, number>('userId');

const userUserRoleDataloader: DatabaseLoaderFactory<number, UserRoleEntity[]> = (db) => ({
    batchFn: async (ids) => {
        const entities = await selectUserRole(db).whereIn('userId', ids);
        const sortedEntities = userUserRoleSorter(ids)(entities);
        return sortedEntities;
    }
})

export const userUserRolesResolver: GQLUserResolvers['userRoles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(userUserRoleDataloader);
    return dataloader.load(obj.id);
}

export const userResolvers: GQLResolvers['User'] = <GQLResolvers['User']>{
    ...userEntityResolvers,
    userRoles: userUserRolesResolver,
}


