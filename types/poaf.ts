export type POAF = {
  id: string;
  studentID: string;
  studentName: string;
  dateOfBirth: string;
  formattedDateOfBirth: string;
  schoolName: string;
  schoolCity: string;
  address: string;
  serie: string;
  userID: string;
  responses: Record<number, POAFResponse>;
  additionalObservations: string;
  localCreatedAt: string;
};

export interface POAFResponse {
  response: string;
  category: string;
}
