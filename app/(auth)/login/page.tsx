"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useUser";
import { Loader2 } from "lucide-react";

export default function page() {
  const user = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const hangleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);

      // @ts-ignore
      user.setUser({ user: data.user });
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-4 shadow-md max-w-sm rounded-md p-4 bg-gray-100"
      onSubmit={hangleLogin}
    >
      <h1 className="text-2xl font-bold">Login to your account</h1>
      <Input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <Button className="w-full" type="submit">
        {" "}
        {loading ? <Loader2 className="animate-spin" size={16} /> : `Login`}
      </Button>
      <div className="flex items-center text-sm">
        New to us?{" "}
        <Link className="ml-1 text-blue-500 hover:underline" href={"/sign-up"}>
          Sign Up
        </Link>
      </div>
    </form>
  );
}
