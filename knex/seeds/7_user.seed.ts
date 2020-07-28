import * as Knex from "knex";
import * as faker from 'faker';
import { deleteAllUsers, insertUser } from "../../src/shared/repositories/user.repository";
import { UserEntity } from "../../src/entities/user.entity";
import { deleteAllUserRoles, insertUserRole } from "../../src/shared/repositories/user-role.repository";
import { RoleId } from "../../src/domain/authorization/enums/role-id.enum";
import { UserRoleEntity } from "../../src/entities/user-role.entity";

interface UserEntityWithRoles extends UserEntity {
    roles: RoleId[];
}

const users: UserEntityWithRoles[] = [
    {
        id: 1,
        name: 'ADMIN',
        roles: [RoleId.ADMIN],
    },
    {
        id: 2,
        name: 'TEACHER',
        roles: [RoleId.TEACHER],
    },
    {
        id: 3,
        name: 'STUDENT',
        roles: [RoleId.STUDENT],
    },
    {
        id: 4,
        name: 'GUARDIAN',
        roles: [RoleId.GUARDIAN],
    },
];

for (let index = 5; index <= 30; index++) {
    users.push(generateUser(index))
}

export { users };

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllUserRoles(knex);
    await deleteAllUsers(knex);

    // Inserts seed entries
    await insertUser(knex)(users.map<UserEntity>(user => ({
        id: user.id,
        name: user.name,
    })));
    await insertUserRole(knex)(users.map<Omit<UserRoleEntity, 'id'>>(user => ({
        roleId: user.roles[0],
        userId: user.id,
    })));
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

