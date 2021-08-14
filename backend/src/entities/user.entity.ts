export interface UserEntity {
  id: number;
  name: string;
  email: string;
  cpf: string | number;
  phone: string | number;
  level: number;
  hasActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const USER_TABLE = "user";
