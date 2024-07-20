"use client"

import { createContext, useState } from 'react';
export const HabitsContext = createContext();

export const HabitsProvider = ({ children }) => {
    const [habitList, setHabitList] = useState([{ name: 'habit1', streak: 0 }]);
    const [newHabit, setNewHabit] = useState('');
    const [maxStreakEver, setMaxStreakEver] = useState(0);

    const handleHabitAdd = () => {
        if (newHabit.trim() !== "") {
            setHabitList(prevHabitList => [...prevHabitList, { name: newHabit, streak: 0 }]);
            setNewHabit('');
        }
    };

    const handleHabitDelete = (index) => {
        setHabitList(prevHabitList => 
            prevHabitList.filter((_, i) => i !== index)
        );
    };

    const handleStreakIncrement = (index) => {
        setHabitList(prevHabitList => 
            prevHabitList.map((habit, i) => {
                if (i === index) {
                    const newStreak = habit.streak < 0 ? 1 : habit.streak + 1;
                    setMaxStreakEver(prevMax => Math.max(prevMax, newStreak));
                    return { ...habit, streak: newStreak };
                }
                return habit;
            })
        );
    };

    const handleStreakDecrement = (index) => {
        setHabitList(prevHabitList => 
            prevHabitList.map((habit, i) => {
                if (i === index) {
                    return { ...habit, streak: habit.streak > 0 ? -1 : habit.streak - 1 };
                }
                return habit;
            })
        );
    };

    return (
        <HabitsContext.Provider value={{ habitList, newHabit, setNewHabit, maxStreakEver, handleHabitAdd, handleHabitDelete, handleStreakIncrement, handleStreakDecrement }}>
            {children}
        </HabitsContext.Provider>
    );
};