import "@/styles/globals.css";

export const metadata = {
  title: "cerebro",
  description: "Productivity web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
