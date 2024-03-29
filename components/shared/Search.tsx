"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuth from "@/app/hooks/useUser";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

type User = {
  user: {
    uid: string | null;
    photoURL: string | null;
    email: string | null;
    displayName: string | null;
  };
};

export default function Search() {
  const currentUser: User = useAuth() as User;
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      console.log("Error getting documents: ", err);
    }
  };

  const handleKey = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    console.log("selected");
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser?.user?.uid! > user.uid
        ? currentUser?.user?.uid! + user.uid
        : user.uid + currentUser?.user?.uid!;
    try {
      const chatExits = await getDocs(
        collection(db, "chats", `chats/${combinedId}`)
      );

      console.log("chatExits", chatExits.docs.length);

      if (chatExits.docs.length === 0) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
          timestamp: Timestamp.now(),
        });

        await updateDoc(doc(db, "userChats", currentUser?.user?.uid!), {
          [combinedId + ".userInfo"]: {
            uid: user?.uid,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
          },
          [combinedId + ".timestamp"]: Timestamp.now(),
        });

        await updateDoc(doc(db, "userChats", user?.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser?.user?.uid,
            displayName: currentUser?.user?.displayName,
            photoURL: currentUser?.user?.photoURL,
          },
          [combinedId + ".timestamp"]: Timestamp.now(),
        });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      useAuth.setState({ chatUser: user });
      router.push(`/chat/${combinedId}`);
      setUser(null);
      setUsername("");
    }
  };

  return (
    <>
      <div className="searchForm">
        <Input
          placeholder="Search your friends"
          className="bg-transparent my-4 focus:ring-0 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      {user && (
        <div
          className="flex items-center gap-x-2 cursor-pointer mb-4"
          onClick={handleSelect}
        >
          <Avatar className="text-black">
            <AvatarImage src={user?.photoURL!} alt={user?.displayName!} />
            <AvatarFallback>
              {user?.displayName?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </>
  );
}
