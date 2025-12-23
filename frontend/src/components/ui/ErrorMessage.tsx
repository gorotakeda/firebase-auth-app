export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-5 text-center">
      {message}
    </div>
  );
}
