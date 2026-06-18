import type { Metadata } from "next";
import "./globals.scss";
import "leaflet/dist/leaflet.css";
import Providers from "./providers";
import ChatWidget from "@/components/Chatbot/ChatWidget";
// import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Se-IMaN - Sistem Informasi Masjid Nusantara",
  description:
    "Peta persebaran bangunan masjid dan formulir pengajuan bantuan masjid oleh Masjid Nusantara.",
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
        <Providers>
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}