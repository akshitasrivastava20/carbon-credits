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

  const baseClasses = "px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 cursor-pointer touch-manipulation inline-block text-center no-underline relative z-10 border-0";
  
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white hover:bg-gray-50 text-black border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    console.log('Button clicked:', href || 'onClick handler');
    
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
    // For href, let the Link handle the navigation naturally
  };

  // Use Link for href, button for onClick
  if (href) {
    return (
      <Link 
        href={href}
        className={buttonClasses}
        onClick={handleClick}
        style={{ pointerEvents: 'auto', zIndex: 100 }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={buttonClasses} 
      onClick={handleClick}
      style={{ pointerEvents: 'auto', zIndex: 100 }}
    >
      {children}
    </button>
  );
}
