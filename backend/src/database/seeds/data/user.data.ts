import { UserEntity } from "../../../entities/user.entity";

export const usersData: Pick<UserEntity, "name" | "email" | "cpf" | "telephone">[] = [
  {
    name: "Alex Botelho",
    email: "alexbotelho@hotmail.com",
    cpf: 12345678901,
    telephone: 45987654321,
  },
  {
    name: "Luciana Botelho",
    email: "lucianabotelho@hotmail.com",
    cpf: 12345678901,
    telephone: 45987654321,
  },
  {
    name: "Marcel Botelho",
    email: "marcelbotelho@hotmail.com",
    cpf: 12345678901,
    telephone: 45987654321,
  },
  {
    name: "Ítalo Botelho",
    email: "italobotelho@hotmail.com",
    cpf: 12345678901,
    telephone: 45987654321,
  },
];
