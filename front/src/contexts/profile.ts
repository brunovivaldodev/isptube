import { api } from "@/lib/api";

export interface Midea {
  id: string;
  name: string;
  authors?: string;
  album?: string;
  music_group?: string;
  description?: string;
  genre?: string;
  release_date?: string;
  type: string;
  visibility: string;
  cover_url?: string;
  url: string;
  user_id: string;
  created_at: string;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  description?: string;
  midea: Midea[];
}

export class ProfileContext {
  static user: User;
  static async getMideas(userId: string) {
    ProfileContext.user = (await api.get(`/users/${userId}`)).data.users;
  }

  static async deleteMideas(userId: string, id: string) {
    (await api.delete(`/mideas/${id}`)).data;
    await this.getMideas(userId);
  }
}