import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  user: {
    username?: string;
    email: string;
    avatar?: string;
  };
};

const useAuth = create((set) => ({
  user: null,
  chatUser: null,
  setUser: (data: User) => {
    set({ user: data?.user });
  },
  setChatUser: (data: any) => {
    set({ chatUser: data });
  },
  removeUser: () => {
    set({ user: null });
  },
}));

export default useAuth;
