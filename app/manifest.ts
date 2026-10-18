import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Codevas — Interactive UI Learning Engine",
    short_name: "Codevas",
    description:
      "Belajar Coding Jadi Semenyenangkan Bermain Game. Selesaikan quest interaktif, raih XP, dan pertahankan streak harianmu!",
    start_url: "/dashboard",
    id: "/dashboard",
    display: "standalone",
    display_override: ["standalone", "window-controls-overlay", "minimal-ui"],
    orientation: "portrait",
    background_color: "#fef7ff",
    theme_color: "#e040a0",
    lang: "id",
    dir: "ltr",
    categories: ["education", "developer tools", "games"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard Belajar",
        short_name: "Dashboard",
        description: "Buka dashboard progres dan quest harianmu",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Katalog Silabus",
        short_name: "Silabus",
        description: "Daftar seluruh kurikulum dan kelas coding",
        url: "/classes",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
