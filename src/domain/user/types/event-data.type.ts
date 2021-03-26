export interface EventDataRequest {
    Turmas: Turma[];
}

export interface Turma {
    turma: string;
    periodo: string;
    aula: string;
    inicio_da_aula: string;
    final_da_aula: string;
    vagas: string;
    matriculados: string;
    materia: string;
    diasdasemanahorario: string;
    status: string;
    professor_conc: string;
    descr_materia: string;
    carreira: string;
    sala_zoom: string;
    link_estatico: string;
    typeFaceToFace: string;
    categoria: string;
    matriculado: string;
    dados_aula: Dadosaula[];
    endereco: Endereco;
}

interface Endereco {
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    CEP: string;
    cidade: string;
    estado: string;
}

interface Dadosaula {
    crseid: string;
    crse_offer_nbr: string;
    strm: string;
    session_code: string;
    class_section: string;
    class_mtg_nbr: string;
    facility_id: string;
    meeting_time_start: string;
    meeting_time_end: string;
    mon: string;
    tues: string;
    wed: string;
    thurs: string;
    fri: string;
    sat: string;
    sun: string;
    start_dt: string;
    end_dt: string;
    instrutor_orientador: Instrutororientador[];
}

interface Instrutororientador {
    emplid: string;
    nome: string;
    tipo_de_instrutor: string;
    macID: string;
    macPass: string;
}