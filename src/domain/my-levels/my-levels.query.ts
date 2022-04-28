import { LEVEL_TABLE } from "../../entities/level.entity";
import { CLASS_TABLE } from "../../entities/class.entity";
import { GQLQueryResolvers } from "../../resolvers-types";
import { LEVEL_CODE_TABLE } from "../../entities/level-code.entity";
import { ENROLLMENT_TABLE } from "../../entities/enrollment.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../entities/enrollment-class.entity";

export const myLevelQueryResolver: GQLQueryResolvers['myLevels'] = async (obj, params, context) => {
    const userId = context.currentUser?.id;
    if (!userId) return [];

    let queryRawFuture = ``;
    let queryRawPassed = ``;

    const countActiveClass = await context.readonlyDatabase
        .count('* as countClasses')
        .from(LEVEL_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.Id`)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.classId`)
        .andWhere(`${ENROLLMENT_TABLE}.userId`, userId)
        .andWhere(`${LEVEL_TABLE}.active`, true)
        .andWhere(`${LEVEL_CODE_TABLE}.active`, true)
        .andWhere(`${CLASS_TABLE}.hasActivated`, true)
        .andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`)
        .andWhereRaw(`DATEDIFF(${CLASS_TABLE}.startDate, CURDATE()) < 31`);

        if (countActiveClass[0].countClasses > 1) {
            queryRawFuture = `DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29 AND ${CLASS_TABLE}.endDate >= CURDATE()`;
            queryRawPassed = `${CLASS_TABLE}.endDate < CURDATE()`;
        } else {
            queryRawFuture = `DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`;
            queryRawPassed = `DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) > 31`;
        }
    
    const classFuture = await context.readonlyDatabase
        .select(`${LEVEL_TABLE}.*`)
        .from(LEVEL_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.Id`)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.classId`)
        .andWhere(`${ENROLLMENT_TABLE}.userId`, userId)
        .andWhere(`${LEVEL_TABLE}.active`, true)
        .andWhere(`${LEVEL_CODE_TABLE}.active`, true)
        .andWhere(`${CLASS_TABLE}.hasActivated`, true)
        .andWhereRaw(`${queryRawFuture}`)
        .orderBy(`${CLASS_TABLE}.endDate`, 'asc');

    const classPassed = await context.readonlyDatabase
        .select(`${LEVEL_TABLE}.*`)
        .from(LEVEL_TABLE)
        .innerJoin(LEVEL_CODE_TABLE, `${LEVEL_CODE_TABLE}.levelId`, `${LEVEL_TABLE}.id`)
        .innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
        .innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`, `${ENROLLMENT_TABLE}.Id`)
        .innerJoin(CLASS_TABLE, `${CLASS_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.classId`)
        .andWhere(`${ENROLLMENT_TABLE}.userId`, userId)
        .andWhere(`${LEVEL_TABLE}.active`, true)
        .andWhere(`${LEVEL_CODE_TABLE}.active`, true)
        .andWhere(`${CLASS_TABLE}.hasActivated`, true)
        .andWhereRaw(`${queryRawPassed}`)
        .orderBy(`${CLASS_TABLE}.endDate`, 'desc');

    const mergeClasses = [...classFuture,...classPassed];
    const filteredClasses = mergeClasses.reduce((acc, level) => {
        const filter = acc.filter((_acc: any) => _acc.id === level.id) 
        if (filter.length === 0) acc.push(level);
        return acc;
    }, [] as any[]);

    return filteredClasses;
}
