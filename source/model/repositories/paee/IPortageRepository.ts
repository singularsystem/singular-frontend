import { PortageEntity, CreatePortageEntity } from "../../entities/paee/PortageEntity";

export interface IPortageRepository {
  getPortageById(id: string, signal?: AbortSignal): Promise<PortageEntity>;
  getPortagesByStudent(studentId: string, signal?: AbortSignal): Promise<PortageEntity[]>;
  createPortage(data: CreatePortageEntity): Promise<{ id: string }>;
}
