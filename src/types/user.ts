export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
  message: string;
  success: boolean;
}