'use client';

interface TagProps {
  label: string;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Tag({ label, variant = 'default', size = 'md', onClick }: TagProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    secondary: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
  };

  return (
    <span
      onClick={onClick}
      className={`
        inline-block rounded-full font-medium transition-colors
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {label}
    </span>
  );
}