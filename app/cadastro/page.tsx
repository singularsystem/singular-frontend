"use client";
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { useFetchSchoolsByCity } from "@/hooks/useFetchSchools";
import { estados, roleLabels } from "@/lib/constants";
import { isValidDate, isValidEmail } from "@/lib/utils";
import { FormDataType } from "@/types/usuario";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cadastro() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [emailTouched, setEmailTouched] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [emailCheckError, setEmailCheckError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    sex: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    state: "",
    city: "",
    type: "",
    schoolID: null,
  });

  // Estados para controlar quando os hooks devem ser executados
  const [shouldFetchCities, setShouldFetchCities] = useState(false);
  const [shouldFetchSchools, setShouldFetchSchools] = useState(false);

  const {
    cities,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchCitiesByUf(shouldFetchCities ? formData.state : "");

  const roles = [
    "Secretary",
    "SocialWork",
    "Psychologist",
    "Psychopedagogue",
    "Teacher",
    "Coordinator",
    "Principal",
    "MunicipalManager",
  ];

  const {
    schools,
    error: errorSchools,
    loading: loadingSchools,
  } = useFetchSchoolsByCity(shouldFetchSchools ? formData.city : "");

  // Efeitos para tratamento de erros
  useEffect(() => {
    if (fetchError) {
      toast({
        title: "Erro ao buscar cidades",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, toast]);

  useEffect(() => {
    if (errorSchools) {
      toast({
        title: "Erro ao buscar escolas",
        description: errorSchools.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [errorSchools, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmailTouched(true);
      setIsEmailAvailable(null);
      setEmailCheckError(null);
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Ativar fetches quando estados ou cidades forem selecionados
    if (field === "state" && value) {
      setShouldFetchCities(true);
    } else if (field === "city" && value) {
      setShouldFetchSchools(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCheckingEmail) {
      toast({
        title: "Validação em andamento",
        description: "Aguarde a verificação do email.",
        variant: "destructive",
      });
      return;
    }

    if (emailTouched && isEmailAvailable === false) {
      toast({
        title: "Email já cadastrado",
        description: "Este email já está cadastrado. Por favor, use outro.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "Senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    if (!formData.sex) {
      toast({
        title: "Erro de validação",
        description: "Selecione o sexo",
        variant: "destructive",
      });
      return;
    }

    if (!isValidDate(formData.dateOfBirth)) {
      toast({
        title: "Erro de validação",
        description: "Data de nascimento inválida",
        variant: "destructive",
      });
      return;
    }
    if (!formData.type) {
      toast({
        title: "Erro de validação",
        description: "Selecione o tipo de perfil",
        variant: "destructive",
      });
      return;
    }

    if (!formData.state) {
      toast({
        title: "Erro de validação",
        description: "Selecione o estado",
        variant: "destructive",
      });
      return;
    }

    if (!formData.city) {
      toast({
        title: "Erro de validação",
        description: "Selecione o município",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend = {
        ...formData,
        schoolID: formData.schoolID !== "" ? formData.schoolID : null,
      };

      const response = await fetch(`${apiUrl}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          variant: "destructive",
          title: "Erro ao salvar usuário",
          description:
            errorData.message ||
            "Ocorreu um erro ao tentar salvar o usuário. Por favor, tente novamente.",
        });
        return;
      }

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Você já pode utilizar nosso sistema. Faça o login!",
          variant: "success",
        });
        setTimeout(() => {
          router.push("/login");
        }, 100);
      } else {
        toast({
          title: "Erro ao cadastrar",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!emailTouched) return;

    const email = formData.email.trim();

    if (!email || !isValidEmail(email) || !apiUrl) {
      setIsCheckingEmail(false);
      setIsEmailAvailable(null);
      setEmailCheckError(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsCheckingEmail(true);
      setEmailCheckError(null);
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/users/email-availability?email=${encodeURIComponent(email)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("email_check_failed");
        }

        const result = await response.json();
        setIsEmailAvailable(Boolean(result?.data?.available));
      } catch (error) {
        if (controller.signal.aborted) return;
        setIsEmailAvailable(null);
        setEmailCheckError("Não foi possível verificar o email.");
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingEmail(false);
        }
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [apiUrl, emailTouched, formData.email]);

  return (
    <div className="min-h-screen p-4 bg-brand-navy">
      <div className="w-full flex items-center justify-between pr-2 pl-2">
        <BrandLogo bg="dark" width={180} priority />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,1.25)]">
          <CardHeader className="space-y-1 mb-4">
            <CardTitle className="text-2xl text-center text-brand-navy">
              Cadastro no Singular System
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Preencha os dados abaixo para solicitar acesso à plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    type="text"
                    autoComplete="off"
                    placeholder="Digite o nome completo do usuário"
                    className="mb-4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    autoComplete="off"
                    placeholder="seu.email@exemplo.com"
                    className={`mb-1 ${isEmailAvailable === false ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    required
                  />
                  {emailTouched &&
                    isValidEmail(formData.email) &&
                    isCheckingEmail &&
                    !emailCheckError && (
                      <p className="text-xs text-muted-foreground">
                        Verificando email...
                      </p>
                    )}
                  {emailTouched && isEmailAvailable === false && (
                    <p className="text-xs text-destructive">
                      Este email já está cadastrado.
                    </p>
                  )}
                  {emailTouched && emailCheckError && (
                    <p className="text-xs text-muted-foreground">
                      {emailCheckError}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Digite a senha"
                    className="mb-4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirme a senha"
                    className="mb-4"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Telefone</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mb-4"
                    placeholder="(99) 99999-9999"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo</Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) => handleSelectChange("sex", value)}
                    required
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
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mb-4"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Perfil</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                    required
                  >
                    <SelectTrigger id="perfil">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role, index) => (
                        <SelectItem key={index} value={role}>
                          {roleLabels[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
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
                  />
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
                    onValueChange={(value) =>
                      handleSelectChange("state", value)
                    }
                    required
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((est) => (
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
                    disabled={!formData.state}
                    required
                  >
                    <SelectTrigger id="city">
                      <SelectValue
                        placeholder={
                          fetchLoading ? "Carregando..." : "Selecione"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.nome}>
                          {city.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                            Professor(a), Coordenador(a) ou Diretor(a)
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
                      <SelectValue
                        placeholder={
                          loadingSchools ? "Carregando..." : "Selecione"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {schools && schools.length > 0 ? (
                        schools.map((escola) => (
                          <SelectItem key={escola.id} value={escola.id}>
                            {escola.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="none" value="Nenhuma" disabled>
                          Nenhuma escola cadastrada
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-semibold shadow-md"
                disabled={isLoading || isCheckingEmail || isEmailAvailable === false}
              >
                {isLoading ? "Enviando..." : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-700">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="text-center text-xs text-white">
        © {new Date().getFullYear()} Instituto Piauiense de Assistência,
        Auditoria e Gestão em Saúde
      </div>
    </div>
  );
}
