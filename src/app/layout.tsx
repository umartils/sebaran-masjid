import type { Metadata } from "next";
import "./globals.scss";
import "leaflet/dist/leaflet.css";
import Providers from "./providers";
// import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "SEIMAN | YMN",
  description: "Peta persebaran bangunan masjid dan formulir pendataan.",
  icons: {
    icon: "/assets/cropped-logo-masjid-nusantara.png",
    shortcut: "/assets/cropped-logo-masjid-nusantara.png",
    apple: "/assets/cropped-logo-masjid-nusantara.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}