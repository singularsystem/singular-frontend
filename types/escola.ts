export interface Escola {
  id: string;
  name: string;
  city: string;
  state: string;
  principalName: string;
  principalID: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string;
  localUpdatedAt: string;
  isActive: string;
  totalStudents: number;
  totalStudentsAEE: number;
  disabilities: Disability[];
}

export type Disability = {
  tipo: string;
  quantidade: number;
};

export type School = {
  id: string;
  name: string;
  city: string;
};
