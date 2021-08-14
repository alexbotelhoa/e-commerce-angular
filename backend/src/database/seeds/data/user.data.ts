import { UserEntity } from "../../../entities/user.entity";

export const usersData: Pick<
  UserEntity,
  "name" | "email" | "cpf" | "phone" | "level"
>[] = [
  {
    name: "Alex Botelho",
    email: "alexbotelho@hotmail.com",
    cpf: 11111111111,
    phone: 45999991111,
    level: 1,
  },
  {
    name: "Luciana Botelho",
    email: "lucianabotelho@hotmail.com",
    cpf: 22222222222,
    phone: 45999992222,
    level: 2,
  },
  {
    name: "Marcel Botelho",
    email: "marcelbotelho@hotmail.com",
    cpf: 33333333333,
    phone: 45999993333,
    level: 3,
  },
  {
    name: "Ítalo Botelho",
    email: "italobotelho@hotmail.com",
    cpf: 44444444444,
    phone: 45999994444,
    level: 3,
  },
];
