"use client";
export const dynamic = "force-dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { useFetchSchoolsByCity } from "@/hooks/useFetchSchools";
import { estados, roleLabels } from "@/lib/constants";
import {
  isValidDate,
  isValidEmail,
  normalizeDateInputValue,
  normalizeTextForCompare,
} from "@/lib/utils";
import { EditarFormDataType } from "@/types/usuario";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../ui/use-toast";

interface EditarUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (results: any) => void;
  formData: EditarFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<EditarFormDataType>>;
}

export function EditarUsuarioModal({
  open,
  onOpenChange,
  onSave,
  formData,
  setFormData,
}: EditarUsuarioModalProps) {
  const [scrollIndicator, setScrollIndicator] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    cities,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchCitiesByUf(formData.state);

  useEffect(() => {
    setIsLoading(true);

    const roles = [
      "Admin",
      "Secretary",
      "SocialWork",
      "Psychologist",
      "Psychopedagogue",
      "Teacher",
      "Coordinator",
      "Principal",
      "MunicipalManager",
    ];

    if (user?.roles[0].toLowerCase() === "municipalmanager") {
      let filteredRoles = roles.filter(
        (role) => !["Admin", "MunicipalManager"].includes(role),
      );
      setFilteredRoles(filteredRoles);
    } else {
      setFilteredRoles(roles);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (fetchLoading) return;

    if (formData.state != "") {
      // Find state with case-insensitive and accent-insensitive match
      const normalizedSavedState = normalizeTextForCompare(formData.state);
      const matchedState = estados.find(
        (e) => normalizeTextForCompare(e.nome) === normalizedSavedState,
      );

      if (matchedState && matchedState.nome !== formData.state) {
        handleSelectChange("state", matchedState.nome);
      }

      if (fetchError) {
        toast({
          title: "Erro ao buscar cidades",
          description: fetchError.message || "Ocorreu um erro desconhecido.",
          variant: "destructive",
        });
      } else if (cities.length === 0) {
        toast({
          title: "Lista de cidades não foi encontrada",
          description: "Por favor, cadastre alguma escola!",
        });
      } else if (formData.city) {
        // Find city with case-insensitive and accent-insensitive match
        const normalizedSavedCity = normalizeTextForCompare(formData.city);
        const matchedCity = cities.find(
          (c) => normalizeTextForCompare(c.nome) === normalizedSavedCity,
        );

        if (matchedCity && matchedCity.nome !== formData.city) {
          handleSelectChange("city", matchedCity.nome);
        }
      }
    }
  }, [fetchError, fetchLoading, cities, toast, formData.city, formData.state]);

  const {
    schools,
    error: errorSchools,
    loading: loadingSchools,
  } = useFetchSchoolsByCity(formData.city);

  useEffect(() => {
    if (loadingSchools) return;

    if (errorSchools) {
      toast({
        title: "Erro ao buscar escolas",
        description: errorSchools.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [errorSchools, loadingSchools, schools, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      setScrollIndicator(scrollHeight > clientHeight);
    }
  }, [open]);

  const shouldShowSchool = (type?: string) =>
    type === "Principal" || type === "Coordinator";

  useEffect(() => {
    if (!shouldShowSchool(formData.type) && formData.schoolID) {
      setFormData((prev) => ({ ...prev, schoolID: "" }));
    }
  }, [formData.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fullName) {
      alert("Por favor, insira o nome do novo usuário");
      return;
    }

    if (!formData.email) {
      alert("Por favor, insira um email");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Por favor, insira um email válido");
      return;
    }

    if (!formData.sex) {
      alert("Selecione o sexo");
      return;
    }

    if (!isValidDate(formData.dateOfBirth)) {
      alert("Data de nascimento inválida. É necessário ter pelo menos 18 anos");
      return;
    }

    if (!formData.type) {
      alert("Selecione o tipo de perfil");
      return;
    }

    if (!formData.state) {
      alert("Selecione o estado");
      return;
    }

    if (!formData.city) {
      alert("Selecione o município");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[70vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-brand-navy">
              Editar Usuário
            </DialogTitle>
          </div>
          <DialogDescription>
            Editar dados de um usuário existente
          </DialogDescription>
        </div>
        {/* {scrollIndicator && (
          <div
            className="absolute bottom-[80px] left-1/2 transform -translate-x-1/2 animate-bounce bg-primary/10 rounded-full p-1"
            aria-hidden="true"
          >
            <ChevronDown className="h-5 w-5 text-primary" />
          </div>
        )} */}

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8">
          <div className="mt-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Digite o nome completo do usuário"
                  className="mb-4"
                  required
                ></Input>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  className="mb-4"
                  required
                ></Input>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefone</Label>
                <Input
                  id="phoneNumber"
                  type="phone"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mb-4"
                  placeholder="(99) 99999-9999"
                  required
                ></Input>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => handleSelectChange("sex", value)}
                >
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={normalizeDateInputValue(formData.dateOfBirth)}
                  onChange={handleChange}
                  className="mb-4"
                  required
                ></Input>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Perfil</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="perfil">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRoles?.map((role, index) => (
                      <SelectItem key={index} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-6">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Digite o endereço do usuário"
                  className="mb-4"
                  required
                ></Input>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_0.6fr] gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="state">Estado</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Selecione o estado em que trabalha</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleSelectChange("state", value)}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados?.map((est) => (
                      <SelectItem key={est.sigla} value={est.nome}>
                        {est.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="city">Munícipio</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Selecione a cidade em que trabalha</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={formData.city}
                  onValueChange={(value) => handleSelectChange("city", value)}
                >
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.roles[0].toLowerCase() === "municipalmanager" ? (
                      <SelectItem value={user.city}>{user.city}</SelectItem>
                    ) : (
                      cities?.map((city) => (
                        <SelectItem key={city.id} value={city.nome}>
                          {city.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              {shouldShowSchool(formData.type) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="schoolID">Unidade Escolar</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Selecione uma escola caso seu perfil seja:
                            Coordenador(a) ou Diretor(a)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={formData.schoolID || ""}
                    onValueChange={(value) =>
                      handleSelectChange("schoolID", value)
                    }
                    disabled={!formData.city}
                  >
                    <SelectTrigger id="schoolID">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools && schools.length > 0 ? (
                        schools.map((escola) => (
                          <SelectItem key={escola.id} value={escola.id}>
                            {escola.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                          Nenhuma escola encontrada
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-2 p-3 border-t bg-background">
          <div className=" flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className=" bg-brand-navy hover:bg-blue-800"
            >
              Editar Usuário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
