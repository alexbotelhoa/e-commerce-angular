export interface CIClass {
    Id: number;
    Nome: string;
}

export interface BasicStudentData {
    Id: number;
    Nome: string;
}

export interface Enrollment {
    Id: number;
    Nome: string;
    Turmas: CIClass[];
}

export interface AuthenticationBody {
    Id: number;
    Nome: string;
    "Matriculas-Aluno": Enrollment[];
    'Turmas-Professor': CIClass[];
    'Alunos-Responsavel': BasicStudentData[];
}

