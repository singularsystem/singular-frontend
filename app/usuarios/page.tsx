"use client";
export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CadastroUsuarioModal } from "@/components/usuario/cadastro-modal";
import { EditarUsuarioModal } from "@/components/usuario/edicao-modal";
import { ImportacaoResultadoModal } from "@/components/usuario/importacao-resultado-modal";
import { ResetarSenhaModal } from "@/components/usuario/resetar-senha-modal";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { estados } from "@/lib/constants";
import {
  getNomeEstadoPorNome,
  getPageNumbers,
  normalizeDateInputValue,
} from "@/lib/utils";
import {
  EditarFormDataType,
  FormDataType,
  ResultadoImportacaoUsuarios,
  ResetarSenhaFormDataType,
  Usuario,
} from "@/types/usuario";
import {
  Download,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Usuarios() {
  const defaultNewUserPassword = "user123!";
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRole, setSearchRole] = useState("todos");
  const [searchState, setSearchState] = useState("todos");
  const [searchCity, setSearchCity] = useState("todos");
  const [shouldFetchCities, setShouldFetchCities] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [cadastroUsuarioModalOpen, setCadastroUsuarioModalOpen] =
    useState(false);
  const [editarUsuarioModalOpen, setEditarUsuarioModalOpen] = useState(false);
  const [resetarSenhaModalOpen, setResetarSenhaModalOpen] = useState(false);
  const { user, token, isLoading: authLoading } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [shouldFetchUsers, setShouldFetchUsers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importResultModalOpen, setImportResultModalOpen] = useState(false);
  const [lastImportResult, setLastImportResult] =
    useState<ResultadoImportacaoUsuarios | null>(null);

  const {
    usuarios,
    total,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchUsers(
    shouldFetchUsers ? currentPage : 1,
    itemsPerPage,
    refreshTrigger,
    shouldFetchUsers ? searchTerm : "",
    searchRole,
    searchState,
    searchCity
  );

  const {
    cities,
    loading: fetchCitiesLoading,
  } = useFetchCitiesByUf(shouldFetchCities ? searchState : "");

  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    email: "",
    password: defaultNewUserPassword,
    confirmPassword: defaultNewUserPassword,
    sex: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    state: "",
    city: "",
    type: "",
    schoolID: "",
  });

  const [editarFormData, setEditarFormData] = useState<EditarFormDataType>({
    id: "",
    fullName: "",
    email: "",
    sex: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    state: "",
    city: "",
    type: "",
    schoolID: "",
  });

  const [resetarSenhaFormData, setResetarSenhaFormData] =
    useState<ResetarSenhaFormDataType>({
      id: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

  useEffect(() => {
    if (!authLoading && user) {
      setShouldFetchUsers(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar usuários",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, toast]);

  useEffect(() => {
    if (!user || !user.roles || user.roles.length === 0 || !usuarios) return;

    setFilteredUsuarios(usuarios);
    setIsLoading(false);
  }, [user, usuarios]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchRole, searchState, searchCity]);

  const handleStateChange = (value: string) => {
    setSearchState(value);
    setSearchCity("todos");
    setShouldFetchCities(value !== "todos");
  };

  useEffect(() => {
    if (!authLoading && user) {
      const userRole = user.roles?.[0]?.toLowerCase();
      if (!["municipalmanager", "admin"].includes(userRole || "")) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        router.push("/dashboard");
      }
    }
  }, [authLoading, user, router, toast]);

  const handleEditarUsuario = (usuario: Usuario) => {
    setEditarFormData({
      id: usuario.id,
      fullName: usuario.fullName || "",
      email: usuario.email || "",
      sex: usuario.sex || "",
      phoneNumber: usuario.phoneNumber || "",
      dateOfBirth: normalizeDateInputValue(
        usuario.dateOfBirth || usuario.formattedDateOfBirth,
      ),
      address: usuario.address || "",
      state: getNomeEstadoPorNome(usuario.state) || "",
      city: usuario.city || "",
      type: usuario.roles?.[0] || "",
      schoolID: usuario.schoolID || "",
    });
    setEditarUsuarioModalOpen(true);
  };

  const handleResetarSenha = (usuario: Usuario) => {
    setResetarSenhaFormData({
      id: usuario.id,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setResetarSenhaModalOpen(true);
  };

  const handleSubmit = async (formData: FormDataType) => {
    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Token não disponível",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        toast({
          variant: "destructive",
          title: "Erro ao salvar usuário",
          description: Array.isArray(result.data)
            ? result.data.join(", ")
            : "Ocorreu um erro desconhecido ao salvar o usuário.",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        setFormData({
          fullName: "",
          email: "",
          password: defaultNewUserPassword,
          confirmPassword: defaultNewUserPassword,
          phoneNumber: "",
          sex: "",
          dateOfBirth: "",
          type: "",
          address: "",
          state: "",
          city: "",
          schoolID: "",
        });

        setCadastroUsuarioModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);

        toast({
          title: "Usuário adicionado",
          description: "Novo usuário foi cadastrado com sucesso",
          variant: "success",
        });
      } else {
        console.log(result.data);
        toast({
          variant: "destructive",
          title: "Erro ao salvar usuário",
          description: Array.isArray(result.data)
            ? result.data.join(", ")
            : "Ocorreu um erro desconhecido ao salvar o usuário.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditarSubmit = async (formData: EditarFormDataType) => {
    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Token não disponível",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: formData.id,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        schoolID: formData.schoolID?.trim() ? formData.schoolID : null,
      };

      const response = await fetch(`${apiUrl}/api/v1/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        toast({
          variant: "destructive",
          title: "Erro ao atualizar usuário",
          description: Array.isArray(result.data)
            ? result.data.join(", ")
            : "Ocorreu um erro desconhecido ao atualizar o usuário.",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        setEditarFormData({
          id: "",
          fullName: "",
          email: "",
          phoneNumber: "",
          sex: "",
          dateOfBirth: "",
          type: "",
          address: "",
          state: "",
          city: "",
          schoolID: "",
        });

        setEditarUsuarioModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);

        toast({
          title: "Usuário atualizado",
          description: "Usuário foi atualizado com sucesso",
          variant: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar usuário",
          description:
            result.message ||
            "Ocorreu um erro desconhecido ao atualizar o usuário.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetarSenhaSubmit = async (
    formData: ResetarSenhaFormDataType,
  ) => {
    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Token não disponível",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          variant: "destructive",
          title: "Erro ao atualizar senha",
          description:
            errorData.message || "Ocorreu um erro ao tentar atualizar a senha.",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        setResetarSenhaFormData({
          id: "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });

        setResetarSenhaModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);

        toast({
          title: "Senha atualizada",
          description: "Senha foi atualizada com sucesso",
          variant: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar senha",
          description:
            result.message ||
            "Ocorreu um erro desconhecido ao atualizar a senha.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (usuario: Usuario) => {
    const userRole = user?.roles?.[0]?.toLowerCase();
    if (userRole === "admin") {
      setSelectedId(usuario.id);
      setShowConfirm(true);
    } else {
      toast({
        title: "Você não tem permissão para isso",
        description: "Você não tem permissão para excluir usuários",
        variant: "warning",
      });
    }
  };

  const confirmRemove = async () => {
    if (selectedId && token) {
      try {
        const response = await fetch(`${apiUrl}/api/v1/users/${selectedId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao remover usuário");
        }

        const result = await response.json();

        if (result.success) {
          setShowConfirm(false);
          setRefreshTrigger((prev) => prev + 1);
          toast({
            title: "Usuário excluído com sucesso",
            description: "Esse usuário foi removido da lista",
            variant: "success",
          });
        } else {
          toast({
            title: "Erro ao remover usuário",
            description: "Não foi possível remover esse usuário",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao remover usuário",
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadTemplate = async () => {
    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Token não disponível",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/template/xls`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não foi possível baixar o modelo da planilha.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "modelo-cadastro-usuarios.xls";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Erro ao baixar modelo",
        description:
          error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const escapeCsvValue = (value: string | null | undefined) => {
    const normalized = (value ?? "").replace(/"/g, '""');
    return `"${normalized}"`;
  };

  const handleDownloadFailedRows = () => {
    if (!lastImportResult || lastImportResult.failedUsers.length === 0) {
      return;
    }

    const headers = [
      "NomeCompleto",
      "Email",
      "Telefone",
      "Sexo (Feminino/Masculino/Outro)",
      "DataNascimento (dd/MM/yyyy)",
      "Perfil (Admin,Secretary,SocialWork,Psychologist,Psychopedagogue,Teacher,Coordinator,Principal,MunicipalManager)",
      "Estado",
      "Municipio",
      "Endereco",
      "SchoolID (Opcional)",
      "Erros",
    ];

    const csvRows = lastImportResult.failedUsers.map(({ rowData, errors }) =>
      [
        rowData.fullName,
        rowData.email,
        rowData.phoneNumber,
        rowData.sex,
        rowData.dateOfBirth,
        rowData.type,
        rowData.state,
        rowData.city,
        rowData.address,
        rowData.schoolID ?? "",
        errors.join(" | "),
      ]
        .map((value) => escapeCsvValue(value))
        .join(";"),
    );

    const csvContent = [
      headers.map((header) => escapeCsvValue(header)).join(";"),
      ...csvRows,
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "usuarios-com-falha-importacao.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleUploadSpreadsheet = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Token não disponível",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("file", selectedFile);

      const response = await fetch(`${apiUrl}/api/v1/users/import/xls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Não foi possível importar a planilha.",
        );
      }

      const importResult: ResultadoImportacaoUsuarios = {
        createdCount: result.data?.createdCount ?? 0,
        failedCount: result.data?.failedCount ?? 0,
        defaultPassword: result.data?.defaultPassword ?? defaultNewUserPassword,
        successfulUsers: Array.isArray(result.data?.successfulUsers)
          ? result.data.successfulUsers
          : [],
        failedUsers: Array.isArray(result.data?.failedUsers)
          ? result.data.failedUsers
          : [],
      };

      toast({
        title: "Importação finalizada",
        description:
          importResult.failedCount > 0
            ? `${importResult.createdCount} usuário(s) criado(s) e ${importResult.failedCount} linha(s) com erro. Veja os detalhes no modal.`
            : `${importResult.createdCount} usuário(s) criado(s) com sucesso.`,
        variant: importResult.failedCount > 0 ? "warning" : "success",
      });

      setLastImportResult(importResult);
      setImportResultModalOpen(true);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Erro ao importar planilha",
        description:
          error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  const userRole = user?.roles?.[0]?.toLowerCase();
  const hasPermission = userRole === "admin";

  if (!hasPermission) {
    return (
      <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <p>Acesso negado. Redirecionando...</p>
        </div>
      </main>
    );
  }

  const roleTranslations: { [key: string]: string } = {
    Admin: "Administrador(a)",
    Teacher: "Professor(a)",
    Psychologist: "Psicóloga(o)",
    Psychopedagogue: "Psicopedagogo(a)",
    SocialWork: "Assistente Social",
    Secretary: "Secretário(a)",
    MunicipalManager: "Prefeito(a)",
    Coordinator: "Coordenador(a)",
    Principal: "Diretor(a)",
  };

  const getTranslatedRole = (role: string | undefined): string => {
    if (!role) return "N/A";
    return roleTranslations[role] || role;
  };

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
          Usuários
        </h1>
        {userRole === "admin" && (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx"
              className="hidden"
              onChange={handleUploadSpreadsheet}
            />
            <Button
              type="button"
              onClick={handleDownloadTemplate}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
              Baixar Modelo XLS
            </Button>
            <Button
              type="button"
              onClick={handleClickUpload}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
              Enviar Planilha
            </Button>
            <Button
              type="button"
              onClick={() => setCadastroUsuarioModalOpen(true)}
              className="flex items-center gap-2 bg-[#111C4E] hover:bg-blue-800"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row items-center mb-6 gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="buscaUsuarios"
            type="search"
            placeholder="Buscar usuário por nome ou email..."
            className="pl-8"
            value={searchTerm}
            autoComplete="off"
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="w-full sm:w-auto min-w-[150px]">
            <Select value={searchRole} onValueChange={setSearchRole} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Perfis</SelectItem>
                {Object.entries(roleTranslations).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto min-w-[150px]">
            <Select value={searchState} onValueChange={handleStateChange} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Estados</SelectItem>
                {estados.map((est) => (
                  <SelectItem key={est.sigla} value={est.nome}>
                    {est.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto min-w-[150px]">
            <Select value={searchCity} onValueChange={setSearchCity} disabled={isLoading || searchState === "todos"}>
              <SelectTrigger>
                <SelectValue placeholder={fetchCitiesLoading ? "Carregando..." : "Município"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Municípios</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.nome}>
                    {city.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* {userRole === "municipalmanager" && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700">
            <strong>Nota:</strong> Como gestor municipal, você só pode
            visualizar e editar usuários do seu município ({user?.city}).
          </p>
        </div>
      )} */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Município</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">
                    {usuario.fullName}
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{getTranslatedRole(usuario.roles?.[0])}</TableCell>
                  <TableCell>
                    {usuario.city === "Todos" ? "" : usuario.city}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        usuario.status?.toLowerCase() === "ativo"
                          ? "default"
                          : "outline"
                      }
                      className={
                        usuario.status?.toLowerCase() === "ativo"
                          ? "bg-green-500"
                          : ""
                      }
                    >
                      {usuario.status?.toLowerCase() === "ativo"
                        ? "Ativo"
                        : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{usuario.localLastLogin || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href="#"
                            onClick={() => handleEditarUsuario(usuario)}
                            className="flex items-center"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        {usuario.id !== user?.id && (
                          <DropdownMenuItem asChild>
                            <Link
                              href="#"
                              onClick={() => handleResetarSenha(usuario)}
                              className="flex items-center"
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Resetar Senha
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {usuario.id !== user?.id && userRole === "admin" && (
                          <DropdownMenuItem
                            onClick={() => handleRemove(usuario)}
                            className="flex items-center"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {getPageNumbers(totalPages, currentPage).map((page, i) => (
              <PaginationItem key={i}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page as number)}
                    href="#"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {!isLoading && (
        <div>
          <CadastroUsuarioModal
            open={cadastroUsuarioModalOpen}
            onOpenChange={setCadastroUsuarioModalOpen}
            onSave={handleSubmit}
            formData={formData}
            setFormData={setFormData}
          />
          <EditarUsuarioModal
            open={editarUsuarioModalOpen}
            onOpenChange={setEditarUsuarioModalOpen}
            onSave={handleEditarSubmit}
            formData={editarFormData}
            setFormData={setEditarFormData}
          />
          <ResetarSenhaModal
            open={resetarSenhaModalOpen}
            onOpenChange={setResetarSenhaModalOpen}
            onSave={handleResetarSenhaSubmit}
            formData={resetarSenhaFormData}
            setFormData={setResetarSenhaFormData}
          />
          <ImportacaoResultadoModal
            open={importResultModalOpen}
            onOpenChange={setImportResultModalOpen}
            result={lastImportResult}
            onDownloadFailedRows={handleDownloadFailedRows}
          />
        </div>
      )}

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <p>Tem certeza que deseja remover este usuário?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
