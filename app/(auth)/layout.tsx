function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-t from-pink-300 to-gray-300">
      {children}
    </div>
  );
}

export default AuthLayout;
