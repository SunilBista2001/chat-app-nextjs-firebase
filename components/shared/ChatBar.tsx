import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      const q = query(collection(db, "users"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setUsers((prev: any) => [...prev, doc.data()]);
      });
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

      console.log("chatExits", !chatExits === false);

      if (!chatExits) {
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
        <h4 className="chat__header">All</h4>
        {isLoading && <Loader2 size={32} className="animate-spin" />}
        {users
          ?.filter((doc: any) => doc.uid !== currentUser?.user?.uid)
          ?.map((user: any) => (
            <div key={user.uid} className="chat__users">
              <div
                className="flex space-x-2 cursor-pointer text-white hover:bg-white p-1 hover:text-black rounded-b-lg rounded-tr-lg"
                onClick={() => startChat(user)}
              >
                <Avatar className="text-black">
                  <AvatarImage src={"Sunil Bista"} />
                  <AvatarFallback>{user.displayName}</AvatarFallback>
                </Avatar>
                <div className="">
                  <span>{user.displayName}</span>
                  <p className="text-gray-500 text-xs">Active Now</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatBar;
