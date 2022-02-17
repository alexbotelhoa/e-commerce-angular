import * as t from "io-ts";
import { format } from "date-fns";
import { ClassEntity } from "../../../entities/class.entity";
import { ClassData } from "../types/class-data.type";
import { ClassWithLocationsFullDataType } from "../types/class-full-data.type";

export function isClassDataDivergent(existingClass: ClassEntity, receivedClass: ClassData): boolean {
    const status = receivedClass.status.toUpperCase() === "C" ? false : true
    return (
        // make sure we are dealing with the same class
        existingClass.id === receivedClass.id &&
        (
            existingClass.name !== receivedClass.name ||
            existingClass.institutionId !== receivedClass.institutionId ||
            existingClass.carrerId !== receivedClass.carrerId ||
            existingClass.periodId !== receivedClass.periodId ||
            (existingClass.hasActivated !== status) ||
            existingClass.sessionId !== receivedClass.sessionId ||
            existingClass.levelCodeId !== receivedClass.level.id ||
            (
                existingClass.startDate !== receivedClass.startDate
                && existingClass.startDate === null
                || (
                    existingClass.startDate instanceof Date
                    && format(existingClass.startDate, 'yyyy-MM-dd') !== receivedClass.startDate
                )
            ) ||
            (
                existingClass.endDate !== receivedClass.endDate
                && existingClass.endDate === null
                || (
                    existingClass.endDate instanceof Date
                    && format(existingClass.endDate, 'yyyy-MM-dd') !== receivedClass.endDate
                )
            )
        )
    )
}

export function isFullClassDataDivergent(existingClass: ClassEntity, data: t.TypeOf<typeof ClassWithLocationsFullDataType>): boolean {
    const receivedClass = data;
    return (
        // make sure we are dealing with the same class
        existingClass.id === receivedClass.id &&
        (
            existingClass.name !== receivedClass.name ||
            existingClass.institutionId !== receivedClass.institutionId ||
            existingClass.carrerId !== receivedClass.carrerId ||
            existingClass.periodId !== receivedClass.periodId ||
            existingClass.sessionId !== receivedClass.sessionId ||
            existingClass.levelCodeId !== receivedClass.level.id ||
            existingClass.hasEcampus !== receivedClass.hasECampusAccess ||
            existingClass.hasEyoung !== receivedClass.mnft ||
            (
                existingClass.startDate !== receivedClass.startDate
                && existingClass.startDate === null
                || (
                    existingClass.startDate !== receivedClass.startDate
                )
            ) ||
            (
                existingClass.endDate !== receivedClass.endDate
                && existingClass.endDate === null
                || (
                    existingClass.endDate !== receivedClass.endDate
                )
            )
        )
    )
}
