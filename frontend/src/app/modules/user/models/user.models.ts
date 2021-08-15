export type UserCreateModel = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  level: number;
  hasActive: boolean;
};

export type UserUpdateModel = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  level: number;
  hasActive: boolean;
};
