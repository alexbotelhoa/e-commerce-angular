import * as Knex from "knex";
import { ACTIVITY_TIMER_TABLE } from "../../src/entities/activities/activity-timer.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { ACTIVITY_COMMENT_TABLE } from "../../src/entities/comments/activity-comment.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../src/entities/enrollment-class.entity";
import { TEACHER_CLASS_TABLE } from "../../src/entities/teacher-class.entity";
import { selectClass, updateClass } from "../../src/shared/repositories/class.repository";
import { DatabaseService } from "../../src/shared/services/database.service";


export async function up(knex: DatabaseService): Promise<void> {
    // first we need to drop all foreign keys related to class' id
    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.dropForeign(['classId']);
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.dropIndex('classId');
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.dropForeign(['classId']);
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.dropIndex('classId');
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.dropForeign(['classId']);
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.dropIndex(['classId', 'enrollmentId']);
        table.dropIndex(['enrollmentId', 'classId']);
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.dropForeign(['classId']);
    });

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
        return !klass.id.includes('U');
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

