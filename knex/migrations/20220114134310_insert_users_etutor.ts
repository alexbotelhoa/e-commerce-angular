import * as Knex from "knex";
// import { UserRoleEntity, USER_ROLE_TABLE } from "../../src/entities/user-role.entity";
// import { RoleId } from "../../src/resolvers-types";

// const data = [
//   { userId: '1145693', roleId: RoleId.E_TUTOR }, // MARCIO RODRIGO SEMENTINO OLIVEIRA
//   { userId: '1146630', roleId: RoleId.E_TUTOR }, // CAIO VALENZUELA COPATTO
//   { userId: '1154571', roleId: RoleId.E_TUTOR }, // ALEX RIOS
// ] as UserRoleEntity[];

export async function up(knex: Knex): Promise<void> {
  // await knex(USER_ROLE_TABLE).insert(data);
}


export async function down(knex: Knex): Promise<void> {
  // await knex(USER_ROLE_TABLE)
  //   .del()
  //   .where({ roleId: RoleId.E_TUTOR })
  //   .whereIn('userId', data.map(item => item.userId));
}