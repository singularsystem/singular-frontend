import { CreatePAEEEntity, PAEEEntity, UpdatePAEEEntity } from "../../model/entities/paee/PAEEEntity";
import { PortageEntity } from "../../model/entities/paee/PortageEntity";
import { IPAEERepository } from "../../model/repositories/paee/IPAEERepository";
import { IPortageRepository } from "../../model/repositories/paee/IPortageRepository";
import {
  PAEEActivities,
  PAEEEvaluation,
  PAEEProfessionals,
  PAEEResources,
  PAEEStrategies,
  PAEEType,
  PAEEWorkMethodology,
} from "@/types/paee";

export interface PAEEFormState {
  formData: UpdatePAEEEntity; // Using UpdatePAEEDTO as the base shape for the form
  plano: PAEEEntity | null;
  portage: PortageEntity | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveSuccess: boolean;
}

export class PAEEFormViewModel {
  private state: PAEEFormState = {
    formData: {
      id: "",
      studentID: "",
      userID: "",
      portageID: "",
      typeOfDisability: "",
      academicRecord: "",
      medicalReport: "",
      medications: "",
      followUp: "",
      organizationOfCare: [] as PAEEType[],
      otherOrganization: "",
      weeklyFrequency: "",
      otherFrequency: "",
      assistingTimePerSession: "",
      otherServiceTime: "",
      compositionOfAssisting: "",
      otherProfessionals: [] as PAEEProfessionals[],
      medicalSpecialty: "",
      otherProfessionalsDescription: "",
      differentiatedActivitiesInAEE: [] as PAEEActivities[],
      workMethodology: [] as PAEEWorkMethodology[],
      materialResourcesAndEquipment: [] as PAEEResources[],
      criteriaInEvaluation: [] as PAEEEvaluation[],
      resourcesAndStrategies: [] as PAEEStrategies[],
      additionalObservations: "",
    },
    plano: null,
    portage: null,
    isLoading: true,
    isSaving: false,
    error: null,
    saveSuccess: false,
  };

  private listeners: ((state: PAEEFormState) => void)[] = [];

  constructor(
    private paeeRepository: IPAEERepository,
    private portageRepository: IPortageRepository
  ) {}

  getState(): PAEEFormState {
    return { ...this.state };
  }

  subscribe(listener: (state: PAEEFormState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  updateFormData(updates: Partial<UpdatePAEEEntity>) {
    this.state.formData = { ...this.state.formData, ...updates };
    this.notify();
  }

  async loadForCreate(portageId: string) {
    this.state.isLoading = true;
    this.state.error = null;
    this.notify();

    try {
      const portage = await this.portageRepository.getPortageById(portageId);
      this.state.portage = portage;
    } catch (error: any) {
      this.state.error = error.message || "Erro ao carregar o Portage.";
    } finally {
      this.state.isLoading = false;
      this.notify();
    }
  }

  async loadForEdit(paeeId: string) {
    this.state.isLoading = true;
    this.state.error = null;
    this.notify();

    try {
      const plano = await this.paeeRepository.getPAEEById(paeeId);
      this.state.plano = plano;
      
      // Portage is included inside plano, but let's fetch it if needed or extract it.
      // In the edit screen, they fetched portage explicitly, but we can just use plano.portage
      this.state.portage = plano.portage as PortageEntity;

      this.state.formData = {
        id: plano.id ?? "",
        studentID: plano.student.id ?? "",
        userID: plano.professional.id ?? "",
        portageID: plano.portage.id ?? "",
        typeOfDisability: plano.typeOfDisability ?? "",
        academicRecord: plano.academicRecord ?? "",
        medicalReport: plano.medicalReport ?? "",
        medications: plano.medications ?? "",
        followUp: plano.followUp ?? "",
        organizationOfCare: plano.organizationOfCare?.map(item => ({ type: item.type })) ?? [],
        otherOrganization: plano.otherOrganization ?? "",
        weeklyFrequency: plano.weeklyFrequency ?? "",
        otherFrequency: plano.otherFrequency ?? "",
        assistingTimePerSession: plano.assistingTimePerSession ?? "",
        otherServiceTime: plano.otherServiceTime ?? "",
        compositionOfAssisting: plano.compositionOfAssisting ?? "",
        otherProfessionals: plano.otherProfessionals?.map(item => ({ professional: item.professional })) ?? [],
        medicalSpecialty: plano.medicalSpecialty ?? "",
        otherProfessionalsDescription: plano.otherProfessionalsDescription ?? "",
        differentiatedActivitiesInAEE: plano.differentiatedActivitiesInAEE?.map(item => ({ activity: item.activity })) ?? [],
        workMethodology: plano.workMethodology?.map(item => ({ methodology: item.methodology })) ?? [],
        materialResourcesAndEquipment: plano.materialResourcesAndEquipment?.map(item => ({ resource: item.resource })) ?? [],
        criteriaInEvaluation: plano.criteriaInEvaluation?.map(item => ({ criterion: item.criterion })) ?? [],
        resourcesAndStrategies: plano.resourcesAndStrategies?.map(item => ({ strategy: item.strategy })) ?? [],
        additionalObservations: plano.additionalObservations ?? "",
      };
    } catch (error: any) {
      this.state.error = error.message || "Erro ao carregar o PAEE.";
    } finally {
      this.state.isLoading = false;
      this.notify();
    }
  }

  async savePAEE(userId: string, isEdit: boolean) {
    if (!this.state.portage || !userId) {
      this.state.error = "Usuário ou aluno(a) não carregado(s).";
      this.notify();
      return;
    }

    this.state.isSaving = true;
    this.state.error = null;
    this.state.saveSuccess = false;
    this.notify();

    try {
      this.state.formData.userID = userId;
      this.state.formData.studentID = this.state.portage.student.id;
      this.state.formData.portageID = this.state.portage.id;

      if (isEdit) {
        await this.paeeRepository.updatePAEE(this.state.formData);
      } else {
        await this.paeeRepository.createPAEE(this.state.formData as CreatePAEEEntity);
      }
      this.state.saveSuccess = true;
    } catch (error: any) {
      this.state.error = error.message || "Ocorreu um erro ao tentar salvar o plano";
    } finally {
      this.state.isSaving = false;
      this.notify();
    }
  }
}
