import { ProductEntity } from "../../../entities/product.entity";

export const productsData: Pick<ProductEntity, "name" | "price" | "categoryId">[] = [
    {
        name: 'Celular',
        price: 1000,
        categoryId: 1,
    },
    {
        name: 'Televisão',
        price: 2000,
        categoryId: 1,
    },
    {
        name: 'Sofá',
        price: 10000,
        categoryId: 2,
    },
    {
        name: 'Mesa',
        price: 20000,
        categoryId: 2,
    },
    {
        name: 'Furadeira',
        price: 100000,
        categoryId: 3,
    },
    {
        name: 'Serra Circular',
        price: 200000,
        categoryId: 3,
    }
]
