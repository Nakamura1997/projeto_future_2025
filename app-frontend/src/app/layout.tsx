import "@/styles/globals.css";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = {
  title: "FS3M",
  description: "Descrição curta da sua página para SEO.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-brown-500 text-white">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
