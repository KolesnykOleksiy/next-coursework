import "./globals.css";
import React from "react";
import Header from "@/components/header/Header";
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body

        >
        <Header></Header>
        {children}
        </body>
        </html>
    );
}

