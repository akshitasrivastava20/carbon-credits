import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';
import { ClerkProvider } from '@clerk/nextjs';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Home as HomeIcon, Info, CreditCard, Building2, Leaf } from 'lucide-react';

const inter=Inter ({subsets:["latin"]});


export const metadata: Metadata = {
  title: "Carbon Credits - Your Sustainability Platform",
  description: "Track, offset, and invest in verified carbon projects to achieve your sustainability goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { name: "Home", url: "/", icon: HomeIcon },
    { name: "About", url: "/about", icon: Info },
    { name: "Projects", url: "/projects", icon: Leaf },
    { name: "Credits", url: "/credits", icon: CreditCard },
    { name: "Register", url: "/register", icon: Building2 },
  ];

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Navigation Bar - Available on all pages */}
          <NavBar items={navItems} />
          
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
