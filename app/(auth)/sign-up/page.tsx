"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth, db, storage } from "@/firebase";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useAuth from "@/app/hooks/useUser";
import { Loader2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";

export default function page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, username);

      const uploadTask = uploadBytesResumable(storageRef, avatar!);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error(error);
        },
        async () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateProfile(data.user, {
              displayName: username,
              photoURL: downloadURL,
            });
          });
          await setDoc(doc(db, "users", data.user.uid), {
            uid: data.user.uid,
            email,
            displayName: username,
            photoURL: data?.user?.photoURL,
          });
        }
      );

      await setDoc(doc(db, "userChats", data.user.uid), {});

      useAuth.setState({ user: data.user });
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  return (
    <form
      className="space-y-4 shadow-md max-w-sm rounded-md p-4 bg-gray-100"
      onSubmit={handleSignUp}
    >
      <h1 className="text-2xl font-bold">Create your account</h1>
      <Input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
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
      <Input
        type="file"
        onChange={(e) =>
          // @ts-ignore
          setAvatar(e.target.files[0])
        }
        accept="image/*"
      />
      <Button type="submit" className="w-full">
        {loading ? <Loader2 className="animate-spin" size={16} /> : `Sign up`}
      </Button>
      <div className="flex items-center text-sm">
        Already have an account?
        <Link className="ml-1 text-blue-500 hover:underline" href={"/login"}>
          Login
        </Link>
      </div>
    </form>
  );
}
