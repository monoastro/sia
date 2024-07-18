import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import { SpeedInsights } from '@vercel/speed-insights/next';


const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIA",
  description: "Social Interaction Application",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>)
{
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
	  	{children}
		<SpeedInsights />
	  </body>
    </html>
  );
}

/*
 * meh mid themes
 

import { ThemeProvider } from "@/components/providers/theme-provider";
	  <ThemeProvider
	  	attribute="class"
		defaultTheme="dark"
		forcedTheme="dark"
		enableSystem={false}
		storageKey="sia-theme">
	  </ThemeProvider>
*/
