import { Redis } from "ioredis";
import { parse } from "json2csv";
import { FastifyReply, FastifyRequest } from "fastify";

import { Environment } from "../../../shared/types/environment.type";
import { DatabaseService } from "../../../shared/services/database.service";

export const myNotesUsageReportController =
  (
    env: Environment,
    db: DatabaseService,
    readonlyDb: DatabaseService,
    redis?: Redis
  ) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    if (redis) {
      const response = await redis.get("myNotesUsage");
      const responseParsed = response && JSON.parse(response);
      if (responseParsed && responseParsed.length > 0) {
        reply.header("Content-Type", "text/csv");
        return reply.send(parse(responseParsed));
      }
      reply.send({ loading: "loading report" });

      const sql = `
SELECT 
a1.userId as ID,
(
	SELECT COUNT(*) as "LENGTH>10"
	FROM annotation a2
	WHERE LENGTH(data) > 10 
	AND a2.userId = a1.userId
) as "LENGTH>10",
(
	SELECT FORMAT(AVG(LENGTH(a3.data)), 2)
	FROM annotation a3
	WHERE a3.userId = a1.userId 
) as AVG
FROM annotation a1
GROUP BY a1.userId
ORDER BY 1 DESC
	`;
      const [result] = await readonlyDb.raw(sql);
      if (result.length === 0) {
        await redis.del("myNotesUsage");
        reply.header("Content-Type", "text/csv");
        reply.send(parse(result));
      } else {
        await redis.set("myNotesUsage", JSON.stringify(result), "ex", 43200);
      }
    }
  };
