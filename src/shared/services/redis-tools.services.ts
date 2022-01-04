/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply } from "fastify";
import { Redis } from "ioredis";

export class RedisService {
  private redis?: Redis;
  public flag = false;

  constructor(redis?: Redis) {
    this.redis = redis;
  }

  setInRedisAfterTimeExpires(redisKey: string, reply: FastifyReply, timeout = 30000, callback?: () => void): void {
    setTimeout(() => {
      if (this.flag) {
        callback && callback();
        this.setInProcess(redisKey);
        reply?.status(202).send({ message: 'Seu pedido está sendo processado em segundo plano' });
        this.flag = false;
      }
    }, timeout); 
  }

  throwInRedisAfterTimeExpires(redisKey: string, reply: FastifyReply, error: any) {
    const message = `aconteceu um erro inesperado: ${error?.sqlMessage || error.message}`;
    if (this.flag) {
      this.remove(redisKey);
    } else {
      this.set(redisKey, message);
    }
    this.flag = false;
    return reply.status(500).send({ message });
  }

  setInProcess(redisKey: string, expiryTime = 3600): void {
    this.redis?.set(redisKey, 'inProcess', 'ex', expiryTime);
  }

  remove(redisKey: string): void {
    this.redis?.del(redisKey);
  }

  set(redisKey: string, data: any, expiryTime = 3600): void {
    data = JSON.stringify(data);
    this.redis?.set(redisKey, data, 'ex', expiryTime);
  }

  async get<T>(redisKey: string, deleteAfter?: boolean): Promise<T | undefined> {
    try {
      const response = await this.redis?.get(redisKey);
      if (response) {
        if (response !== "inProcess") {
          deleteAfter && await this.redis?.del(redisKey);
        } 
        return JSON.parse(response) as T;
      }
    } catch (e) {
      console.log(e);
    }
  }
}