import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';
import { ClerkProvider } from '@clerk/nextjs';
import { ServerNavBar } from '@/components/ServerNavBar';

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
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Server-side Navigation Bar */}
          <ServerNavBar />
          
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
