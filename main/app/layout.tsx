import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { fontPlay } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html suppressHydrationWarning lang="en" className={`${fontPlay.variable} overflow-hidden`} >
      <head>
        <link rel="icon" href="favicon.ico" type="image/x-icon"></link>
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background antialiased",
          fontPlay.variable,
        )}
      >
        
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <main className="container px-3 pt-6 flex-grow">
              {children}
            </main>
            

          </div>
        </Providers>
      </body>
    </html>
  );
}
