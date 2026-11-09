import { EscolaEntity } from "../../model/entities/escolas/EscolaEntity";

export class EscolaAdapter {
  static toEntity(raw: any): EscolaEntity {
    if (!raw) {
      throw new Error("Dados da escola inválidos ou vazios");
    }

    return {
      id: raw.id || raw.ID || "",
      name: raw.name || raw.Name || "",
      city: raw.city || raw.City || "",
      state: raw.state || raw.State || "",
      principalName: raw.principalName || raw.PrincipalName || "",
      principalID: raw.principalID || raw.PrincipalID || "",
      createdAt: raw.createdAt || raw.CreatedAt || "",
      updatedAt: raw.updatedAt || raw.UpdatedAt || "",
      isActive: raw.isActive === true || String(raw.isActive).toLowerCase() === "true" || raw.isActive === "1",
      totalStudents: Number(raw.totalStudents ?? raw.TotalStudents ?? 0),
      totalStudentsAEE: Number(raw.totalStudentsAEE ?? raw.TotalStudentsAEE ?? 0),
      disabilities: (raw.disabilities || raw.Disabilities || []).map((d: any) => ({
        tipo: d.tipo || d.Tipo || "",
        quantidade: Number(d.quantidade ?? d.Quantidade ?? 0)
      }))
    };
  }
}
