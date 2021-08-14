export interface UserEntity {
  id: number;
  name: string;
  email: string;
  cpf: number;
  phone: number;
  createdAt: string;
  updatedAt: string;
}

export const USER_TABLE = "user";
