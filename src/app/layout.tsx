"use client";

import "@xyflow/react/dist/style.css";
import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" title="FlowForge">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Intarective github workflow generator" />
      </Head>
      <body className={` ${GeistSans.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
