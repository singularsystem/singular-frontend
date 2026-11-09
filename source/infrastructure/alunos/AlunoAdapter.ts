import { AlunoAttachment, AlunoDocument, AlunoEntity } from "../../model/entities/alunos/AlunoEntity";
import { getNomeEstadoPorNome } from "@/lib/utils";

export class AlunoAdapter {
  static toEntity(apiData: any): AlunoEntity {
    // 1. Normalização de Data para Input HTML (YYYY-MM-DD)
    const rawDate = apiData.dateOfBirth || apiData.dataNascimento || "";
    let isoDate = "";
    let displayDate = "";

    if (rawDate) {
      try {
        const dateObj = new Date(rawDate);
        if (!isNaN(dateObj.getTime())) {
          isoDate = dateObj.toISOString().split("T")[0];
          displayDate = dateObj.toLocaleDateString("pt-BR");
        } else if (typeof rawDate === "string" && rawDate.includes("/")) {
          // Caso a API já mande DD/MM/YYYY
          const [d, m, y] = rawDate.split("/");
          isoDate = `${y}-${m}-${d}`;
          displayDate = rawDate;
        }
      } catch (e) {
        isoDate = rawDate;
        displayDate = rawDate;
      }
    }

    // 2. Normalização de Sexo (Enums numéricos C# ou strings)
    const normalizeSex = (s: any) => {
      if (s === undefined || s === null) return "";
      const sStr = String(s).toLowerCase().trim();
      if (sStr === "2" || sStr === "male" || sStr === "masculino" || sStr === "m") return "Masculino";
      if (sStr === "1" || sStr === "female" || sStr === "feminino" || sStr === "f") return "Feminino";
      if (sStr === "3" || sStr === "other" || sStr === "outro") return "Outro";
      return "";
    };

    // 3. Normalização de Estado Civil dos Pais (Enums numéricos C# ou strings)
    const normalizeMaritalStatus = (s: any) => {
      if (s === undefined || s === null) return "";
      const sStr = String(s).toLowerCase().trim();
      if (sStr === "1" || sStr === "married" || sStr === "casado") return "Casado";
      if (sStr === "2" || sStr === "divorced" || sStr === "divorciado") return "Divorciado";
      if (sStr === "3" || sStr === "single" || sStr === "solteiro") return "Solteiro";
      if (sStr === "4" || sStr === "widowed" || sStr === "viuvo" || sStr === "viúvo") return "Viúvo";
      return "";
    };

    // 4. Normalização de Cor da Pele (Enums numéricos C# ou strings)
    const normalizeSkinColor = (s: any) => {
      if (s === undefined || s === null) return "";
      const sStr = String(s).toLowerCase().trim();
      if (sStr === "1" || sStr === "white" || sStr === "branco") return "Branco";
      if (sStr === "2" || sStr === "black" || sStr === "preto") return "Preto";
      if (sStr === "3" || sStr === "brown" || sStr === "pardo") return "Pardo";
      if (sStr === "4" || sStr === "indigenous" || sStr === "indigena" || sStr === "indígena") return "Indígena";
      if (sStr === "5" || sStr === "yellow" || sStr === "amarelo") return "Amarelo";
      return "";
    };

    // 5. Normalização de Série (Enums numéricos C# ou strings)
    const normalizeSerie = (s: any) => {
      if (s === undefined || s === null) return "";
      const sStr = String(s).toLowerCase().trim();
      const seriesMap: Record<string, string> = {
        "1": "Educação Infantil",
        "earlychildhoodeducation": "Educação Infantil",
        "educacao infantil": "Educação Infantil",
        "2": "1º Ano",
        "firstyear": "1º Ano",
        "1º ano": "1º Ano",
        "3": "2º Ano",
        "secondyear": "2º Ano",
        "2º ano": "2º Ano",
        "4": "3º Ano",
        "thirdyear": "3º Ano",
        "3º ano": "3º Ano",
        "5": "4º Ano",
        "fourthyear": "4º Ano",
        "4º ano": "4º Ano",
        "6": "5º Ano",
        "fifthyear": "5º Ano",
        "5º ano": "5º Ano",
        "7": "6º Ano",
        "sixthyear": "6º Ano",
        "6º ano": "6º Ano",
        "8": "7º Ano",
        "seventhyear": "7º Ano",
        "7º ano": "7º Ano",
        "9": "8º Ano",
        "eighthyear": "8º Ano",
        "8º ano": "8º Ano",
        "10": "9º Ano",
        "ninthyear": "9º Ano",
        "9º ano": "9º Ano",
        "11": "1º Ano - Ensino Médio",
        "firstyearhighschool": "1º Ano - Ensino Médio",
        "1º ano - ensino medio": "1º Ano - Ensino Médio",
        "1º ano - ensino médio": "1º Ano - Ensino Médio",
        "12": "2º Ano - Ensino Médio",
        "secondyearhighschool": "2º Ano - Ensino Médio",
        "2º ano - ensino medio": "2º Ano - Ensino Médio",
        "2º ano - ensino médio": "2º Ano - Ensino Médio",
        "13": "3º Ano - Ensino Médio",
        "thirdyearhighschool": "3º Ano - Ensino Médio",
        "3º ano - ensino medio": "3º Ano - Ensino Médio",
        "3º ano - ensino médio": "3º Ano - Ensino Médio",
      };
      return seriesMap[sStr] || s;
    };

    return {
      id: apiData.id,
      nome: apiData.nome || apiData.fullName,
      fullName: apiData.fullName || apiData.nome,
      cpf: apiData.cpf || "",
      rg: apiData.rg || "",
      susCard: apiData.susCard || "",
      dataNascimento: isoDate || rawDate, // Usado no input type="date"
      formattedDateOfBirth: apiData.formattedDateOfBirth || displayDate,
      age: apiData.age,
      sexo: normalizeSex(apiData.sexo || apiData.sex),
      sex: normalizeSex(apiData.sex || apiData.sexo),
      email: apiData.email || "",
      telefone: apiData.telefone || "",
      status: apiData.status,
      escolaId: apiData.schoolID || apiData.escolaId,
      schoolID: apiData.schoolID || apiData.escolaId,
      escolaNome: apiData.schoolName || apiData.escolaNome,
      schoolName: apiData.schoolName || apiData.escolaNome,
      schoolCity: apiData.schoolCity || "",
      schoolState: getNomeEstadoPorNome(apiData.schoolState || ""),
      cidade: apiData.city || apiData.cidade,
      city: apiData.city || apiData.cidade,
      uf: getNomeEstadoPorNome(apiData.state || apiData.uf || "") || "",
      state: getNomeEstadoPorNome(apiData.state || apiData.uf || "") || "",
      address: apiData.address || "",
      serie: normalizeSerie(apiData.serie),
      nameOfPersonResponsible: apiData.nameOfPersonResponsible || "",
      maritalStatusParents: normalizeMaritalStatus(apiData.maritalStatusParents),
      skinColor: normalizeSkinColor(apiData.skinColor),

      
      reportID: apiData.reportID,
      socialWorkerReportID: apiData.socialWorkerReportID,
      psychologistReportID: apiData.psychologistReportID,
      psychopedagogueReportID: apiData.psychopedagogueReportID,
      snapIVQuestionnaireID: apiData.snapIVQuestionnaireID,
      neuropsychopedagogicalQuestionnaireID: apiData.neuropsychopedagogicalQuestionnaireID,
      mchatrQuestionnaireID: apiData.mchatrQuestionnaireID,
      mchatrQuestionnaireScore: apiData.mchatrQuestionnaireScore,
      mchatrfQuestionnaireID: apiData.mchatrfQuestionnaireID,
      carsChildhoodQuestionnaireID: apiData.carsChildhoodQuestionnaireID,
    };
  }

  static toDocument(apiData: any): AlunoDocument {
    return {
      id: apiData.id,
      type: apiData.documentType || apiData.type,
      documentType: apiData.documentType || apiData.type,
      date: apiData.localCreatedAt || apiData.createdAt || apiData.date,
      localCreatedAt: apiData.localCreatedAt || apiData.createdAt,
      status: apiData.status
    };
  }

  static toAttachment(apiData: any): AlunoAttachment {
    return {
      id: apiData.id,
      name: apiData.fileName || apiData.name,
      fileName: apiData.fileName || apiData.name,
      url: apiData.url,
      uploadDate: apiData.localCreatedAt || apiData.uploadDate,
      localCreatedAt: apiData.localCreatedAt,
      type: apiData.type
    };
  }
}
