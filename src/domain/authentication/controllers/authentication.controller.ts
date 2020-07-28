import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticationBody } from "../types/authentication.types";
import { RoleId } from "../../authorization/enums/role-id.enum";
import { JWTPayload } from "../types/jwt-payload.type";

export const authenticationController = (redirectUrl: string) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body: AuthenticationBody = request.body as any;

    // use userId = 1 as default for now
    const userId = body.Id || 1;

    // we're using an array of roles here for shorter JWT payload
    const roles: RoleId[] = [
        // adding admin role by default for now, we have no way to infer it from body
        RoleId.ADMIN,
    ];

    // infer guardian role
    if (body["Alunos-Responsavel"].length > 0) {
        roles.push(RoleId.GUARDIAN);
    }

    // infer student role
    if (body["Matriculas-Aluno"].length > 0) {
        roles.push(RoleId.STUDENT);
    }

    // infer teacher role
    if (body["Turmas-Professor"].length > 0) {
        roles.push(RoleId.TEACHER);
    }

    const jwtPayload: JWTPayload = {
        userId: userId,
        roles: roles,
    }

    const jwt = await reply.jwtSign(jwtPayload);
    reply.redirect(`${redirectUrl}?jwt=${jwt}`);
}
