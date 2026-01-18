import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontPlay.variable} overflow-hidden`}
      lang="en"
    >
      <head>
        <link href="favicon.ico" rel="icon" type="image/x-icon" />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background antialiased",
          fontPlay.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen overflow-y-scroll overflow-x-hidden">
            <main className="container pt-6 flex-grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
