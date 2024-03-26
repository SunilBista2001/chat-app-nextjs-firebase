"use client";

import useAuth from "@/app/hooks/useUser";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ChatBody = () => {
  const currentUser = useAuth();
  const { id: chatId } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      setMessages(doc.data()?.messages);
    });

    return () => unsub();
  }, [chatId]);

  return (
    <>
      {/*This shows messages sent from you*/}
      <div className="message__container rounded-lg">
        {messages
          // @ts-ignore
          ?.filter((user: any) => user.sender === currentUser?.user?.uid)
          .map((message: any, idx: any) => {
            const isPreviousSenderSame =
              // @ts-ignore
              messages[idx - 1]?.sender === currentUser?.user?.uid;
            return (
              <div className="message__chats" key={idx}>
                {!isPreviousSenderSame && (
                  <p className="sender__name text-white">You</p>
                )}
                <div className="message__sender rounded-t-2xl rounded-bl-2xl rounded-br-md text-sm ">
                  {/* @ts-ignore */}
                  <p>{message?.message}</p>
                </div>
              </div>
            );
          })}

        {/*This shows messages received by you*/}
        {messages
          // @ts-ignore
          ?.filter((user: any) => user.sender !== currentUser?.user?.uid)
          .map((message: any, idx: any) => (
            <div key={idx} className="message__chats">
              <p className="text-white">Other</p>
              <div className="message__recipient rounded-t-2xl rounded-br-2xl rounded-bl-md text-sm">
                <p>{message?.message}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ChatBody;
