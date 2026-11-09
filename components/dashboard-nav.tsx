"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { isAdmin } from "@/source/infrastructure/common/config/roles";
import {
  BookMarked,
  BookOpen,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  ListChecks,
  LogOut,
  School,
  User,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SidebarNavItem } from "./sidebar-nav-item";
import { toast } from "./ui/use-toast";

interface DashboardNavProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function DashboardNav({ isCollapsed, onToggle }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCollapsed) setOpenPopupId(null);
  }, [isCollapsed]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpenPopupId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNavItems = () => {
    const items = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        roles: [
          "admin",
          "secretary",
          "socialwork",
          "psychologist",
          "psychopedagogue",
          "teacher",
          "coordinator",
          "principal",
          "municipalmanager",
        ],
        active: true,
      },
      {
        title: "Escolas",
        href: "/escolas",
        icon: School,
        roles: [
          "admin",
          "principal",
          "secretary",
          "coordinator",
          "municipalmanager",
          "teacher",
        ],
      },
      {
        title: "Alunos",
        href: "/alunos",
        icon: Users,
        roles: [
          "admin",
          "principal",
          "secretary",
          "coordinator",
          "municipalmanager",
          "socialwork",
          "psychologist",
          "psychopedagogue",
          "teacher",
        ],
      },
      {
        title: "Professor Regular",
        href: "",
        icon: GraduationCap,
        roles: [
          "admin",
          "socialwork",
          "psychologist",
          "psychopedagogue",
          "teacher",
          "principal",
          "municipalmanager",
          "coordinator",
        ],
        children: [
          {
            title: "Questionário",
            href: "/professor-questionario",
            icon: ListChecks,
          },
          {
            title: "Triagem",
            href: "/professor-triagem",
            icon: ClipboardList,
          },
          {
            title: "Estudo de Caso",
            href: "/professor-avaliacao",
            icon: ClipboardCheck,
          },
          {
            title: "Livro Didático",
            href: "/livros/gerar",
            icon: BookOpen,
          },
        ],
      },
      {
        title: "Relatórios Biopsicossociais",
        href: "/relatorios",
        icon: FileText,
        roles: [
          "admin",
          "socialwork",
          "psychologist",
          "psychopedagogue",
          "teacher",
          "principal",
          "municipalmanager",
          "coordinator",
        ],
      },
      {
        title: "PAEE",
        href: "/paee",
        icon: BookOpen,
        roles: [
          "admin",
          "teacher",
          "coordinator",
          "principal",
          "municipalmanager",
        ],
      },
      {
        title: "PEI",
        href: "/pei",
        icon: BookMarked,
        roles: [
          "admin",
          "teacher",
          "coordinator",
          "principal",
          "municipalmanager",
        ],
      },

      {
        title: "Relatório Final AEE",
        href: "/relatorio-aee",
        icon: FileCheck,
        roles: [
          "coordinator",
          "secretary",
          "principal",
          "municipalmanager",
          "admin",
        ],
      },
      {
        title: "Acomp. Estudos de Caso",
        href: "/acompanhamento-estudos-caso",
        icon: ClipboardList,
        roles: ["secretary", "admin"],
      },
      {
        title: "Acomp. Biopsicossocial",
        href: "/acompanhamento-biopsicossocial",
        icon: FileText,
        roles: ["secretary", "admin"],
      },
      {
        title: "Usuários",
        href: "/usuarios",
        icon: User,
        roles: ["admin"],
      },
      {
        title: "Central de Ajuda",
        href: "/ajuda",
        icon: HelpCircle,
        roles: [
          "admin",
          "secretary",
          "socialwork",
          "psychologist",
          "psychopedagogue",
          "teacher",
          "coordinator",
          "principal",
          "municipalmanager",
        ],
      },
    ];

    if (!user?.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
      return [];
    }

    const userRoles = user.roles.map((r) => r.toLowerCase());

    const filteredItems = items
      .filter((item) => item.roles.some((role) => userRoles.includes(role)))
      .map((item) => {
        if (item.title === "Professor Regular" && item.children) {
          const isAdminOrTeacher =
            userRoles.includes("admin") || userRoles.includes("teacher");

          return {
            ...item,
            children: isAdminOrTeacher
              ? item.children
              : item.children.filter(
                  (child) => child.title === "Estudo de Caso",
                ),
          };
        }

        return item;
      });

    if (isAdmin(user.roles)) {
      const neckbookItem = {
        title: "Neckbook",
        href: "/admin/neckbook-cotas",
        icon: Building2,
        roles: [],
      };
      const helpIndex = filteredItems.findIndex(
        (item) => item.href === "/ajuda" || item.title === "Central de Ajuda",
      );
      if (helpIndex !== -1) {
        filteredItems.splice(helpIndex, 0, neckbookItem);
      } else {
        filteredItems.push(neckbookItem);
      }
    }

    return filteredItems;
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    try {
      await logout();

      toast({
        title: "Logout realizado com sucesso",
        variant: "success",
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível realizar o logout.",
      });
    }
  };

  return (
    <div
      className={cn(
        "bg-[#111C4E] text-white flex flex-col relative flex-shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-80",
      )}
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-col items-center justify-between">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-600 self-end"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 relative">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.title}
            item={item}
            isCollapsed={isCollapsed}
            pathname={pathname}
            isOpen={openPopupId === item.title}
            setIsOpen={(open) => setOpenPopupId(open ? item.title : null)}
            popupRef={popupRef}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors duration-600 group"
        >
          <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400" />
          {!isCollapsed && (
            <span className="font-medium text-gray-300 group-hover:text-red-400">
              Sair
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
