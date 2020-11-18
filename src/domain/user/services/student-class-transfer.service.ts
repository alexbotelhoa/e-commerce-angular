import { FastifyLoggerInstance } from "fastify";
import { getClassById, insertClass } from "../../../shared/repositories/class.repository";
import { deleteEnrollmentClass, insertEnrollmentClass, selectEnrollmentClass } from "../../../shared/repositories/enrollment-class.repository";
import { insertEnrollment, selectEnrollment } from "../../../shared/repositories/enrollment.repository";
import { getLevelCodeById, insertLevelCode } from "../../../shared/repositories/level-code.repository";
import { DatabaseService } from "../../../shared/services/database.service";
import { ClassData } from "../types/class-data.type";
import { StudentClassTransferEvent, WebhookResponse } from "../types/webhook-events.types";

export interface StudentClassTransferData {
    userId: string;
    oldClassId: string;
    newClass: ClassData;
}

export const processStudentClassTransfer = (db: DatabaseService, log: FastifyLoggerInstance) => async (event: StudentClassTransferEvent): Promise<WebhookResponse> => {
    const data = event.data;
    const userId = data.userId;
    const oldClassId = event.data.oldClassId;
    const newClass = event.data.newClass;
    const levelData = newClass.level;
    const existingClass = await getClassById(db)(newClass.id);
    const existingLevelCode = await getLevelCodeById(db)(newClass.level.id);
    if (!existingLevelCode) {
        await insertLevelCode(db)({
            id: levelData.id,
            active: true,
            code: levelData.code,
            description: levelData.code,
            levelId: null,
        });
    }
    if (!existingClass) {
        await insertClass(db)({
            id: newClass.id,
            name: newClass.name,
            carrerId: newClass.carrerId,
            endDate: newClass.endDate,
            institutionId: newClass.institutionId,
            levelCodeId: newClass.level.id,
        })
    }

    const [enrollment] = await selectEnrollment(db).andWhere('userId', userId).andWhere('levelCodeId', levelData.id);
    let enrollmentId: number;
    if (enrollment) {
        enrollmentId = enrollment.id;
    } else {
        enrollmentId = await insertEnrollment(db)({
            levelCodeId: levelData.id,
            userId: userId,
        });
    }

    const [oldClassEnrollment] = await selectEnrollmentClass(db)
        .andWhere('classId', oldClassId)
        .andWhere('enrollmentId', enrollmentId);

    if (oldClassEnrollment) {
        await deleteEnrollmentClass(db)(query => query.andWhere('id', oldClassEnrollment.id));
    }

    const [existingEnrollmentClass] = await selectEnrollmentClass(db)
        .andWhere('classId', newClass.id)
        .andWhere('enrollmentId', enrollmentId);

    if (!existingEnrollmentClass) {

        await insertEnrollmentClass(db)({
            classId: newClass.id,
            enrollmentId: enrollmentId,
        });
    } else {
        log.info(event, 'User is already enrolled in class.');
    }

    return {
        success: true,
    }

}
