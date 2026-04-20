import { ReactNode } from "react"
import type { ThemeProviderProps } from "next-themes"
import { ImageKitProvider } from "@imagekit/next"
import { Toaster } from "react-hot-toast";

export interface ProviderProps {
    children: ReactNode,
    themeProp?: ThemeProviderProps,
}

const urlEndPoints = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export default function Providers({children, themeProp}:ProviderProps) {
  return (
    <ImageKitProvider urlEndpoint={urlEndPoints}>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 2000}} />
    </ImageKitProvider>
  )
}