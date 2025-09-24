import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Play as FontPlay,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontPlay = FontPlay({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-play",
});
