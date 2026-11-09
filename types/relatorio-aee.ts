import { StudentSummary } from "./aluno";
import { TypeOfDisability, TypeOfDisorder } from "./questionario-psicopedagogo";

export interface ReportAEE {
  id: string;
  student: StudentSummary;
  disorders: TypeOfDisorder[];
  disabilities: TypeOfDisability[];
}
