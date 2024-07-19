import Habits from "@/components/layout/habits";
import Note from "@/components/layout/note";
import Todo from "@/components/layout/todo";
import Progress from "@/components/layout/progress";
import Pomodoro from "@/components/layout/pomodoro";
import ExpenseTracker from "@/components/layout/expenseTracker";

export default function Home() {
  return (
    <>
      <main className="flex items-start">
        <section className="my-3 mx-4 flex flex-col gap-6 flex-1 justify-start min-h-screen">
          <Habits />
          <Note />
        </section>

        <section className="my-3 mx-4 flex flex-col gap-6 flex-1 justify-start min-h-screen">
          <Todo />
          <Progress />
        </section>

        <section className="my-3 mx-4 flex flex-col md:flex-row lg:flex-col gap-6 flex-1 justify-start h-fit">
          <Pomodoro/>
          <ExpenseTracker />
        </section>
      </main>

    </>
  );
}
