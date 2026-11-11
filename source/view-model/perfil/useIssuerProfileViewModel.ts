import { useState, useEffect, useCallback } from "react";
import { IssuerProfile, UpdateIssuerProfileDto } from "../../model/entities/issuer-profile";
import { IssuerProfileRepository } from "../../model/repositories/issuer-profile.repository";

export function useIssuerProfileViewModel(token: string | null) {
  const [profile, setProfile] = useState<IssuerProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [professionalRegistration, setProfessionalRegistration] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const repository = new IssuerProfileRepository();

  const loadProfile = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await repository.getProfile(token);
      setProfile(data);
      setDisplayName(data.displayName || "");
      setProfessionalRegistration(data.professionalRegistration || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      if (data.logoUrl) {
        setLogoPreviewUrl(data.logoUrl);
      }
    } catch (err: any) {
      // 404 apenas significa que ainda não existe perfil cadastrado
      if (!err.message?.includes("404")) {
        setErrorMessage(err.message || "Erro ao carregar dados profissionais");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setErrorMessage(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreviewUrl(url);
    }
  };

  const saveProfile = async (): Promise<boolean> => {
    if (!token) return false;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const dto: UpdateIssuerProfileDto = {
        displayName: displayName.trim(),
        professionalRegistration: professionalRegistration.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
      };

      const updated = await repository.updateProfile(dto, token);
      setProfile(updated);

      if (selectedFile) {
        const logoRes = await repository.uploadLogo(selectedFile, token);
        setLogoPreviewUrl(logoRes.logoUrl);
        setSelectedFile(null);
      }

      setSuccessMessage("Dados profissionais e logotipo salvos com sucesso!");
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao salvar dados profissionais");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    displayName,
    setDisplayName,
    professionalRegistration,
    setProfessionalRegistration,
    phone,
    setPhone,
    email,
    setEmail,
    logoPreviewUrl,
    selectedFile,
    handleFileChange,
    saveProfile,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    reload: loadProfile,
  };
}
