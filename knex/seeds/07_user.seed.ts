import * as Knex from "knex";
import * as faker from 'faker';
import { deleteAllUsers, insertUser } from "../../src/shared/repositories/user.repository";
import { UserEntity } from "../../src/entities/user.entity";
import { deleteAllUserRoles, insertUserRole } from "../../src/shared/repositories/user-role.repository";
import { RoleId } from "../../src/domain/authorization/enums/role-id.enum";
import { UserRoleEntity } from "../../src/entities/user-role.entity";
import { concatArrayReducer } from "../../src/shared/utils/concat-array-reducer";

export const adminUserSeed: UserEntityWithRoles = {
    id: 1,
    name: 'ADMIN',
    roles: [RoleId.ADMIN],
}

export const teacherUserSeed: UserEntityWithRoles = {
    id: 2,
    name: 'TEACHER',
    roles: [RoleId.TEACHER],
}

export const studentUserSeed: UserEntityWithRoles = {
    id: 3,
    name: 'STUDENT',
    roles: [RoleId.STUDENT],
}

export const guardianUserSeed: UserEntityWithRoles = {
    id: 4,
    name: 'GUARDIAN',
    roles: [RoleId.GUARDIAN],
}

export const fullUserSeed: UserEntityWithRoles = {
    id: 5,
    name: 'FULL',
    roles: [
        RoleId.ADMIN,
        RoleId.TEACHER,
        RoleId.STUDENT,
        RoleId.GUARDIAN,
    ],
}

interface UserEntityWithRoles extends UserEntity {
    roles: RoleId[];
}

export const userSeeds: UserEntityWithRoles[] = [
    adminUserSeed,
    teacherUserSeed,
    studentUserSeed,
    guardianUserSeed,
    fullUserSeed,
];

for (let index = 6; index <= 30; index++) {
    userSeeds.push(generateUser(index))
}


export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllUserRoles(knex);
    await deleteAllUsers(knex);

    // Inserts seed entries
    await insertUser(knex)(userSeeds.map<UserEntity>(user => ({
        id: user.id,
        name: user.name,
    })));
    const rolesToInsert = userSeeds.map(user => user.roles.map(role => ({
        roleId: role,
        userId: user.id,
    })))
        .reduce(concatArrayReducer, []);
    await insertUserRole(knex)(rolesToInsert);
}


function generateUser(id: number): UserEntityWithRoles {
    const roleId = Math.round(faker.random.number({
        min: 1,
        max: 4,
    })) as RoleId;
    return {
        id: id,
        name: `${faker.name.firstName()} ${faker.name.lastName()} ${faker.name.lastName()}`,
        roles: [
            roleId,
        ]
    };
}

