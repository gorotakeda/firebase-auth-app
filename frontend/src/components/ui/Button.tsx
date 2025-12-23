interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'logout';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled
}: ButtonProps) {
  const baseClasses = 'w-full py-3.5 px-4 rounded-lg font-semibold transition-all duration-200 cursor-pointer';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    logout: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
