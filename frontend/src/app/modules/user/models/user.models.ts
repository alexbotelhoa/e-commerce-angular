export type UserCreateModel = {
  name: string;
  email: string;
  cpf: number;
  phone: number;
};

export type UserUpdateModel = {
  id: number;
  name: string;
  email: string;
  cpf: number;
  phone: number;
};
