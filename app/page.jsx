import Habits from "@/components/layout/habits";
import Note from "@/components/layout/note";
import Todo from "@/components/layout/todo";
import Progress from "@/components/layout/progress";
import Pomodoro from "@/components/layout/pomodoro";
import ExpenseTracker from "@/components/layout/expenseTracker";

export default function Home() {
  return (
    <>
      <main className="flex">
        <section className="">
          <Habits />
          <Note />
        </section>

        <section>
          <Todo />
          <Progress />
        </section>

        <section>
          <Pomodoro/>
          <ExpenseTracker />
        </section>
      </main>

    </>
  );
}
