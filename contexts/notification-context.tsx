"use client";
export const dynamic = "force-dynamic";
import { Notification, NotificationContextType } from "@/types/notificacao";
import * as signalR from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/notifications/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar notificações");
        const result = await res.json();
        setNotifications(result.data);
        var data: Notification[] = result.data;
        setUnreadCount(data.filter((n) => !n.read).length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, [user?.id, token]);

  useEffect(() => {
    if (!user?.id || !token) return;

    let isMounted = true;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/api/hub/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification: Notification) => {
      if (!isMounted || notification.userID !== user.id) return;
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    connection
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      isMounted = false;
      connection.stop();
    };
  }, [user?.id, token]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${apiUrl}/api/v1/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Erro ao marcar como lida", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${apiUrl}/api/v1/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Erro ao marcar todas como lidas", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
