import * as Knex from "knex";
// import { RoleId } from "../../src/resolvers-types";
// import { UserRoleEntity, USER_ROLE_TABLE } from "../../src/entities/user-role.entity";

// const data = [
//   { userId: '780659', roleId: RoleId.ADMIN }, // fran
//   { userId: '1146757', roleId: RoleId.ADMIN }, // ivan
//   { userId: '1145693', roleId: RoleId.ADMIN }, // marcio
//   { userId: '1152298', roleId: RoleId.ADMIN }, // Tamires
//   { userId: '10244986', roleId: RoleId.ADMIN }, // Alexandre
//   { userId: '1146129', roleId: RoleId.ADMIN }, // Rafael Rodrigues
//   { userId: '1146632', roleId: RoleId.ADMIN }, // Lucas Rigonato
// ] as UserRoleEntity[];

export async function up(knex: Knex): Promise<void> {
  // await knex(USER_ROLE_TABLE).insert(data);
}

export async function down(knex: Knex): Promise<void> {
  // await knex(USER_ROLE_TABLE)
  //   .del()
  //   .where({ roleId: RoleId.ADMIN })
  //   .whereIn('userId', data.map(item => item.userId));
}