import * as Knex from "knex";
import { ACTIVITY_TIMER_TABLE } from "../../src/entities/activities/activity-timer.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { ACTIVITY_COMMENT_TABLE } from "../../src/entities/comments/activity-comment.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../src/entities/enrollment-class.entity";
import { TEACHER_CLASS_TABLE } from "../../src/entities/teacher-class.entity";
import { selectClass, updateClass } from "../../src/shared/repositories/class.repository";
import { DatabaseService } from "../../src/shared/services/database.service";
import { hasForeignKey } from "../utils/has-foreign-key.migration";
import { hasIndex } from "../utils/has-index.migration";

export interface MigrationStatus {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
    step5: boolean;
    step6: boolean;
    step7: boolean;
    step8: boolean;
    step9: boolean;
    step10: boolean;
    step11: boolean;
    step12: boolean;
    step13: boolean;
    step14: boolean;
    step15: boolean;
    step16: boolean;
    step17: boolean;
    step18: boolean;
    step19: boolean;
    step20: boolean;
    step21: boolean;
    step22: boolean;
    totalClasses: null | number;
    totalMigrated: number;
}

export const migrationStatus: MigrationStatus = {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
    step8: false,
    step9: false,
    step10: false,
    step11: false,
    step12: false,
    step13: false,
    step14: false,
    step15: false,
    step16: false,
    step17: false,
    step18: false,
    step19: false,
    step20: false,
    step21: false,
    step22: false,
    totalClasses: null,
    totalMigrated: 0,
}


export async function up(knex: DatabaseService): Promise<void> {

    if (!await hasForeignKey(knex, ENROLLMENT_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }

    migrationStatus.step1 = true;

    if (!await hasForeignKey(knex, TEACHER_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }

    migrationStatus.step2 = true;

    if (!await hasForeignKey(knex, ACTIVITY_TIMER_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }

    migrationStatus.step3 = true;

    if (!await hasForeignKey(knex, ACTIVITY_COMMENT_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }

    migrationStatus.step4 = true;


    // first we need to drop all foreign keys related to class' id
    if (await hasForeignKey(knex, ACTIVITY_TIMER_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    migrationStatus.step5 = true;

    if (await hasIndex(knex, ACTIVITY_TIMER_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
            table.dropIndex('classId');
        });
    }

    migrationStatus.step6 = true;

    if (await hasForeignKey(knex, ACTIVITY_COMMENT_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    migrationStatus.step7 = true;

    if (await hasIndex(knex, ACTIVITY_COMMENT_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
            table.dropIndex('classId');
        });
    }

    migrationStatus.step8 = true;

    if (await hasForeignKey(knex, ENROLLMENT_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    migrationStatus.step9 = true;

    if (await hasIndex(knex, ENROLLMENT_CLASS_TABLE, ['classId', 'enrollmentId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.dropIndex(['classId', 'enrollmentId']);
        });
    }

    migrationStatus.step10 = true;

    if (await hasIndex(knex, ENROLLMENT_CLASS_TABLE, ['enrollmentId', 'classId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.dropIndex(['enrollmentId', 'classId']);
        });
    }

    migrationStatus.step11 = true;

    if (await hasForeignKey(knex, TEACHER_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    migrationStatus.step12 = true;

    // await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
    //     table.dropIndex(['classId', 'teacherId']);
    //     table.dropIndex(['teacherId', 'classId']);
    // });

    // then we need to add the foreign keys back with the ON UPDATE CASCADE set
    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    migrationStatus.step13 = true;

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    migrationStatus.step14 = true;

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    migrationStatus.step15 = true;

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    migrationStatus.step16 = true;

    const classes = await selectClass(knex);

    migrationStatus.step17 = true;

    const classesToUpdate = classes.filter(klass => {
        return !klass.id.includes('U') || klass.id.startsWith('0');
    });

    migrationStatus.totalClasses = classesToUpdate.length;

    migrationStatus.step18 = true;

    for (const klass of classesToUpdate) {
        const idToUpdate = klass.id.padStart(12, '0');
        await updateClass(knex)({
            id: idToUpdate
        })(where => where.andWhere('id', klass.id));
        migrationStatus.totalMigrated = migrationStatus.totalMigrated + 1;
    }

    migrationStatus.step19 = true;

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.index(['classId', 'enrollmentId']);
        table.index(['enrollmentId', 'classId']);
    });

    migrationStatus.step20 = true;

    // await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
    //     table.index(['classId', 'teacherId']);
    //     table.index(['teacherId', 'classId']);
    // });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.index('classId');
    });

    migrationStatus.step21 = true;

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.index('classId');
    });

    migrationStatus.step22 = true;
}


export async function down(knex: Knex): Promise<void> {
}

