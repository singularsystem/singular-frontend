"use client";

import { AlunoEntity } from "../../../model/entities/alunos/AlunoEntity";
import { User, Calendar, GraduationCap, MapPin, ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetalhesEstudanteCardProps {
  aluno: AlunoEntity;
  onBack?: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function DetalhesEstudanteCard({ 
  aluno, 
  onBack, 
  onEdit, 
  canEdit = false 
}: DetalhesEstudanteCardProps) {
  
  // Calcula a idade dinâmica com base na data de nascimento
  const getAgeString = () => {
    if (aluno.age !== undefined && aluno.age !== null && aluno.age > 0) {
      return `${aluno.age} ${aluno.age === 1 ? 'ano' : 'anos'}`;
    }
    const dateStr = aluno.dataNascimento;
    if (!dateStr) return "";
    
    // Tratamento para formato ISO YYYY-MM-DD ou BR DD/MM/YYYY
    let birthDate: Date;
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      birthDate = new Date(dateStr);
    }
    
    if (isNaN(birthDate.getTime())) return "";
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ${age === 1 ? 'ano' : 'anos'}`;
  };

  const ageStr = getAgeString();

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 p-8 shadow-sm transition-all duration-200 hover:shadow-md/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 min-w-0">
          {onBack && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onBack}
              className="h-11 w-11 shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all duration-200 shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center shrink-0 shadow-inner">
            <User className="h-8 w-8 md:h-10 md:w-10 text-indigo-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase">
              {aluno.fullName}
            </h1>
            <div className="flex flex-wrap gap-y-3 gap-x-12 mt-4">
              {ageStr && (
                <div className="flex items-center text-xs md:text-sm text-slate-500 font-semibold tracking-wide">
                  <Calendar className="h-4.5 w-4.5 mr-2 text-indigo-500/80" />
                  {ageStr}
                </div>
              )}
              {aluno.serie && (
                <div className="flex items-center text-xs md:text-sm text-slate-500 font-semibold tracking-wide">
                  <GraduationCap className="h-4.5 w-4.5 mr-2 text-indigo-500/80" />
                  {aluno.serie}
                </div>
              )}
              {(aluno.city || aluno.cidade) && (
                <div className="flex items-center text-xs md:text-sm text-slate-500 font-semibold tracking-wide">
                  <MapPin className="h-4.5 w-4.5 mr-2 text-indigo-500/80" />
                  {aluno.city || aluno.cidade}
                </div>
              )}
            </div>
          </div>
        </div>

        {canEdit && onEdit && (
          <Button 
            onClick={onEdit} 
            variant="outline" 
            className="flex items-center gap-2 border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shrink-0 font-bold text-xs uppercase tracking-wider py-3 px-5 h-11 rounded-xl transition-all duration-200 shadow-sm hover:border-slate-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <Pencil className="h-4 w-4" />
            Editar Aluno
          </Button>
        )}
      </div>
    </div>
  );
}

