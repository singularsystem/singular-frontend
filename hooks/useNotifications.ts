"use client";
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

export const useNotifications = (accessToken: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/api/hub/notifications`, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    connection.start().catch(console.error);

    return () => {
      connection.stop();
    };
  }, [accessToken]);

  return { notifications };
};
