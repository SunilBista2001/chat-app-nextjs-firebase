"use client";

import useAuth from "@/app/hooks/useUser";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ChatBody = () => {
  const currentUser = useAuth();
  const { id: chatId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any>([]);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      setMessages(doc.data()?.messages);
    });

    return () => unsub();
  }, [chatId]);

  // useEffect(() => {
  //   // 👇️ scroll to bottom every time messages change
  //   lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  return (
    <>
      {/*This shows messages sent from you*/}
      <div className="message__container rounded-lg">
        {messages?.map((message: any, idx: any) =>
          // @ts-ignore
          message.senderId === currentUser?.user?.uid ? (
            <div className="message__chats" key={message.id}>
              {idx > 0 &&
              // @ts-ignore
              messages[idx - 1].senderId === currentUser?.user?.uid ? null : (
                <p className="sender__name text-white">You</p>
              )}
              <div className="message__sender rounded-t-2xl rounded-bl-2xl rounded-br-md text-sm max-w-xs ">
                <p className="break-words">{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              {idx > 0 &&
              // @ts-ignore
              messages[idx - 1].senderId !== currentUser?.user?.uid ? null : (
                <p className="text-white">Other</p>
              )}
              <div className="message__recipient rounded-t-2xl rounded-br-2xl rounded-bl-md text-sm max-w-xs">
                <p className="break-words">{message.text}</p>
              </div>
            </div>
          )
        )}

        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
