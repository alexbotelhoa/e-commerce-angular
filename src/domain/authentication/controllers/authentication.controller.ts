import { FastifyReply, FastifyRequest } from "fastify";
import { RoleId } from "../../authorization/enums/role-id.enum";
import { JWTPayload } from "../types/jwt-payload.type";
import { DatabaseService } from "../../../shared/services/database.service";
import { selectUserRole } from "../../../shared/repositories/user-role.repository";
import { EnrollmentEntity } from "../../../entities/enrollment.entity";
import * as t from "io-ts";
import { EnrollmentClassEntity } from "../../../entities/enrollment-class.entity";

const AlunosResponsavel = t.type({
    Id: t.union([t.Int, t.string]),
    Nome: t.string,
});

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

const TurmaProfessorType = t.type({
    Id: t.union([t.Int, t.string]),
    Nome: t.string,
});

const MatriculasAluno = t.type({
    Id: t.Int,
    Nome: t.string,
    Turmas: t.array(TurmaType),
});

const AuthenticationInput = t.type({
    Id: t.union([t.Int, t.string]),
});

const exactAuthenticationInput = t.exact(AuthenticationInput);

type EnrollmentWithClasses = Omit<EnrollmentEntity, 'id'> & {
    classes: Omit<EnrollmentClassEntity, 'id' | 'enrollmentId'>[];
}


export const authenticationController = (redirectUrl: string, db: DatabaseService) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {

    const decodedBody = exactAuthenticationInput.decode(request.body);
    if (decodedBody._tag === 'Left') {
        throw new Error(`invalid input`);
    }

    const body = decodedBody.right;

    request.log.info(body, 'Received authentication request');

    const userId = body.Id.toString();

    // const userEntity = await getUserById(db)(userId);

    // const turmasProfessor = body["Turmas-Professor"];

    const userRoles = await selectUserRole(db).andWhere('userId', userId);

    // we're using an array of roles here for shorter JWT payload
    const roles: RoleId[] = userRoles.map(userRole => userRole.roleId);

    const jwtPayload: JWTPayload = {
        userId: userId.toString(),
        roles: roles,
    }

    const jwt = await reply.jwtSign(jwtPayload);
    reply.status(200).send({
        url: `${redirectUrl}?jwt=${jwt}`,
    });

}

// async function insertEnrollmentWithClasses(db: DatabaseService<any, any>, element: EnrollmentWithClasses) {
//     const enrollmentId = await insertEnrollment(db)(pickEnrollmentForInsert(element));
//     const enrollmentClassesToInsert = element.classes.map<Omit<EnrollmentClassEntity, 'id'>>(enrollClass => ({
//         classId: enrollClass.classId,
//         enrollmentId: enrollmentId,
//     }));
//     if (enrollmentClassesToInsert.length > 0) {
//         await insertEnrollmentClass(db)(enrollmentClassesToInsert);
//     }
// }

// async function consolidateUserRoles(
//     db: DatabaseService,
//     userId: string,
//     userRoleEntities: Pick<UserRoleEntity, "userId" | "roleId">[],
// ) {
//     // user already exists, we need to make a diff on the other entities
//     const existingUserRoles = await selectUserRole(db).andWhere('userId', userId);
//     const userRoleFinder: ConsolidateFinder<Pick<UserRoleEntity, "userId" | "roleId">> =
//         (userRoles, userRoleToFind) => Boolean(userRoles.find(userRole => userRole.roleId === userRoleToFind.roleId));
//     const consolidation = consolidateEntities(userRoleFinder)(existingUserRoles, userRoleEntities);
//     const idsToDelete = consolidation.toDelete.map(role => role.roleId);
//     const entitiesToInsert = consolidation.toInsert;
//     if (idsToDelete.length > 0) {
//         await deleteUserRole(db)(builder => builder.andWhere('userId', userId).whereIn('roleId', idsToDelete));
//     }
//     if (entitiesToInsert.length > 0) {
//         await insertUserRole(db)(entitiesToInsert);
//     }
// }

// async function consolidateUserEnrollments(
//     db: DatabaseService,
//     userId: string,
//     enrollmentEntities: EnrollmentWithClasses[],
// ) {
//     const existingEnrollments = await selectEnrollment(db).andWhere('userId', userId);
//     const enrollmentFinder: ConsolidateFinder<Pick<EnrollmentEntity, "userId" | "levelCodeId">> =
//         (enrollments, enrollmentToFind) => Boolean(enrollments.find(enrollment => enrollment.levelCodeId === enrollmentToFind.levelCodeId));
//     const consolidation = consolidateEntities<Pick<EnrollmentEntity, "userId" | "levelCodeId">, EnrollmentWithClasses>(
//         enrollmentFinder
//     )(existingEnrollments, enrollmentEntities);
//     const idsToDelete = consolidation.toDelete.map(enrollment => enrollment.levelCodeId);
//     const entitiesToInsert = consolidation.toInsert;

//     if (idsToDelete.length > 0) {
//         await deleteEnrollment(db)(builder => builder.andWhere('userId', userId).whereIn('levelCodeId', idsToDelete));
//     }

//     const entitiesToUpdate = consolidation.toUpdate;
//     if (entitiesToUpdate.length > 0) {
//         const savedEnrollmentsToUpdate = existingEnrollments.filter(existing => {
//             return Boolean(entitiesToUpdate.find(toUpdate => toUpdate.levelCodeId === existing.levelCodeId));
//         });
//         for (const enrollmentToUpdate of savedEnrollmentsToUpdate) {
//             const enrollmentId = enrollmentToUpdate.id;
//             const newEnrollmentToUpdate = entitiesToUpdate.find(entity => entity.levelCodeId === enrollmentToUpdate.levelCodeId)!;
//             const savedEnrollmentClasses = await selectEnrollmentClass(db)
//                 .andWhere('enrollmentId', enrollmentId);
//             const savedEnrollmentClassIds = savedEnrollmentClasses.map(savedEnrollmentClass => savedEnrollmentClass.classId);
//             // we need to find the new classes only to actually know if we need to do anything here
//             const newClasses = newEnrollmentToUpdate.classes
//                 .filter((newClass) => !savedEnrollmentClassIds.find(savedClassId => savedClassId === newClass.classId));
//             if (newClasses.length === 0) {
//                 continue;
//             }
//             const sameClassIds = savedEnrollmentClassIds.filter(saved => newEnrollmentToUpdate.classes.find(enrollment => enrollment.classId === saved));
//             const enrollmentClassesToDelete = savedEnrollmentClasses
//                 .filter(saved => !newEnrollmentToUpdate.classes.find(currentClass => currentClass.classId === saved.classId));
//             const enrollmentClassesToDeleteClassIds = enrollmentClassesToDelete.map(classToDelete => classToDelete.classId);
//             const enrollmentClassesToDeleteIds = enrollmentClassesToDelete.map(classToDelete => classToDelete.id);
//             const activitiesToTransitionToNewClasses = await selectActivityTimer(db)
//                 .whereIn('classId', enrollmentClassesToDeleteClassIds.concat(sameClassIds))
//                 .andWhere('userId', userId);
//             const activityTimerEntitiesToSave = newClasses
//                 .reduce<Omit<ActivityTimerEntity, 'id'>[]>((acc, newClass) => {
//                     const newActivityTimerEntities = activitiesToTransitionToNewClasses
//                         .map<Omit<ActivityTimerEntity, 'id'>>(saved => ({
//                             classId: newClass.classId,
//                             completed: saved.completed,
//                             completionTime: saved.completionTime,
//                             cycleActivityId: saved.cycleActivityId,
//                             startTime: saved.startTime,
//                             userId: saved.userId,
//                         }));
//                     return acc.concat(newActivityTimerEntities);
//                 }, []);
//             const newEnrollmentClassEntitiesToInsert = newClasses.map<Omit<EnrollmentClassEntity, 'id'>>(newClass => ({
//                 classId: newClass.classId,
//                 enrollmentId: enrollmentToUpdate.id,
//             }));
//             if (activityTimerEntitiesToSave.length > 0
//                 || newEnrollmentClassEntitiesToInsert.length > 0
//                 || enrollmentClassesToDeleteIds.length > 0
//             ) {
//                 await db.transaction(async trx => {
//                     if (activityTimerEntitiesToSave.length > 0) {
//                         await insertActivityTimer(trx)(activityTimerEntitiesToSave);
//                     }
//                     if (newEnrollmentClassEntitiesToInsert.length > 0) {
//                         await insertEnrollmentClass(trx)(newEnrollmentClassEntitiesToInsert);
//                     }
//                     if (enrollmentClassesToDeleteIds.length > 0) {
//                         await deleteEnrollmentClass(trx)(builder => builder.whereIn('id', enrollmentClassesToDeleteIds));
//                     }
//                 })
//             }
//         }

//     }

//     if (entitiesToInsert.length > 0) {
//         for (let index = 0; index < entitiesToInsert.length; index++) {
//             const element = entitiesToInsert[index];
//             await insertEnrollmentWithClasses(db, element);
//         }
//     }
// }



// async function consolidateGuardianStudents(
//     db: DatabaseService,
//     userId: string,
//     guardianStudents: GuardianStudentEntity[],
// ) {
//     const existingGuardianStudents = await selectGuardianStudent(db).andWhere('guardianId', userId);
//     const guardianStudentFinder: ConsolidateFinder<GuardianStudentEntity> =
//         (guardianStudents, guardianStudentToFind) => Boolean(guardianStudents.find(teacherClass => teacherClass.studentId === guardianStudentToFind.studentId));
//     const consolidation = consolidateEntities(guardianStudentFinder)(existingGuardianStudents, guardianStudents);
//     const idsToDelete = consolidation.toDelete.map(enrollment => enrollment.studentId);
//     const entitiesToInsert = consolidation.toInsert;

//     if (idsToDelete.length > 0) {
//         await deleteGuardianStudent(db)(builder => builder.andWhere('guardianId', userId).whereIn('studentId', idsToDelete));
//     }
//     if (entitiesToInsert.length > 0) {
//         await insertGuardianStudent(db)(entitiesToInsert);
//     }
// }

