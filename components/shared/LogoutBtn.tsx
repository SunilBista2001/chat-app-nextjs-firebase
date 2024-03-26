"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import useAuth from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      useAuth.setState({ user: null });
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/login");
    }
  };
  return (
    <Button className="hover:bg-primary/5 bg-transparent text-white ">
      <LogOut size={24} className="cursor-pointer" onClick={handleLogout} />
    </Button>
  );
};

export default LogoutBtn;
