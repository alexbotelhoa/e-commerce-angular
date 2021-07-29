import { GQLCategoryResolvers } from "../../resolvers-types";
import { CategoryEntity } from "../../entities/category.entity";
import { selectProduct } from "../repositories/product.repository";

const categoryEntityResolvers: Pick<GQLCategoryResolvers, keyof CategoryEntity> = {
  id: obj => obj.id.toString(),
  name: obj => obj.name,
  createdAt: obj => obj.createdAt,
  updatedAt: obj => obj.updatedAt,
}

export const categoryResolvers: GQLCategoryResolvers = {
  ...categoryEntityResolvers,
  products: async (obj: any, params, context) => await selectProduct(context.database).where('categoryId', obj.id),
};
