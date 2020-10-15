import { FastifyReply, FastifyRequest } from "fastify";
import { RoleId } from "../../authorization/enums/role-id.enum";
import { JWTPayload } from "../types/jwt-payload.type";
import { DatabaseService } from "../../../shared/services/database.service";
import { getUserById, insertUser, updateUser, selectUser } from "../../../shared/repositories/user.repository";
import { insertUserRole, selectUserRole, deleteUserRole } from "../../../shared/repositories/user-role.repository";
import { UserRoleEntity } from "../../../entities/user-role.entity";
import { insertEnrollment, selectEnrollment, deleteEnrollment } from "../../../shared/repositories/enrollment.repository";
import { insertClass, selectClass, updateClass } from "../../../shared/repositories/class.repository";
import { ClassEntity } from "../../../entities/class.entity";
import { EnrollmentEntity } from "../../../entities/enrollment.entity";
import { concatArrayReducer } from "../../../shared/utils/concat-array-reducer";
import * as t from "io-ts";
import { ConsolidateFinder, consolidateEntities } from "../../../shared/utils/consolidate-entities";
import { TeacherClassEntity } from "../../../entities/teacher-class.entity";
import { insertTeacherClass, selectTeacherClass, deleteTeacherClass } from "../../../shared/repositories/teacher-class.repository";
import { GuardianStudentEntity } from "../../../entities/guardian-student.entity";
import { insertGuardianStudent, selectGuardianStudent, deleteGuardianStudent } from "../../../shared/repositories/guardian-student.repository";
import { UserEntity } from "../../../entities/user.entity";
import { EnrollmentClassEntity } from "../../../entities/enrollment-class.entity";
import { LevelCodeEntity } from "../../../entities/level-code.entity";
import { selectLevelCode, insertLevelCode } from "../../../shared/repositories/level-code.repository";
import { pickObject } from "../../../shared/utils/pick-object.util";
import { insertEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";

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
    Nome: t.string,
    "Alunos-Responsavel": t.array(AlunosResponsavel),
    "Matriculas-Aluno": t.array(MatriculasAluno),
    "Turmas-Professor": t.array(TurmaProfessorType),
});

const exactAuthenticationInput = t.exact(AuthenticationInput);

type EnrollmentWithClasses = Omit<EnrollmentEntity, 'id'> & {
    classes: Omit<EnrollmentClassEntity, 'id' | 'enrollmentId'>[];
}

const pickEnrollmentForInsert = pickObject<EnrollmentWithClasses, 'userId' | 'levelCodeId'>(['userId', 'levelCodeId']);

export const authenticationController = (redirectUrl: string, db: DatabaseService) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {

    const decodedBody = exactAuthenticationInput.decode(request.body);
    if (decodedBody._tag === 'Left') {
        throw new Error(`invalid input`);
    }

    const body = decodedBody.right;

    const userId = body.Id.toString();

    // we're using an array of roles here for shorter JWT payload
    const roles: RoleId[] = [
    ];

    const alunosResponsavel = body["Alunos-Responsavel"];
    const matriculasAluno = body["Matriculas-Aluno"];
    const turmasProfessor = body["Turmas-Professor"];

    if (userId === '999999') {
        roles.push(RoleId.ADMIN);
    }

    // infer guardian role
    // if (alunosResponsavel.length > 0) {
    //     roles.push(RoleId.GUARDIAN);
    // }
    // GUARDIAN ROLE IS CURRENTLY DISABLED

    // infer student role
    if (matriculasAluno.length > 0) {
        roles.push(RoleId.STUDENT);
    }

    // infer teacher role
    if (turmasProfessor.length > 0) {
        roles.push(RoleId.TEACHER);
    }

    const jwtPayload: JWTPayload = {
        userId: userId.toString(),
        roles: roles,
    }

    const userEntity = await getUserById(db)(userId);

    const studentEntities = alunosResponsavel.map<UserEntity>(aluno => ({
        id: aluno.Id.toString(),
        name: aluno.Nome,
        onboarded: false,
        avatarId: null,
    }));

    const guardianStudentEntities = alunosResponsavel.map<GuardianStudentEntity>(student => ({
        guardianId: userId.toString(),
        studentId: student.Id.toString(),
    }));

    const guardianStudentIds = guardianStudentEntities
        .map(guardianStudent => guardianStudent.studentId);

    const savedUsers = guardianStudentIds.length > 0
        ? await selectUser(db).whereIn('id', guardianStudentIds)
        : [];

    const usersToInsert = studentEntities.filter(student => !savedUsers.find(savedUser => savedUser.id === student.id));
    const studentRolesToInsert = usersToInsert.map<Omit<UserRoleEntity, 'id'>>(user => ({
        roleId: RoleId.STUDENT,
        userId: user.id,
    }));

    // insert all students that weren't registered yet
    if (usersToInsert.length > 0) {
        await insertUser(db)(usersToInsert);
    }
    if (studentRolesToInsert.length > 0) {
        await insertUserRole(db)(studentRolesToInsert);
    }

    const studentClassEntities: ClassEntity[] = matriculasAluno
        .map(matricula => {
            return matricula.Turmas
                .map<ClassEntity>(turma => ({
                    id: turma.Id.toString(),
                    levelCodeId: matricula.Id,
                    name: turma.Nome,
                    carrerId: turma.carreira || null,
                    institutionId: turma.instituicao || null,
                    periodId: turma.periodo || null,
                    sessionId: turma.sessao || null,
                    endDate: turma.dataFim || null,
                    startDate: turma.dataInicio || null,
                }))
        })
        .reduce<ClassEntity[]>(concatArrayReducer, []);

    const levelCodeEntities = matriculasAluno.map<Pick<LevelCodeEntity, 'id' | 'code' | 'active' | 'description'>>(matricula => ({
        id: matricula.Id,
        code: matricula.Nome,
        active: true,
        description: matricula.Nome,
    }));

    const levelCodeIds = levelCodeEntities.map(code => code.id);

    const savedLevelCodes = levelCodeIds.length > 0
        ? await selectLevelCode(db).whereIn('id', levelCodeIds)
        : [];

    // filter out levelCodes that are already saved
    const levelCodesToInsert = levelCodeEntities.filter(levelCode => !savedLevelCodes.find(savedLevelCode => savedLevelCode.id === levelCode.id));

    if (levelCodesToInsert.length > 0) {
        await insertLevelCode(db)(levelCodesToInsert);
    }

    const enrollmentEntities = matriculasAluno
        .map<EnrollmentWithClasses>(matricula => ({
            classes: matricula.Turmas.map<Omit<EnrollmentClassEntity, 'id' | 'enrollmentId'>>(turma => ({
                classId: turma.Id.toString(),
                userId: userId,
            })),
            levelCodeId: matricula.Id,
            userId: userId,
        }));

    // const enrollmentClassEntities: Omit<EnrollmentClassEntity, 'id'>[] = matriculasAluno
    //     .map(matricula => {
    //         return matricula.Turmas
    //             .map<Omit<EnrollmentClassEntity, 'id'>>(turma => ({
    //                 classId: turma.Id,
    //                 userId: userId,
    //             }))
    //     }).reduce(concatArrayReducer, []);

    const teacherClassEntities = turmasProfessor.map<Omit<TeacherClassEntity, 'id'>>(turma => ({
        classId: turma.Id.toString(),
        teacherId: userId,
    }));

    const teacherClassesClassIds = teacherClassEntities.map(teacherClass => teacherClass.classId);
    const studentClassEntitiesIds = studentClassEntities.map(classEntity => classEntity.id);

    const savedStudentClasses = studentClassEntitiesIds.length > 0
        ? await selectClass(db).whereIn('id', studentClassEntitiesIds)
        : [];

    // filter out classes that are already saved
    const classesToInsert = studentClassEntities.filter(classEntity => !savedStudentClasses.find(savedClass => savedClass.id === classEntity.id));
    // filter exactly the classes that requires updating
    const classesToUpdate = studentClassEntities.filter(classEntity => savedStudentClasses.find(savedClass => {
        return savedClass.id === classEntity.id
            && (
                savedClass.carrerId !== classEntity.carrerId
                || savedClass.institutionId !== classEntity.institutionId
                || savedClass.name !== classEntity.name
                || savedClass.periodId !== classEntity.periodId
                || savedClass.sessionId !== classEntity.sessionId
                || savedClass.startDate !== classEntity.startDate
                || savedClass.endDate !== classEntity.endDate
                || savedClass.levelCodeId !== classEntity.levelCodeId
            );
    }));

    for (const classToUpdate of classesToUpdate) {
        await updateClass(db)({
            name: classToUpdate.name,
            carrerId: classToUpdate.carrerId,
            institutionId: classToUpdate.institutionId,
            periodId: classToUpdate.periodId,
            sessionId: classToUpdate.sessionId,
            levelCodeId: classToUpdate.levelCodeId,
            startDate: classToUpdate.startDate,
            endDate: classToUpdate.endDate,
        })(builder => builder.andWhere('id', classToUpdate.id));
    }

    const userRoleEntities = roles.map<Omit<UserRoleEntity, 'id'>>(role => ({
        roleId: role,
        userId: userId,
    }));

    if (classesToInsert.length > 0) {
        // classes do not have any dependency on the user, so we can insert them first
        await insertClass(db)(classesToInsert);
    }

    // We retrieve the class entities for the teacher later to also get the new ones we may have inserted above
    const savedTeacherClasses = await selectClass(db).whereIn('id', teacherClassesClassIds);

    // filter out class entities that are not yet registered in the database, making it unable for us to save the teacherClass entities 
    // because the respective class does not yet exist.
    const possibleTeacherClassesToInsert = teacherClassEntities
        .filter(teacherClass => Boolean(savedTeacherClasses.find(classEntity => classEntity.id === teacherClass.classId)));

    if (!userEntity) {
        // first time login, so let's insert everything related to the user avoiding additional checks
        await insertUser(db)({
            id: userId,
            name: body.Nome,
        });

        if (userRoleEntities.length > 0) {
            await insertUserRole(db)(userRoleEntities);
        }
        if (enrollmentEntities.length > 0) {
            for (let index = 0; index < enrollmentEntities.length; index++) {
                const element = enrollmentEntities[index];
                await insertEnrollmentWithClasses(db, element);
            }
        }
        if (possibleTeacherClassesToInsert.length > 0) {
            await insertTeacherClass(db)(possibleTeacherClassesToInsert);
        }
        if (guardianStudentEntities.length > 0) {
            await insertGuardianStudent(db)(guardianStudentEntities);
        }
    } else {
        // user is already registered, so we need to check everything to see what we need to delete/insert/update
        if (userEntity.name !== body.Nome) {
            // only update user if name is different
            await updateUser(db)({
                name: body.Nome,
            })(builder => builder.andWhere('id', userId));
        }
        await consolidateUserRoles(db, userId, userRoleEntities);
        await consolidateUserEnrollments(db, userId, enrollmentEntities);
        await consolidateTeacherClasses(db, userId, possibleTeacherClassesToInsert);
        await consolidateGuardianStudents(db, userId, guardianStudentEntities);
    }

    const jwt = await reply.jwtSign(jwtPayload);
    reply.status(200).send({
        url: `${redirectUrl}?jwt=${jwt}`,
    });
}

async function insertEnrollmentWithClasses(db: DatabaseService<any, any>, element: EnrollmentWithClasses) {
    const enrollmentId = await insertEnrollment(db)(pickEnrollmentForInsert(element));
    const enrollmentClassesToInsert = element.classes.map<Omit<EnrollmentClassEntity, 'id'>>(enrollClass => ({
        classId: enrollClass.classId,
        enrollmentId: enrollmentId,
    }));
    if (enrollmentClassesToInsert.length > 0) {
        await insertEnrollmentClass(db)(enrollmentClassesToInsert);
    }
}

async function consolidateUserRoles(
    db: DatabaseService,
    userId: string,
    userRoleEntities: Pick<UserRoleEntity, "userId" | "roleId">[],
) {
    // user already exists, we need to make a diff on the other entities
    const existingUserRoles = await selectUserRole(db).andWhere('userId', userId);
    const userRoleFinder: ConsolidateFinder<Pick<UserRoleEntity, "userId" | "roleId">> =
        (userRoles, userRoleToFind) => Boolean(userRoles.find(userRole => userRole.roleId === userRoleToFind.roleId));
    const consolidation = consolidateEntities(userRoleFinder)(existingUserRoles, userRoleEntities);
    const idsToDelete = consolidation.toDelete.map(role => role.roleId);
    const entitiesToInsert = consolidation.toInsert;
    if (idsToDelete.length > 0) {
        await deleteUserRole(db)(builder => builder.andWhere('userId', userId).whereIn('roleId', idsToDelete));
    }
    if (entitiesToInsert.length > 0) {
        await insertUserRole(db)(entitiesToInsert);
    }
}

async function consolidateUserEnrollments(
    db: DatabaseService,
    userId: string,
    enrollmentEntities: EnrollmentWithClasses[],
) {
    const existingEnrollments = await selectEnrollment(db).andWhere('userId', userId);
    const enrollmentFinder: ConsolidateFinder<Pick<EnrollmentEntity, "userId" | "levelCodeId">> =
        (enrollments, enrollmentToFind) => Boolean(enrollments.find(enrollment => enrollment.levelCodeId === enrollmentToFind.levelCodeId));
    const consolidation = consolidateEntities<Pick<EnrollmentEntity, "userId" | "levelCodeId">, EnrollmentWithClasses>(
        enrollmentFinder
    )(existingEnrollments, enrollmentEntities);
    const idsToDelete = consolidation.toDelete.map(enrollment => enrollment.levelCodeId);
    const entitiesToInsert = consolidation.toInsert;

    if (idsToDelete.length > 0) {
        await deleteEnrollment(db)(builder => builder.andWhere('userId', userId).whereIn('levelCodeId', idsToDelete));
    }
    if (entitiesToInsert.length > 0) {
        for (let index = 0; index < entitiesToInsert.length; index++) {
            const element = entitiesToInsert[index];
            await insertEnrollmentWithClasses(db, element);
        }
    }
}

async function consolidateTeacherClasses(
    db: DatabaseService,
    userId: string,
    teacherClasses: Pick<TeacherClassEntity, "classId" | "teacherId">[],
) {
    const existingClasses = await selectTeacherClass(db).andWhere('teacherId', userId);
    const teacherClassesFinder: ConsolidateFinder<Pick<TeacherClassEntity, "classId" | "teacherId">> =
        (teacherClasses, teacherClassToFind) => Boolean(teacherClasses.find(teacherClass => teacherClass.classId === teacherClassToFind.classId));
    const consolidation = consolidateEntities(teacherClassesFinder)(existingClasses, teacherClasses);
    const idsToDelete = consolidation.toDelete.map(enrollment => enrollment.classId);
    const entitiesToInsert = consolidation.toInsert;

    if (idsToDelete.length > 0) {
        await deleteTeacherClass(db)(builder => builder.andWhere('teacherId', userId).whereIn('classId', idsToDelete));
    }
    if (entitiesToInsert.length > 0) {
        await insertTeacherClass(db)(entitiesToInsert);
    }
}

async function consolidateGuardianStudents(
    db: DatabaseService,
    userId: string,
    guardianStudents: GuardianStudentEntity[],
) {
    const existingGuardianStudents = await selectGuardianStudent(db).andWhere('guardianId', userId);
    const guardianStudentFinder: ConsolidateFinder<GuardianStudentEntity> =
        (guardianStudents, guardianStudentToFind) => Boolean(guardianStudents.find(teacherClass => teacherClass.studentId === guardianStudentToFind.studentId));
    const consolidation = consolidateEntities(guardianStudentFinder)(existingGuardianStudents, guardianStudents);
    const idsToDelete = consolidation.toDelete.map(enrollment => enrollment.studentId);
    const entitiesToInsert = consolidation.toInsert;

    if (idsToDelete.length > 0) {
        await deleteGuardianStudent(db)(builder => builder.andWhere('guardianId', userId).whereIn('studentId', idsToDelete));
    }
    if (entitiesToInsert.length > 0) {
        await insertGuardianStudent(db)(entitiesToInsert);
    }
}

