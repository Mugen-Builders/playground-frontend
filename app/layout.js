import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}){
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}