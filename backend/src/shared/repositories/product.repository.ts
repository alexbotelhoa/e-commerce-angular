import { createRepository } from "../services/repository.service";
import { ProductEntity, PRODUCT_TABLE } from "../../entities/product.entity";

export const {
    getById: getProductById,
    getManyByIds: getProductsByIds,
    select: selectProduct,
    insert: insertProduct,
    update: updateProduct,
    delete: deleteProduct,
    deleteAll: deleteAllProducts,
    count: countProducts,
} = createRepository<ProductEntity>(PRODUCT_TABLE, 'id');
