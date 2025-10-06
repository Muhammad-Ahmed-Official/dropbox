import { ReactNode } from "react"
import type { ThemeProviderProps } from "next-themes"
import { ImageKitProvider } from "@imagekit/next"
import { Toaster } from "react-hot-toast";
import {HeroUIProvider} from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";

// remove upload-imagekit authauth
export interface ProviderProps {
    children: ReactNode,
    themeProp?: ThemeProviderProps,
}

const urlEndPoints = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export default function Providers({children, themeProp}:ProviderProps) {
  return (
    <ImageKitProvider urlEndpoint={urlEndPoints}>
      <HeroUIProvider>
        {/* <NextThemesProvider attribute="class" defaultTheme="dark"> */}
          {children}
          <Toaster />
        {/* </NextThemesProvider> */}
      </HeroUIProvider>
    </ImageKitProvider>
  )
}