export interface Notification {
  id: string;
  title: string;
  message: string;
  backgroundImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}