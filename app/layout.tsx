import type { Metadata } from "next";
import "./globals.css";
import {cn} from "@/lib/utils";
import { Open_Sans } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';

const font = Open_Sans({ subsets: ["latin"] });
export const metadata: Metadata =
{
  title: "SIA",
  description: "Social Interaction Application",
};


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>)
{
	return (
		<html lang="en" suppressHydrationWarning>
		<body className="blue-gradient ${font.className}">
		{children}
		<SpeedInsights />
		</body>
		</html>
	);
}
