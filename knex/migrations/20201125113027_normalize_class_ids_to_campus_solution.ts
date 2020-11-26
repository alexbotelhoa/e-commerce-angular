import * as Knex from "knex";
import { ACTIVITY_TIMER_TABLE } from "../../src/entities/activities/activity-timer.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { ACTIVITY_COMMENT_TABLE } from "../../src/entities/comments/activity-comment.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../src/entities/enrollment-class.entity";
import { TEACHER_CLASS_TABLE } from "../../src/entities/teacher-class.entity";
import { deleteClass, selectClass, updateClass } from "../../src/shared/repositories/class.repository";
import { deleteEnrollmentClass } from "../../src/shared/repositories/enrollment-class.repository";
import { DatabaseService } from "../../src/shared/services/database.service";
import { hasForeignKey } from "../utils/has-foreign-key.migration";
import { hasIndex } from "../utils/has-index.migration";


export async function up(knex: DatabaseService): Promise<void> {

    if (!await hasForeignKey(knex, ENROLLMENT_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }
    if (!await hasForeignKey(knex, TEACHER_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }
    if (!await hasForeignKey(knex, ACTIVITY_TIMER_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }
    if (!await hasForeignKey(knex, ACTIVITY_COMMENT_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
            table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
        });
    }
    // only needed for hml environment
    await deleteClass(knex)(where => where.andWhere('classId', 'LIKE', '0%'));

    // first we need to drop all foreign keys related to class' id
    if (await hasForeignKey(knex, ACTIVITY_TIMER_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    if (await hasIndex(knex, ACTIVITY_TIMER_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
            table.dropIndex('classId');
        });
    }
    if (await hasForeignKey(knex, ACTIVITY_COMMENT_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    if (await hasIndex(knex, ACTIVITY_COMMENT_TABLE, ['classId'])) {
        await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
            table.dropIndex('classId');
        });
    }

    if (await hasForeignKey(knex, ENROLLMENT_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    if (await hasIndex(knex, ENROLLMENT_CLASS_TABLE, ['classId', 'enrollmentId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.dropIndex(['classId', 'enrollmentId']);
        });
    }

    if (await hasIndex(knex, ENROLLMENT_CLASS_TABLE, ['enrollmentId', 'classId'])) {
        await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
            table.dropIndex(['enrollmentId', 'classId']);
        });
    }

    if (await hasForeignKey(knex, TEACHER_CLASS_TABLE, ['classId'])) {
        await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
            table.dropForeign(['classId']);
        });
    }

    // await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
    //     table.dropIndex(['classId', 'teacherId']);
    //     table.dropIndex(['teacherId', 'classId']);
    // });

    // then we need to add the forein keys back with the ON UPDATE CASCADE set
    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.foreign('classId').references(`${CLASS_TABLE}.id`).onDelete('CASCADE').onUpdate('CASCADE');
    });

    const classes = await selectClass(knex);

    const classesToUpdate = classes.filter(klass => {
        return !klass.id.includes('U') || klass.id.startsWith('0');
    });

    for (const klass of classesToUpdate) {
        const idToUpdate = klass.id.padStart(12, '0');
        await updateClass(knex)({
            id: idToUpdate
        })(where => where.andWhere('id', klass.id));
    }

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.index(['classId', 'enrollmentId']);
        table.index(['enrollmentId', 'classId']);
    });

    // await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
    //     table.index(['classId', 'teacherId']);
    //     table.index(['teacherId', 'classId']);
    // });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.index('classId');

    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.index('classId');
    });
}


export async function down(knex: Knex): Promise<void> {
}

