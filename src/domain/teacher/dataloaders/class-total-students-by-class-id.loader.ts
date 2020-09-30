import { ENROLLMENT_CLASS_TABLE } from "../../../entities/enrollment-class.entity";
import { ENROLLMENT_TABLE } from "../../../entities/enrollment.entity";
import { USER_TABLE } from "../../../entities/user.entity";
import { CountObj } from "../../../shared/types/count-obj.type";
import { DatabaseLoaderFactory } from "../../../shared/types/database-loader.type";
import { createDataloaderCountSort } from "../../../shared/utils/dataloader-count-sort";

export type ClassTotalStudentsLoaderRow = CountObj & {
    classId: number;
}

export const classTotalStudentsSorter = createDataloaderCountSort<ClassTotalStudentsLoaderRow, number>('classId');

export const classTotalStudentsByClassIdLoader: DatabaseLoaderFactory<number, number, number, undefined> = {
    id: 'classTotalStudentsLoader',
    batchFn: (db) => async ids => {
        const result = await db
            .count('*')
            .select([`${ENROLLMENT_CLASS_TABLE}.classId`])
            .from(USER_TABLE)
            .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.userId`, `${USER_TABLE}.id`)
            .innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.id`)
            .whereIn(`${ENROLLMENT_CLASS_TABLE}.classId`, ids)
        const sorted = classTotalStudentsSorter(ids)(result);
        return sorted;
    }
}
