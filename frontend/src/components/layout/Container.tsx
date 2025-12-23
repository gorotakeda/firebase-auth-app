export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
      {children}
    </div>
  );
}
