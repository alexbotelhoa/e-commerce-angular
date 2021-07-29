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

export function getIndexName(tableName: string, columnNames: string[]): string {
    return `${tableName}_${columnNames.map(str => str.toLowerCase()).join('_')}_index`;
}

export async function hasIndex(db: DatabaseService, tableName: string, columnNames: string[]): Promise<boolean> {
    return db.raw<[ShowIndexResult[]]>(`SHOW INDEX from ${tableName} WHERE Key_name = :indexName`, {
        indexName: getIndexName(tableName, columnNames),
    }).then(([result]) => {
        console.log(result);
        return result.length > 0;
    })
}
