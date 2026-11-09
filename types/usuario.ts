export interface Usuario {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  roles: string[];
  phoneNumber: string;
  state: string;
  city: string;
  sex: "Feminino" | "Masculino" | string;
  dateOfBirth: string;
  formattedDateOfBirth: string;
  age: number;
  address: string;
  schoolID: string | null;
  schoolName: string;
  status: string | null;
  mustChangePassword: boolean;
  lastLogin: string | null;
  localLastLogin: string | null;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type AuthUser = Pick<
  Usuario,
  | "id"
  | "userName"
  | "fullName"
  | "email"
  | "roles"
  | "state"
  | "city"
  | "schoolID"
  | "schoolName"
  | "dateOfBirth"
  | "sex"
  | "age"
  | "address"
  | "lastLogin"
  | "status"
  | "mustChangePassword"
  | "localLastLogin"
  | "formattedDateOfBirth"
>;

export interface ProfessionalSummary {
  id: string;
  fullName: string;
  roles: string[];
  state: string;
  city: string;
  schoolID: string | null;
  schoolName: string;
}

export type FormDataType = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  sex: string;
  dateOfBirth: string;
  type: string;
  address: string;
  state: string;
  city: string;
  schoolID: string | null;
};

export type EditarFormDataType = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  sex: string;
  dateOfBirth: string;
  type: string;
  address: string;
  state: string;
  city: string;
  schoolID: string | null;
};

export type ResetarSenhaFormDataType = {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type LinhaImportacaoUsuario = {
  fullName: string;
  email: string;
  phoneNumber: string;
  sex: string;
  dateOfBirth: string;
  type: string;
  state: string;
  city: string;
  address: string;
  schoolID: string | null;
};

export type UsuarioImportadoComSucesso = {
  rowNumber: number;
  fullName: string;
  email: string;
};

export type UsuarioImportadoComErro = {
  rowNumber: number;
  fullName: string;
  email: string;
  errors: string[];
  rowData: LinhaImportacaoUsuario;
};

export type ResultadoImportacaoUsuarios = {
  createdCount: number;
  failedCount: number;
  defaultPassword: string;
  successfulUsers: UsuarioImportadoComSucesso[];
  failedUsers: UsuarioImportadoComErro[];
};
