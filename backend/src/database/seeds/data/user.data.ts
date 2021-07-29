import { UserEntity } from "../../../entities/user.entity";

export const usersData: Pick<UserEntity, "name" | "email">[] = [
    {
        name: 'Alex Botelho',
        email: 'alexbotelho@hotmail.com',
    },
    {
        name: 'Luciana Botelho',
        email: 'lucianabotelho@hotmail.com',
    },
    {
        name: 'Marcel Botelho',
        email: 'marcelbotelho@hotmail.com',
    },
    {
        name: 'Ítalo Botelho',
        email: 'italobotelho@hotmail.com',
    }
]
