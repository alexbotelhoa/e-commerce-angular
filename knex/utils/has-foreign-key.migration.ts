import { DatabaseService } from "../../src/shared/services/database.service";

export interface ShowIndexResult {
    Table: string;
    Non_unique: 0 | 1;
    Key_name: string;
    Seq_in_index: number;
    Column_name: string;
    Collation: string;
    Cardinality: number;
    Sub_part: string | null;
    Packed: 0 | 1 | boolean | null;
    Null: string | null;
    Index_type: 'BTREE' | string;
    Comment: string | null;
    Index_comment: string | null;
}

export function getForeignKeyName(tableName: string, columnNames: string[]): string {
    return `${tableName}_${columnNames.map(str => str.toLowerCase()).join('_')}_foreign`;
}

export async function hasForeignKey(db: DatabaseService, tableName: string, columnNames: string[]): Promise<boolean> {
    const keyName = getForeignKeyName(tableName, columnNames);
    const results = await db.select('*')
        .from('information_schema.TABLE_CONSTRAINTS')
        .andWhere('information_schema.TABLE_CONSTRAINTS.CONSTRAINT_TYPE', 'FOREIGN KEY')
        .andWhere('information_schema.TABLE_CONSTRAINTS.TABLE_SCHEMA', process.env.DB_NAME)
        .andWhere('information_schema.TABLE_CONSTRAINTS.TABLE_NAME', tableName)
        .andWhere('information_schema.TABLE_CONSTRAINTS.CONSTRAINT_NAME', keyName);
    console.log(results);
    return results.length > 0;
}
