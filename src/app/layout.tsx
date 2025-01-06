import "@xyflow/react/dist/style.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";


export const metadata: Metadata = {
  title: "FlowForge",
  description: "Intarective github workflow generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${GeistSans.className} antialiased`}>
        {/* <SidebarProvider defaultOpen={false}>
          <AppSidebar /> */}
        {children}
        {/* <CommandPalette /> */}
        {/* </SidebarProvider> */}
      </body>
    </html>
  );
}
