import * as Knex from "knex";
import * as faker from 'faker';
import { UserEntity } from "../../src/entities/user.entity";
import { RoleId } from "../../src/domain/authorization/enums/role-id.enum";
import { concatArrayReducer } from "../../src/shared/utils/concat-array-reducer";
import { deleteAllUsers, insertUser } from "../../src/shared/repositories/user.repository";
import { deleteAllUserRoles, insertUserRole } from "../../src/shared/repositories/user-role.repository";

export const adminUserSeed: UserEntityWithRoles = {
    id: '1',
    name: 'ADMIN',
    onboarded: false,
    avatarId: null,
    macId: '',
    macPass: '',
    roles: [RoleId.ADMIN],
}

export const teacherUserSeed: UserEntityWithRoles = {
    id: '2',
    name: 'TEACHER',
    onboarded: false,
    avatarId: null,
    macId: '',
    macPass: '',
    roles: [RoleId.TEACHER],
}

export const studentUserSeed: UserEntityWithRoles = {
    id: '3',
    name: 'STUDENT',
    onboarded: false,
    avatarId: null,
    macId: '',
    macPass: '',
    roles: [RoleId.STUDENT],
}

export const guardianUserSeed: UserEntityWithRoles = {
    id: '4',
    name: 'GUARDIAN',
    onboarded: false,
    avatarId: null,
    macId: '',
    macPass: '',
    roles: [RoleId.GUARDIAN],
}

export const fullUserSeed: UserEntityWithRoles = {
    id: '999999',
    name: 'FULL',
    onboarded: false,
    avatarId: null,
    macId: '',
    macPass: '',
    roles: [
        RoleId.ADMIN,
        RoleId.TEACHER,
        RoleId.STUDENT,
        RoleId.GUARDIAN,
        RoleId.HORIZON_ONE,
    ],
}

interface UserEntityWithRoles extends Omit<UserEntity, "accountId" | "isAdult"> {
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
    await insertUser(knex)(userSeeds.map<Omit<UserEntity, "accountId">>(user => ({
        id: user.id,
        name: user.name,
        onboarded: false,
        macId: '',
        macPass: '',
        avatarId: null,
        isAdult: false,
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
        id: id.toString(),
        name: `${faker.name.firstName()} ${faker.name.lastName()} ${faker.name.lastName()}`,
        onboarded: false,
        avatarId: null,
        macId: '',
        macPass: '',
        roles: [
            roleId,
        ]
    };
}

