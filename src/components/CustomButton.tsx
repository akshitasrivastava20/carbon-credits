"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CustomButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function CustomButton({ 
  href, 
  onClick, 
  children, 
  variant = 'primary',
  className = ''
}: CustomButtonProps) {
  const router = useRouter();

  const baseClasses = "px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 cursor-pointer touch-manipulation inline-block text-center no-underline";
  
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white hover:bg-gray-50 text-black border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  if (href) {
    return (
      <Link href={href} className={buttonClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={handleClick}>
      {children}
    </button>
  );
}
