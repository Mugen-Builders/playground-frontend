import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'
import '@fontsource-variable/inter';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}){
  return (
    <html lang='en'>
      <body>
        {children}
      </body>
    </html>
  )
}