import { ChatEntity } from "../../entities/chat.entity";
import { GQLChatResolvers } from "../../resolvers-types";
import { CLASS_TABLE } from "../../entities/class.entity";
import { getUserById } from "../repositories/user.repository";
import { ENROLLMENT_TABLE } from "../../entities/enrollment.entity";
import { LEVEL_CODE_TABLE } from "../../entities/level-code.entity";
import { selectLevelCode } from "../repositories/level-code.repository";
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
  const query = selectLevelCode(context.readonlyDatabase);
  query.innerJoin(CLASS_TABLE, `${CLASS_TABLE}.levelCodeId`, `${LEVEL_CODE_TABLE}.id`)
  query.innerJoin(ENROLLMENT_CLASS_TABLE, `${ENROLLMENT_CLASS_TABLE}.classId`, `${CLASS_TABLE}.id`)
  query.innerJoin(ENROLLMENT_TABLE, `${ENROLLMENT_TABLE}.id`, `${ENROLLMENT_CLASS_TABLE}.enrollmentId`)
  query.where(`${ENROLLMENT_TABLE}.userId`, "like", obj.userId)
  query.andWhere(`${LEVEL_CODE_TABLE}.active`, true)
  query.andWhere(`${CLASS_TABLE}.hasActivated`, true)
  query.andWhereRaw(`DATEDIFF(CURDATE(), ${CLASS_TABLE}.endDate) < 29`)
  query.orderBy(`${CLASS_TABLE}.endDate`, 'asc')
  query.limit(1);
  return await query as any;
}

export const chatResolvers: GQLChatResolvers = {
  ...chatEntityResolvers,
  user: async (obj, params, context) => (await getUserById(context.readonlyDatabase)(obj.userId))!,
  levelCode: levelCodeResolver,
}
