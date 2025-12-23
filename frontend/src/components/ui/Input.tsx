interface InputProps {
  type: 'email' | 'password' | 'text';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export function Input({ type, label, value, onChange, placeholder, required }: InputProps) {
  return (
    <div>
      <label className="block mb-2 text-gray-600 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}
