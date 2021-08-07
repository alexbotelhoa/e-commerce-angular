export type ProductCreateModel = {
  name: string;
  price: number;
  categoryId: number;
};

export type ProductUpdateModel = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
};
