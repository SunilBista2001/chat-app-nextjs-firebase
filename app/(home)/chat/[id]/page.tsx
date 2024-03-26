import ChatBody from "@/components/shared/ChatBody";
import ChatFooter from "@/components/shared/ChatFooter";
import ChatTopBar from "@/components/shared/ChatTopBar";

const page = async ({ params }: { params: { id: string } }) => {
  return (
    <>
      <ChatTopBar />
      <ChatBody />
      <ChatFooter />
    </>
  );
};

export default page;
