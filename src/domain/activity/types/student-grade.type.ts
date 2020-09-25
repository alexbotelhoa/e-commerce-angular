import { GradeTypeId } from "../enums/grade-type-id.enum";

export interface StudentGrade {
    typeId: GradeTypeId;
    grade: number;
}
