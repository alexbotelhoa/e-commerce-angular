import * as Knex from "knex";
import { ACTIVITY_TIMER_TABLE } from "../../src/entities/activities/activity-timer.entity";
import { CLASS_TABLE } from "../../src/entities/class.entity";
import { ACTIVITY_COMMENT_TABLE } from "../../src/entities/comments/activity-comment.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../src/entities/enrollment-class.entity";
import { ENROLLMENT_TABLE } from "../../src/entities/enrollment.entity";
import { GUARDIAN_STUDENT_TABLE } from "../../src/entities/guardian-student.entity";
import { TEACHER_CLASS_TABLE } from "../../src/entities/teacher-class.entity";
import { USER_ROLE_TABLE } from "../../src/entities/user-role.entity";
import { USER_TABLE } from "../../src/entities/user.entity";


export async function up(knex: Knex): Promise<void> {

    // droppping all FKs and indexes related to userId and classId
    await knex.schema.alterTable(ENROLLMENT_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropForeign(['levelCodeId']);
        table.dropIndex(['userId', 'levelCodeId']);
        table.dropIndex(['levelCodeId', 'userId']);
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.dropForeign(['classId']);
        table.dropForeign(['enrollmentId']);
        table.dropIndex(['enrollmentId', 'classId']);
        table.dropIndex(['classId', 'enrollmentId']);
    });

    await knex.schema.alterTable(USER_ROLE_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropIndex('userId');
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropForeign(['classId']);
        table.dropIndex('userId');
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropForeign(['classId']);
        table.dropIndex('userId');
        table.dropIndex('classId');
    });

    await knex.schema.alterTable(GUARDIAN_STUDENT_TABLE, table => {
        table.dropForeign(['guardianId']);
        table.dropForeign(['studentId']);
        // table.dropIndex(['guardianId', 'studentId']);
        table.dropIndex(['studentId', 'guardianId']);
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.dropForeign(['teacherId']);
        table.dropForeign(['classId']);
        table.dropIndex(['teacherId', 'classId']);
        table.dropIndex(['classId', 'teacherId']);
    });


    // change all userId columns to varchar(36) to accomodate for GUIDs too
    await knex.schema.alterTable(USER_TABLE, table => {
        table.string('id', 36).alter();
    });

    await knex.schema.alterTable(CLASS_TABLE, table => {
        table.string('id', 36).alter();
    });

    await knex.schema.alterTable(ENROLLMENT_TABLE, table => {
        table.string('userId', 36).alter();
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.string('classId', 36).alter();
    });

    await knex.schema.alterTable(USER_ROLE_TABLE, table => {
        table.string('userId', 36).alter();
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.string('userId', 36).alter();
        table.string('classId', 36).alter();
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.string('userId', 36).alter();
        table.string('classId', 36).alter();
    });

    await knex.schema.alterTable(GUARDIAN_STUDENT_TABLE, table => {
        table.string('guardianId', 36).alter();
        table.string('studentId', 36).alter();
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.string('teacherId', 36).alter();
        table.string('classId', 36).alter();
    });

    // add FKs and indexes back
    await knex.schema.alterTable(ENROLLMENT_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.foreign('levelCodeId').references('level_code.id').onDelete('CASCADE');
        table.index(['userId', 'levelCodeId']);
        table.index(['levelCodeId', 'userId']);
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.foreign('classId').references('class.id');
        table.index(['enrollmentId', 'classId']);
        table.index(['classId', 'enrollmentId']);
    });

    await knex.schema.alterTable(USER_ROLE_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.index('userId');
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.foreign('classId').references('class.id').onDelete('CASCADE');
        table.index('userId');
        table.index('classId');
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.foreign('classId').references('class.id').onDelete('CASCADE');
        table.index('userId');
        table.index('classId');
    });

    await knex.schema.alterTable(GUARDIAN_STUDENT_TABLE, table => {
        table.foreign('guardianId').references('user.id').onDelete('CASCADE');
        table.foreign('studentId').references('user.id').onDelete('CASCADE');
        table.index(['guardianId', 'studentId']);
        table.index(['studentId', 'guardianId']);
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.foreign('teacherId').references('user.id').onDelete('CASCADE');
        table.foreign('classId').references('class.id').onDelete('CASCADE');
        table.index(['teacherId', 'classId']);
        table.index(['classId', 'teacherId']);
    });
}


export async function down(knex: Knex): Promise<void> {



    await knex.schema.alterTable(ENROLLMENT_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropForeign(['levelCodeId']);
        table.dropIndex(['userId', 'levelCodeId']);
        table.dropIndex(['levelCodeId', 'userId']);
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.dropForeign(['classId']);
        table.dropIndex(['enrollmentId', 'classId']);
        table.dropIndex(['classId', 'enrollmentId']);
    });

    await knex.schema.alterTable(USER_ROLE_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropIndex('userId');
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropForeign(['classId']);
        table.dropIndex('userId');
        table.dropIndex('classId');
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.dropForeign(['userId']);
        table.dropForeign(['classId']);
        table.dropIndex('userId');
        table.dropIndex('classId');
    });

    await knex.schema.alterTable(GUARDIAN_STUDENT_TABLE, table => {
        table.dropForeign(['guardianId']);
        table.dropForeign(['studentId']);
        table.dropIndex(['guardianId', 'studentId']);
        table.dropIndex(['studentId', 'guardianId']);
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.dropForeign(['teacherId']);
        table.dropForeign(['classId']);
        table.dropIndex(['teacherId', 'classId']);
        table.dropIndex(['classId', 'teacherId']);
    });


    // change all userId columns to varchar(36) to accomodate for GUIDs too
    await knex.schema.alterTable(USER_TABLE, table => {
        table.integer('id', 10).alter();
    });

    await knex.schema.alterTable(CLASS_TABLE, table => {
        table.integer('id', 10).alter();
    });

    await knex.schema.alterTable(ENROLLMENT_TABLE, table => {
        table.integer('userId', 10).alter();
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.integer('classId', 10).alter();
    });

    await knex.schema.alterTable(USER_ROLE_TABLE, table => {
        table.integer('userId', 10).alter();
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.integer('userId', 10).alter();
        table.integer('classId', 10).alter();
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.integer('userId', 10).alter();
        table.integer('classId', 10).alter();
    });

    await knex.schema.alterTable(GUARDIAN_STUDENT_TABLE, table => {
        table.integer('guardianId', 10).alter();
        table.integer('studentId', 10).alter();
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.integer('teacherId', 10).alter();
        table.integer('classId', 10).alter();
    });



    // add FKs and indexes back
    await knex.schema.alterTable(ENROLLMENT_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.foreign('levelCodeId').references('level_code.id').onDelete('CASCADE');
        table.index(['userId', 'levelCodeId']);
        table.index(['levelCodeId', 'userId']);
    });

    await knex.schema.alterTable(ENROLLMENT_CLASS_TABLE, table => {
        table.foreign('classId').references('class.id');
        table.foreign('enrollmentId').references('enrollment.id');
        table.index(['enrollmentId', 'classId']);
        table.index(['classId', 'enrollmentId']);
    });

    await knex.schema.alterTable(USER_ROLE_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.index('userId');
    });

    await knex.schema.alterTable(ACTIVITY_TIMER_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.foreign('classId').references('class.id').onDelete('CASCADE');
        table.index('userId');
    });

    await knex.schema.alterTable(ACTIVITY_COMMENT_TABLE, table => {
        table.foreign('userId').references('user.id').onDelete('CASCADE');
        table.foreign('classId').references('class.id').onDelete('CASCADE');
        table.index('userId');
        table.index('classId');
    });

    await knex.schema.alterTable(GUARDIAN_STUDENT_TABLE, table => {
        table.foreign('guardianId').references('user.id').onDelete('CASCADE');
        table.foreign('studentId').references('user.id').onDelete('CASCADE');
        // table.index(['guardianId', 'studentId']);
        table.index(['studentId', 'guardianId']);
    });

    await knex.schema.alterTable(TEACHER_CLASS_TABLE, table => {
        table.foreign('teacherId').references('user.id').onDelete('CASCADE');
        table.foreign('classId').references('class.id').onDelete('CASCADE');
        table.index(['teacherId', 'classId']);
        table.index(['classId', 'teacherId']);
    });
}

