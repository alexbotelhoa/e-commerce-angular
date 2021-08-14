import { UserEntity } from "../../entities/user.entity";
import { GQLUserResolvers } from "../../resolvers-types";

const userEntityResolvers: Pick<GQLUserResolvers, keyof UserEntity> = {
  id: (obj) => obj.id.toString(),
  name: (obj) => obj.name,
  email: (obj) => obj.email,
  cpf: (obj) => obj.cpf.toString(),
  phone: (obj) => obj.phone.toString(),
  level: (obj) => obj.level,
  hasActive: (obj) => obj.hasActive,
  createdAt: (obj) => obj.createdAt,
  updatedAt: (obj) => obj.updatedAt,
};

export const userResolvers: GQLUserResolvers = {
  ...userEntityResolvers,
};
