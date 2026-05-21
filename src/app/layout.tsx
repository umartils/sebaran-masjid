import type { Metadata } from "next";
import "./globals.scss";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "MasjidCare",
  description: "Peta persebaran bangunan masjid dan formulir pendataan.",
  icons: {
    icon: "/assets/cropped-logo-masjid-nusantara.png", // ambil dari public
    shortcut: "/assets/cropped-logo-masjid-nusantara.png",
    apple: "/assets/cropped-logo-masjid-nusantara.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

