export interface DisabilityEntity {
  tipo: string;
  quantidade: number;
}

export interface EscolaEntity {
  id: string;
  name: string;
  city: string;
  state: string;
  principalName: string;
  principalID: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  totalStudents: number;
  totalStudentsAEE: number;
  disabilities: DisabilityEntity[];
}

export interface CreateEscolaDTO {
  name: string;
  city: string;
  state: string;
  principalID: string;
}

export interface UpdateEscolaDTO extends CreateEscolaDTO {
  id: string;
}
