'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "@/contextApi/UserProvider";
import Providers from "./providers";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Providers>
        <UserProvider>{children}</UserProvider>
      </Providers>
    </ClerkProvider>
  );
}