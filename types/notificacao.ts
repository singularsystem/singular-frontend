export interface Notification {
  id: string;
  userID: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionURL?: string;
}

export type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};
