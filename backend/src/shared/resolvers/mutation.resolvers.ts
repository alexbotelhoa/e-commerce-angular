import { GQLResolvers, GQLMutationResolvers } from "../../resolvers-types";

import {
    createUserMutationResolver,
    updateUserMutationResolver,
} from "../../modules/user/mutation/user.mutation";
import {
    createCategoryMutationResolver,
    updateCategoryMutationResolver,
} from "../../modules/category/mutation/category.mutation";
import {
    createProductMutationResolver,
    updateProductMutationResolver,
} from "../../modules/product/mutation/product.mutation";

const userEntityResolvers: Pick<
    GQLMutationResolvers,
    "createUser" | "updateUser"
> = {
    createUser: createUserMutationResolver,
    updateUser: updateUserMutationResolver,
};

const categoryEntityResolvers: Pick<
    GQLMutationResolvers,
    "createCategory" | "updateCategory"
> = {
    createCategory: createCategoryMutationResolver,
    updateCategory: updateCategoryMutationResolver,
};

const productEntityResolvers: Pick<
    GQLMutationResolvers,
    "createProduct" | "updateProduct"
> = {
    createProduct: createProductMutationResolver,
    updateProduct: updateProductMutationResolver,
};

export const mutationResolvers: GQLResolvers["Mutation"] = {
    ...userEntityResolvers,
    ...categoryEntityResolvers,
    ...productEntityResolvers,
};
