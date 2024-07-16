import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar";

export const metadata = {
  title: "cerebro",
  description: "Productivity web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
