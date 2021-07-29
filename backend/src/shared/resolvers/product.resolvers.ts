import { GQLProductResolvers } from "../../resolvers-types";
import { ProductEntity } from "../../entities/product.entity";
import { selectCategory } from "../repositories/category.repository";

const productEntityResolvers: Pick<GQLProductResolvers, keyof ProductEntity> = {
  id: obj => obj.id.toString(),
  name: obj => obj.name,
  price: obj => obj.price,
  categoryId: obj => obj.categoryId.toString(),
  createdAt: obj => obj.createdAt,
  updatedAt: obj => obj.updatedAt,
}

export const productResolvers: GQLProductResolvers = {
  ...productEntityResolvers,
  category: async (obj, params, context) => await selectCategory(context.database).where("id", obj.categoryId),
};
