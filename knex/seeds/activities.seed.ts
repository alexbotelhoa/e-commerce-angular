import { deleteAllActivities, insertActivity } from "../../src/shared/repositories/activity.repository";
import { DatabaseService } from "../../src/shared/services/database.service";
import faker from 'faker';
import { ActivityTypeId } from "../../src/domain/activity/enums/activity-type.enum";
import { insertEmbeddedActivityData } from "../../src/shared/repositories/embedded-activity-data.repository";
import { insertHtmlActivityData } from "../../src/shared/repositories/html-activity-data.repository";

export async function seed(knex: DatabaseService): Promise<void> {
    // Deletes ALL existing entries
    await deleteAllActivities(knex);

    for (let index = 0; index < 2; index++) {
        await generateEmbeddedActivity(knex)
    }

    for (let index = 0; index < 2; index++) {
        await generateHtmlActivity(knex)
    }
}

async function generateEmbeddedActivity(db: DatabaseService): Promise<number> {
    const activityId = await insertActivity(db)({
        name: faker.company.catchPhraseDescriptor(),
        description: faker.lorem.paragraphs(2),
        typeId: ActivityTypeId.EMBEDDED,
    });

    await insertEmbeddedActivityData(db)({
        activityId: activityId,
        url: faker.internet.url(),
    });

    return activityId;
}

async function generateHtmlActivity(db: DatabaseService): Promise<number> {
    const activityId = await insertActivity(db)({
        name: faker.company.catchPhraseDescriptor(),
        description: faker.lorem.paragraphs(2),
        typeId: ActivityTypeId.HTML,
    });

    await insertHtmlActivityData(db)({
        activityId: activityId,
        html: `<h1>${faker.lorem.sentence()}</h1><p>${faker.lorem.text()}</p>`,
    });

    return activityId;
}
