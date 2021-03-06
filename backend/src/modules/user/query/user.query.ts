import { GQLQueryResolvers } from "../../../resolvers-types";
import {
  getUserById,
  selectUser,
} from "../../../shared/repositories/user.repository";

export const userAllQueryResolver: GQLQueryResolvers["userAll"] = async (
  obj,
  params,
  context
) => {
  return await selectUser(context.readonlyDatabase);
};

export const userByIdQueryResolver: GQLQueryResolvers["userById"] = async (
  obj,
  params,
  context
) => {
  return await getUserById(context.readonlyDatabase)(params.id);
};

export const userByFieldQueryResolver: GQLQueryResolvers["userByField"] =
  async (obj, { fields }, context) => {
    const query = selectUser(context.readonlyDatabase);

    if (fields) {
      if (fields.name && fields.name.length > 0) {
        query.where("name", "like", `%${fields.name}%`);
      }
      if (fields.email && fields.email.length > 0) {
        query.where("email", "like", `%${fields.email}%`);
      }
      if (fields.cpf && fields.cpf.length > 0) {
        query.where("cpf", "like", `%${fields.cpf}%`);
      }
      if (fields.phone && fields.phone.length > 0) {
        query.where("phone", "like", `%${fields.phone}%`);
      }
      if (fields.level && fields.level > 0) {
        query.where("level", "=", `%${fields.level}%`);
      }
      if (fields.hasActive) {
        query.where("hasActive", "=", `%${fields.hasActive}%`);
      }
    }

    return await query;
  };
