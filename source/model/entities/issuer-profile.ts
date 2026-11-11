export interface IssuerProfile {
  displayName: string;
  professionalRegistration?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  hasLogo?: boolean;
}

export interface UpdateIssuerProfileDto {
  displayName: string;
  professionalRegistration?: string | null;
  phone?: string | null;
  email?: string | null;
}
