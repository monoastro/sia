import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata =
{
  title: "SIA",
  description: "Social Interaction Application",
};


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>)
{
	return (
		<html lang="en" >
		<body className="blue-gradient" suppressHydrationWarning={true}>
		{children}
		<SpeedInsights />
		</body>
		</html>
	);
}
