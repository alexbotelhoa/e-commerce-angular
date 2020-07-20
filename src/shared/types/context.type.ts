import { DatabaseService } from "../services/database.service";

export interface GraphQLContext {
    database: DatabaseService,
}
