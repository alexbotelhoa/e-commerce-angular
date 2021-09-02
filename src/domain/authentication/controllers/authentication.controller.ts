import { FastifyReply, FastifyRequest } from "fastify";
import { RoleId } from "../../authorization/enums/role-id.enum";
import { JWTPayload } from "../types/jwt-payload.type";
import { DatabaseService } from "../../../shared/services/database.service";
import { insertUserRole, selectUserRole } from "../../../shared/repositories/user-role.repository";
import { EnrollmentEntity } from "../../../entities/enrollment.entity";
import * as t from "io-ts";
import { EnrollmentClassEntity } from "../../../entities/enrollment-class.entity";
import { getUserById, updateUser } from "../../../shared/repositories/user.repository";
import { horizonOneRole } from "../../authorization/constants/roles.constants";

const TurmaType = t.type({
    Id: t.union([t.Int, t.string]),
    Nome: t.string,
    carreira: t.union([t.string, t.undefined]),
    instituicao: t.union([t.string, t.undefined]),
    periodo: t.union([t.string, t.undefined]),
    sessao: t.union([t.string, t.undefined]),
    dataInicio: t.union([t.string, t.undefined]),
    dataFim: t.union([t.string, t.undefined]),
});



const AuthenticationInput = t.type({
    Id: t.union([t.Int, t.string]),
    accountId: t.union([t.undefined, t.string]),
    isAdult: t.union([t.undefined, t.boolean])
});

const exactAuthenticationInput = t.exact(AuthenticationInput);

type EnrollmentWithClasses = Omit<EnrollmentEntity, 'id'> & {
    classes: Omit<EnrollmentClassEntity, 'id' | 'enrollmentId'>[];
}


export const authenticationController = (redirectUrl: string, db: DatabaseService, readonlyDb: DatabaseService) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {

    const decodedBody = exactAuthenticationInput.decode(request.body);
    if (decodedBody._tag === 'Left') {
        throw new Error(`invalid input`);
    }

    const body = decodedBody.right;

    request.log.info(body, 'Received authentication request');

    const userId = body.Id.toString();
    const userEntity = await getUserById(readonlyDb)(userId);
    const userRoles = await selectUserRole(readonlyDb).andWhere('userId', userId);

    // we're using an array of roles here for shorter JWT payload
    const roles: RoleId[] = userRoles.map(userRole => userRole.roleId);
    const hasHorizonOneRole = userRoles.some(role => role.roleId === horizonOneRole.id)
    if (userEntity) {
        if (body.accountId) {
            await updateUser(db)({
                accountId: body.accountId
            })(where => where.andWhere('id', userEntity.id));
        }
        if ("isAdult" in body && body.isAdult !== undefined) {
            await updateUser(db)({
                isAdult: body.isAdult
            })(where => where.andWhere('id', userEntity.id));
        }
        if (!hasHorizonOneRole) {
            await insertUserRole(db)({
                roleId: RoleId.HORIZON_ONE,
                userId: userId,
            });
        }
        const jwtPayload: JWTPayload = {
            userId: userId.toString(),
            roles: roles,
        }

        const jwt = await reply.jwtSign(jwtPayload);
        reply.status(200).send({
            url: `${redirectUrl}?jwt=${jwt}`,
        });
    } else {
        reply.status(404).send({
            msg: `user not found`,
        });
    }

}