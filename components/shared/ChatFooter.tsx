"use client";

import useAuth from "@/app/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Loader2, SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const ChatFooter = () => {
  const currentUser = useAuth();
  const { id: chatId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          // @ts-ignore
          sender: currentUser?.user?.uid,
          message,
          timestamp: Timestamp.now(),
        }),
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
        {/* <Button variant={"secondary"}>
          <File size={24} />
        </Button> */}
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
