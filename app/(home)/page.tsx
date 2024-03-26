export default function Home() {
  return (
    <div
      className="h-[85%] bg-[#191A1E] flex justify-center items-center rounded-xl"
      style={{ flex: 0.8 }}
    >
      <div className="space-y-1 text-center">
        <h1 className="text-2xl text-white font-bold">
          Welcome to the chat app 🚀
        </h1>
        <p className="text-gray-200 ">
          This is a simple chat app built with Next.js and Firebase. Feel free
          to explore the app and have fun chatting with your friends.🚀
        </p>
      </div>
    </div>
  );
}
