import { ChatEntity } from "../../entities/chat.entity";
import { GQLChatResolvers } from "../../resolvers-types";
import { CLASS_TABLE } from "../../entities/class.entity";
import { LEVEL_TABLE } from './../../entities/level.entity';
import { getUserById } from "../repositories/user.repository";
import { ENROLLMENT_TABLE } from "../../entities/enrollment.entity";
import { LEVEL_CODE_TABLE } from "../../entities/level-code.entity";
import { ENROLLMENT_CLASS_TABLE } from "../../entities/enrollment-class.entity";

const chatEntityResolvers: Pick<GQLChatResolvers, keyof ChatEntity> = {
  userId: obj => obj.userId.toString(),
  firstMessage: obj => obj.firstMessage,
  dateMessage: obj => obj.dateMessage,
  amountMessage: obj => obj.amountMessage,
  isRead: obj => obj.isRead,
  createdAt: (obj) => obj.createdAt && new Date(obj.createdAt).toISOString(),
  updatedAt: (obj) => obj.updatedAt && new Date(obj.updatedAt).toISOString(),
}

const levelCodeResolver: GQLChatResolvers['levelCode'] = async (obj, params, context) => {
  const userId = obj.userId;
    if (!userId) return [];

  let queryRawFuture = ``;

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
    queryRawFuture = `DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29 AND ${CLASS_TABLE}.endDate > CURDATE()`;
  } else {
    queryRawFuture = `DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`;
  }
  
  return await context.readonlyDatabase
    .select(`${LEVEL_CODE_TABLE}.*`)
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
}

export const chatResolvers: GQLChatResolvers = {
  ...chatEntityResolvers,
  user: async (obj, params, context) => (await getUserById(context.readonlyDatabase)(obj.userId))!,
  levelCode: levelCodeResolver,
}
