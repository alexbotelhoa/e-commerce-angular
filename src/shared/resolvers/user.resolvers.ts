import { GQLUserResolvers } from "../../resolvers-types"
import { UserEntity } from "../../entities/user.entity";
import { createDataloaderMultiSort } from "../utils/dataloader-multi-sort";
import { UserRoleEntity } from "../../entities/user-role.entity";
import { DatabaseLoaderFactory } from "../types/database-loader.type";
import { selectUserRole } from "../repositories/user-role.repository";
import { getRoleById } from "../../domain/authorization/constants/roles.constants";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
    id: obj => obj.id.toString(),
    name: obj => obj.name,
}

const userUserRoleSorter = createDataloaderMultiSort<UserRoleEntity, number>('userId');

const userUserRoleDataloader: DatabaseLoaderFactory<number, UserRoleEntity[]> = {
    id: 'userUserRoleByUserId',
    batchFn: db => async (ids) => {
        const entities = await selectUserRole(db).whereIn('userId', ids);
        const sortedEntities = userUserRoleSorter(ids)(entities);
        return sortedEntities;
    }
};

export const userUserRolesResolver: GQLUserResolvers['userRoles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(userUserRoleDataloader, undefined);
    return dataloader.load(obj.id);
}

export const userRolesResolver: GQLUserResolvers['roles'] = async (obj, params, context) => {
    const dataloader = context.getDatabaseLoader(userUserRoleDataloader, undefined);
    const userRoles = await dataloader.load(obj.id);
    return userRoles.map(userRole => getRoleById(userRole.roleId));
}

export const userInitialsResolver: GQLUserResolvers['initials'] = obj => {
    const words = obj.name.split(" ");
    const firstWord = words[0];
    const lastWord = words.length > 1
        ? words[words.length - 1]
        : '';
    const firstChar = firstWord.charAt(0);
    const lastChar = lastWord.charAt(0);
    return `${firstChar}${lastChar}`;
}

export const userIsTeacherFieldResolver: GQLUserResolvers['isTeacher'] = (obj, params, context) => {
    return false;
}

export const totalAvailableActivitiesFieldResolver: GQLUserResolvers['totalAvailableActivities'] = (obj, params, context) => {
    return 100;
}

export const totalCompletedActivitiesFieldResolver: GQLUserResolvers['totalCompletedActivities'] = (obj, params, context) => {
    return 100;
}

export const userResolvers: GQLUserResolvers = {
    ...userEntityResolvers,
    initials: userInitialsResolver,
    userRoles: userUserRolesResolver,
    roles: userRolesResolver,
    isTeacher: userIsTeacherFieldResolver,
    totalCompletedActivities: totalCompletedActivitiesFieldResolver,
    totalAvailableActivities: totalAvailableActivitiesFieldResolver,
}


