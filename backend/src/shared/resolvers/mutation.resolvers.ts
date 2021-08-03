import { GQLResolvers, GQLMutationResolvers } from "../../resolvers-types";

import {
    createUserMutationResolver,
    updateUserMutationResolver,
    deleteUserMutationResolver,
} from "../../modules/user/mutation/user.mutation";
import {
    createCategoryMutationResolver,
    updateCategoryMutationResolver,
    deleteCategoryMutationResolver,
} from "../../modules/category/mutation/category.mutation";
import {
    createProductMutationResolver,
    updateProductMutationResolver,
    deleteProductMutationResolver,
} from "../../modules/product/mutation/product.mutation";

const userEntityResolvers: Pick<
    GQLMutationResolvers,
    "createUser" | "updateUser" | "deleteUser"
> = {
    createUser: createUserMutationResolver,
    updateUser: updateUserMutationResolver,
    deleteUser: deleteUserMutationResolver,
};

const categoryEntityResolvers: Pick<
    GQLMutationResolvers,
    "createCategory" | "updateCategory" | "deleteCategory"
> = {
    createCategory: createCategoryMutationResolver,
    updateCategory: updateCategoryMutationResolver,
    deleteCategory: deleteCategoryMutationResolver,
};

const productEntityResolvers: Pick<
    GQLMutationResolvers,
    "createProduct" | "updateProduct" | "deleteProduct"
> = {
    createProduct: createProductMutationResolver,
    updateProduct: updateProductMutationResolver,
    deleteProduct: deleteProductMutationResolver,
};

export const mutationResolvers: GQLResolvers["Mutation"] = {
    ...userEntityResolvers,
    ...categoryEntityResolvers,
    ...productEntityResolvers,
};
