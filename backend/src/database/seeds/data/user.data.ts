import { UserEntity } from "../../../entities/user.entity";

export const usersData: Pick<UserEntity, "name" | "email" | "cpf" | "phone">[] =
  [
    {
      name: "Alex Botelho",
      email: "alexbotelho@hotmail.com",
      cpf: 111111111,
      phone: 99991111,
    },
    {
      name: "Luciana Botelho",
      email: "lucianabotelho@hotmail.com",
      cpf: 222222222,
      phone: 99992222,
    },
    {
      name: "Marcel Botelho",
      email: "marcelbotelho@hotmail.com",
      cpf: 333333333,
      phone: 99993333,
    },
    {
      name: "Ítalo Botelho",
      email: "italobotelho@hotmail.com",
      cpf: 444444444,
      phone: 99994444,
    },
  ];
