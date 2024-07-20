import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar";
import { TodoProvider } from '@/context/TodoContext';
import { HabitsProvider } from "@/context/habitsContext";

export const metadata = {
  title: "cerebro",
  description: "Productivity web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="overflow-x-hidden">
          <Navbar />
          <TodoProvider>
            <HabitsProvider>
              {children}
            </HabitsProvider>
          </TodoProvider>
        </div>
      </body>
    </html>
  );
}
