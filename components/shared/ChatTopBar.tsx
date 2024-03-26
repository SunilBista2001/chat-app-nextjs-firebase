"use client";

import useAuth from "@/app/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatUser = {
  chatUser: {
    displayName: string | null;
    photoURL: string | null;
  };
};

const ChatTopBar = () => {
  const user: ChatUser = useAuth() as ChatUser;

  return (
    <header className="chat__mainHeader rounded-lg">
      <div className="flex">
        <Avatar>
          <AvatarImage src={"user?.avatar"} alt={"user?.username"} />
          <AvatarFallback className="text-gray-700">
            {user?.chatUser?.displayName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h2 className="text-base font-semibold">
            {user?.chatUser?.displayName}
          </h2>
          <p className="text-gray-500 text-xs">Active Now</p>
        </div>
      </div>
    </header>
  );
};

export default ChatTopBar;
