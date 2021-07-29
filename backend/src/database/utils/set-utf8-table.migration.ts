import Knex from "knex";

export function setUTF8Table(table: Knex.CreateTableBuilder): void {
    table.charset('utf8mb4');
    table.collate('utf8mb4_general_ci');
}
