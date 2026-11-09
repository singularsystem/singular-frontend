"use client";

import { useAlunoDetails } from "../../hooks/alunos/useAlunoDetails";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Eye,
  FileText,
  GraduationCap,
  Heart,
  MapPin,
  Paperclip,
  Plus,
  Trash2,
  Upload,
  User,
  Download
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getDocumentTypeLabel } from "../../../model/entities/alunos/AlunoEntity";
import { DetalhesEstudanteCard } from "../../components/alunos/DetalhesEstudanteCard";
import { useToast } from "@/hooks/use-toast";

interface AlunoDetailsScreenProps {
  id: string;
}

export function AlunoDetailsScreen({ id }: AlunoDetailsScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { state, uploadFiles, deleteAttachment, getDocumentUrl } = useAlunoDetails(id);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isAdmin = user?.roles?.some(r => r.toLowerCase() === "admin");
  const isSecretary = user?.roles?.some(r => r.toLowerCase() === "secretary");
  const canRemove = isAdmin || isSecretary;

  const handleOpenDocument = (docId: string, type: string) => {
    const route = getDocumentUrl(docId, type);
    if (route) {
      router.push(route);
    }
  };

  const handleUpload = async (files: FileList) => {
    try {
      await uploadFiles(files);
      toast({
        title: "Upload concluído",
        description: "Arquivo(s) anexado(s) com sucesso.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível enviar o(s) arquivo(s).",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment(attachmentId);
      toast({
        title: "Anexo excluído",
        description: "O arquivo foi removido com sucesso.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: error instanceof Error ? error.message : "Não foi possível remover o arquivo.",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleUpload(e.dataTransfer.files);
  };


  if (state.isLoading && !state.aluno) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
          <Button variant="outline" onClick={() => router.push("/alunos")}>
            Voltar
          </Button>
        </div>
      </main>
    );
  }

  if (!state.aluno) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Aluno não encontrado</h1>
          <Button variant="outline" onClick={() => router.push("/alunos")}>
            Voltar
          </Button>
        </div>
      </main>
    );
  }

  const { aluno } = state;

  return (
    <main className="flex-1 p-8 space-y-8 bg-slate-50/50">
      {/* Card de Perfil Desacoplado com botão de voltar integrado */}
      <DetalhesEstudanteCard
        aluno={aluno}
        onBack={() => router.push("/alunos")}
        onEdit={() => router.push(`/alunos/${id}/editar`)}
        canEdit={canRemove}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Informações Pessoais */}
          <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <User className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Informações Pessoais</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-16">
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Data de Nascimento
                </span>
                <p className="text-slate-800 font-semibold text-sm md:text-base leading-relaxed">
                  {aluno.formattedDateOfBirth || aluno.dataNascimento}
                </p>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Sexo
                </span>
                <p className="text-slate-800 font-semibold text-sm md:text-base leading-relaxed">
                  {aluno.sex}
                </p>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Escola
                </span>
                <p className="text-slate-800 font-semibold text-sm md:text-base leading-relaxed">
                  {aluno.schoolName}
                </p>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Endereço
                </span>
                <p className="text-slate-800 font-semibold text-sm md:text-base uppercase leading-relaxed">
                  {aluno.address}
                </p>
              </div>
            </div>
          </div>

          {/* Responsável */}
          {aluno.nameOfPersonResponsible && (
            <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <Heart className="w-5 h-5 text-pink-500 shrink-0" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Responsável</h2>
              </div>
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Nome do Responsável
                </span>
                <p className="text-slate-800 font-semibold text-sm md:text-base uppercase leading-relaxed">
                  {aluno.nameOfPersonResponsible}
                </p>
              </div>
            </div>
          )}

          {/* Histórico Segmentado */}
          <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm overflow-hidden">
            <div
              className="flex items-center justify-between hover:cursor-pointer group"
              onClick={() => setMostrarHistorico(!mostrarHistorico)}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Histórico</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider h-9 px-3 rounded-lg"
              >
                {mostrarHistorico ? "Recolher" : "Expandir"}
              </Button>
            </div>

            {mostrarHistorico && (
              <div className="space-y-6 pt-6 mt-6 border-t border-slate-100/70 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Relatórios Biopsicossociais e Documentos
                  </h3>
                  <div className="space-y-3">
                    {state.documents.length > 0 ? (
                      state.documents.map(doc => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50/60 hover:border-slate-200 transition-all duration-200 group/item"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100/80 group-hover/item:text-indigo-600">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800 group-hover/item:text-indigo-900 transition-colors text-sm">
                                {getDocumentTypeLabel(doc.documentType || doc.type)}
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">{doc.localCreatedAt || new Date(doc.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg h-9 w-9"
                            onClick={() => handleOpenDocument(doc.id, doc.documentType || doc.type)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/80">
                        <FileText className="w-9 h-9 text-slate-300 mb-3" />
                        <p className="text-sm text-slate-400 font-semibold">Nenhum documento encontrado.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar de Anexos */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Paperclip className="w-5 h-5 text-purple-600 shrink-0" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Anexos e Documentos</h2>
            </div>

            <div
              className={`border border-dashed rounded-2xl p-8 mb-6 transition-all duration-200 ${dragOver
                  ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
                  : "border-slate-200 bg-slate-50/10 hover:border-slate-300"
                }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="text-center flex flex-col items-center">
                <Upload className="w-9 h-9 text-slate-400 mb-3" />
                <p className="text-xs font-bold text-slate-700 leading-normal">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-[10px] text-slate-400 mt-1 mb-5 leading-normal">
                  Suporta: PDF, DOC, DOCX, JPG, PNG, etc. (máx. 10MB)
                </p>

                <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-black text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-100">
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  SELECIONAR ARQUIVOS
                  <input type="file" multiple className="hidden" onChange={handleFileInput} />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              {state.attachments.length > 0 ? (
                state.attachments.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/80 transition-colors group/att">
                    <div className="min-w-0 flex-1 flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-xl group-hover/att:bg-white transition-colors">
                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate text-xs">{att.fileName || att.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{att.localCreatedAt || new Date(att.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-40 group-hover/att:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-indigo-600 rounded-lg"
                        onClick={() => window.open(att.url, "_blank")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <a href={att.url} download={att.fileName || att.name} className="p-2 text-slate-500 hover:text-green-600 rounded-lg hover:bg-white transition-colors">
                        <Download className="w-4 h-4" />
                      </a>
                      {canRemove && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-600 rounded-lg"
                          onClick={() => handleDeleteAttachment(att.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum documento anexado ainda</p>
                  <p className="text-[10.5px] text-slate-400/80 mt-1 leading-normal">Faça upload de documentos importantes do aluno</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
