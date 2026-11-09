import { Portage, PortageResponse } from "@/types/portage";

export type PortageEntity = Portage;
export type CreatePortageEntity = {
  studentID: string;
  userID: string;
  ageRange: string;
  responses: Record<number, PortageResponse>;
};
