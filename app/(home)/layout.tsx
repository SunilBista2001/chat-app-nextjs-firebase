"use client";

import ChatBar from "@/components/shared/ChatBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useUser";
import { useRouter } from "next/navigation";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        useAuth.setState({ user: user });
      } else {
        router.push("/login");
      }
    });
  }, []);

  return (
    <div className="h-screen p-[4rem] overflow-hidden bg-[#121317]">
      <div className="chat ">
        <ChatBar />
        <div className="chat__main">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
