import { StringKeyof } from "./string-keyof.type";

export type EntityMetadata<Entity, Table extends string> = {
    readonly table: Table;
    readonly columns: ReadonlyArray<StringKeyof<Entity>>;
    readonly primaryColumn: StringKeyof<Entity>;
}

