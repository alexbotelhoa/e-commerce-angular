import { DatabaseService } from "../../src/shared/services/database.service";
import faker from 'faker';
import { deleteAllActivityComments, insertActivityComment } from "../../src/shared/repositories/comment/activity-comment.repository";
import { allClassSeeds } from "./09_class.seed";
import { randomItem } from "../../src/shared/utils/random-item.util";
import { userSeeds } from "./07_user.seed";

export async function seed(knex: DatabaseService): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllActivityComments(knex);

    for (let index = 1; index <= 20; index++) {
        await generateActivityComment(knex, index)
    }

    // for (let index = 3; index <= 4; index++) {
    //     await generateHtmlActivity(knex, index)
    // }
}

async function generateActivityComment(db: DatabaseService, index: number): Promise<number> {
    const classId = randomItem(allClassSeeds).id;
    const activityId = faker.random.number({ min: 1, max: 4 });
    const activityCommentId = await insertActivityComment(db)({
        text: faker.lorem.paragraph(3),
        classId: classId,
        activityId: activityId,
        userId: randomItem(userSeeds).id,
    });

    // add replies every third comment
    const shouldAddReplies = faker.random.boolean();

    if (shouldAddReplies) {
        for (let index = 1; index <= 2; index++) {
            await insertActivityComment(db)({
                text: faker.lorem.paragraph(3),
                classId: classId,
                parentId: activityCommentId,
                activityId: activityId,
                userId: randomItem(userSeeds).id,
            });
        }
    }

    return activityCommentId;
}
