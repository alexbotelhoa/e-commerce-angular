export interface ProductEntity {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
}

export const PRODUCT_TABLE = 'product';
