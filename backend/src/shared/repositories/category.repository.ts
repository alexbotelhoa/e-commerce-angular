import { createRepository } from "../services/repository.service";
import { CategoryEntity, CATEGORY_TABLE } from "../../entities/category.entity";

export const {
    getById: getCategoryById,
    getManyByIds: getCategoriesByIds,
    select: selectCategory,
    insert: insertCategory,
    update: updateCategory,
    delete: deleteCategory,
    deleteAll: deleteAllCategories,
    count: countCategories,
} = createRepository<CategoryEntity>(CATEGORY_TABLE, 'id');
