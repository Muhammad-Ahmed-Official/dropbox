'use client';

import { UserProvider } from "@/contextApi/UserProvider";
import Providers from "./providers";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <UserProvider>{children}</UserProvider>
    </Providers>
  );
}
