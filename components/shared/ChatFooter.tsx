"use client";

import useAuth from "@/app/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Loader2, SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

type User = {
  user: {
    uid: string | null;
    photoURL: string | null;
    email: string | null;
    displayName: string | null;
  };
};

const ChatFooter = () => {
  const data = useAuth();
  const currentUser: User = useAuth() as User;
  const { id: chatId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id: Math.random().toString(36).substr(2, 9),
          // @ts-ignore
          senderId: currentUser?.user?.uid,
          timestamp: Timestamp.now(),
          text: message,
        }),
      });

      await updateDoc(doc(db, "userChats", currentUser?.user?.uid!), {
        [chatId + ".lastMessage"]: {
          text: message,
          timestamp: Timestamp.now(),
        },
      });

      // @ts-ignore
      await updateDoc(doc(db, "userChats", data?.uid), {
        [chatId + ".lastMessage"]: {
          text: message,
          senderId: currentUser?.user?.uid,
          timestamp: Timestamp.now(),
        },
      });
    } catch (error) {
      console.error("Error sending message =>", error);
    } finally {
      setMessage("");
      setIsLoading(false);
    }
  };

  return (
    <div className="chat__footer rounded-lg">
      <form className="form space-x-2" onSubmit={sendMessage}>
        <Input
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" variant={"secondary"}>
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <SendHorizonal size={24} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatFooter;
