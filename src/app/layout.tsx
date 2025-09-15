import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientLayout from '@/components/ClientLayout';

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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {},
        elements: {}
      }}
      signInForceRedirectUrl="/register"
      signUpForceRedirectUrl="/register"
      signInFallbackRedirectUrl="/register"
      signUpFallbackRedirectUrl="/register"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en">
        <body className={inter.className}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
