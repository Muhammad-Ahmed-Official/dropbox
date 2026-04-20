'use client';

import { HeroUIProvider } from "@heroui/react";
import { UserProvider } from "@/contextApi/UserProvider";
import Providers from "./providers";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <Providers>
        <UserProvider>{children}</UserProvider>
      </Providers>
    </HeroUIProvider>
  );
}
