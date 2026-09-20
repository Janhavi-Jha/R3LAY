import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "R3LAY – Smart Train Seat Management System",
  description: "Rethink. Reallocate. Ride. – AI-powered dynamic seat allocation and TTE management platform for Indian Railways.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-900">
      <body className="h-full bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
