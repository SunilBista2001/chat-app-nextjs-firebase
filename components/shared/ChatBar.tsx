import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutBtn from "./LogoutBtn";
import useAuth from "@/app/hooks/useUser";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import Search from "./Search";

interface User {
  user: {
    uid: string | null;
    photoURL: string | null;
    email: string | null;
    displayName: string | null;
  };
}

const ChatBar = () => {
  const currentUser: User = useAuth() as User;
  const [users, setUsers] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const getUsers = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.user?.uid!),
        (doc) => {
          setUsers(doc.data());
        }
      );

      return () => unsub();
    };

    currentUser?.user?.uid && getUsers();
  }, [currentUser?.user?.uid]);

  const startChat = async (data: any) => {
    const combinedId =
      currentUser?.user?.uid! > data?.uid
        ? currentUser?.user?.uid + data?.uid
        : data?.uid + currentUser?.user?.uid;

    try {
      const chatExits = await getDocs(
        collection(db, "chats", `chats/${combinedId}`)
      );

      if (chatExits.docs.length !== 0) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
          timestamp: Timestamp.now(),
        });

        await updateDoc(doc(db, "userChats", currentUser?.user?.uid!), {
          [combinedId + ".userInfo"]: {
            uid: data.uid,
            displayName: data.displayName,
            photoURL: data.photoURL,
          },
          [combinedId + ".timestamp"]: Timestamp.now(),
        });

        await updateDoc(doc(db, "userChats", data?.uid!), {
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
      useAuth.setState({ chatUser: data });
      router.push(`/chat/${combinedId}`);
    }
  };

  return (
    <div className="chat__sidebar rounded-lg bg-gray-400">
      <div className="flex justify-between">
        <Avatar>
          <AvatarImage
            src={currentUser?.user?.photoURL!}
            alt={currentUser?.user?.displayName!}
          />
          <AvatarFallback className="text-gray-700">
            {currentUser?.user?.displayName}
          </AvatarFallback>
        </Avatar>

        <LogoutBtn />
      </div>

      <div>
        <h4 className="mt-4 mb-2">All</h4>
        <Search />

        {Object.entries(users)?.map((user: any, idx: any) => (
          <div key={idx} className="chat__users">
            <div
              className="flex space-x-2 cursor-pointer text-white hover:bg-white p-1 hover:text-black rounded-b-lg rounded-tr-lg"
              onClick={() => startChat(user[1]?.userInfo)}
            >
              <Avatar className="text-black">
                <AvatarImage src={user[1]?.userInfo?.photoURL} />
                <AvatarFallback>
                  {user[1]?.userInfo?.displayName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <span>{user[1]?.userInfo?.displayName}</span>
                <p className="text-gray-500 text-xs">
                  {user[1]?.lastMessage
                    ? // @ts-ignore
                      user[1]?.lastMessage?.senderId === currentUser?.user?.id!
                      ? `You: ${user[1]?.lastMessage?.text}`
                      : `${user[1]?.lastMessage?.text}`
                    : "Say Hello"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBar;
