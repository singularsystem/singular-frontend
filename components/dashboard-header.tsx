"use client";

import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { toast } from "@/hooks/use-toast";
import { roleLabels } from "@/lib/constants";
import { Bell, ChevronDown, HelpCircle, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { user, logout } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const unreadNotifications = notifications.filter((n) => !n.read);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleNotifMenu = () => {
    setIsNotifMenuOpen(!isNotifMenuOpen);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setIsNotifMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false);
      await logout();

      toast({
        title: "Logout realizado com sucesso",
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
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-brand-navy" />
          </button> */}
        </div>

        <div className="flex items-center space-x-3">
          {/* Botão Central de Ajuda / FAQ */}
          <Link
            href="/ajuda"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-brand-navy flex items-center justify-center"
            title="Central de Ajuda / FAQ"
            aria-label="Central de Ajuda"
          >
            <HelpCircle className="w-5 h-5 text-brand-navy" />
          </Link>

          {/* Botão do sino */}
          <div className="relative">
            <button
              onClick={toggleNotifMenu}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5 text-brand-navy" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-brand-navy-light to-brand-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown de notificações */}
            {isNotifMenuOpen && (
              <div className="absolute -right-6 mt-2 w-80 max-h-96 overflow-auto bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-brand-navy">Notificações</h3>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:underline"
                      aria-label="Marcar todas como lidas"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
                {unreadNotifications.length === 0 && (
                  <p className="p-4 text-center text-gray-500 text-sm">
                    Nenhuma notificação
                  </p>
                )}
                <ul>
                  {unreadNotifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 cursor-pointer ${
                        notif.read ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                      onClick={() => markAsRead(notif.id)}
                      title="Clique para marcar como lida"
                    >
                      <p className="font-medium text-gray-800">{notif.title}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {notif.message}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Menu do usuário */}
          <div className="relative user-dropdown">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-brand-navy-light to-brand-orange rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>

              {user && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-brand-navy">
                    {user.userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.roles?.[0] ? roleLabels[user.roles[0]] : "N/A"}
                  </p>
                </div>
              )}

              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isUserMenuOpen && (
              <div
                className="
      absolute right-0 mt-2
      bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]
      border border-gray-100 py-2 z-50
      min-w-[14rem] max-w-sm
      px-4
    "
              >
                <div className="py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-brand-navy-light to-brand-orange rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="max-w-[calc(100%-3rem)] break-words">
                      <p className="text-sm font-medium text-brand-navy">
                        {user?.userName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    href="/perfil"
                    onClick={toggleUserMenu}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-brand-navy hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-brand-link" />
                    <span className="group-hover:text-brand-link">
                      Meu Perfil
                    </span>
                  </Link>

                  <Link
                    href="/ajuda"
                    onClick={toggleUserMenu}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-brand-navy hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-brand-link" />
                    <span className="group-hover:text-brand-link">
                      Central de Ajuda
                    </span>
                  </Link>

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
