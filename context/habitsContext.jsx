"use client"

import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Make sure this import is correct for your project structure

export const HabitsContext = createContext();

const DEFAULT_HABIT = { id: 'default', name: 'habit1', streak: 0 };

export const HabitsProvider = ({ children }) => {
    const [habitList, setHabitList] = useState([DEFAULT_HABIT]);
    const [newHabit, setNewHabit] = useState('');
    const [maxStreakEver, setMaxStreakEver] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchHabitsFromSupabase(session.user.id);
            } else {
                setHabitList([DEFAULT_HABIT]);
                setMaxStreakEver(0);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchHabitsFromSupabase(session.user.id);
            } else {
                setHabitList([DEFAULT_HABIT]);
                setMaxStreakEver(0);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const fetchHabitsFromSupabase = async (userId) => {
        const { data: habits, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching habits:', error.message);
        } else if (habits && habits.length > 0) {
            setHabitList(habits.map(habit => ({ id: habit.id, name: habit.name, streak: habit.streak })));
            const maxStreak = Math.max(...habits.map(habit => habit.streak));
            setMaxStreakEver(maxStreak);
        } else {
            setHabitList([]);
        }
    };

    const handleHabitAdd = async () => {
        if (newHabit.trim() !== "") {
            const newHabitItem = { id: Date.now().toString(), name: newHabit, streak: 0 };
            
            // Optimistic update
            setHabitList(prevHabitList => [...prevHabitList, newHabitItem]);
            setNewHabit('');

            if (user) {
                const { data, error } = await supabase
                    .from('habits')
                    .insert({ name: newHabit, streak: 0, user_id: user.id })
                    .select();

                if (error) {
                    console.error('Error adding habit:', error.message);
                    // Revert optimistic update
                    setHabitList(prevHabitList => prevHabitList.filter(habit => habit.id !== newHabitItem.id));
                } else {
                    // Update with the real ID from the database
                    setHabitList(prevHabitList => prevHabitList.map(habit => 
                        habit.id === newHabitItem.id ? { ...habit, id: data[0].id } : habit
                    ));
                }
            }
        }
    };

    const handleHabitDelete = async (index) => {
        const habitToDelete = habitList[index];

        // Optimistic update
        setHabitList(prevHabitList => prevHabitList.filter((_, i) => i !== index));

        if (user) {
            const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', habitToDelete.id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error deleting habit:', error.message);
                // Revert optimistic update
                setHabitList(prevHabitList => [...prevHabitList.slice(0, index), habitToDelete, ...prevHabitList.slice(index)]);
            }
        }
    };

    const handleStreakIncrement = useCallback(async (index) => {
        const updatedHabitList = [...habitList];
        const habit = updatedHabitList[index];
        const newStreak = habit.streak < 0 ? 1 : habit.streak + 1;

        // Optimistic update
        updatedHabitList[index] = { ...habit, streak: newStreak };
        setHabitList(updatedHabitList);
        setMaxStreakEver(prevMax => Math.max(prevMax, newStreak));

        if (user) {
            const { error } = await supabase
                .from('habits')
                .update({ streak: newStreak })
                .eq('id', habit.id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating habit streak:', error.message);
                // Revert optimistic update
                updatedHabitList[index] = habit;
                setHabitList(updatedHabitList);
                setMaxStreakEver(prevMax => Math.max(...updatedHabitList.map(h => h.streak)));
            }
        }
    }, [habitList, user]);

    const handleStreakDecrement = useCallback(async (index) => {
        const updatedHabitList = [...habitList];
        const habit = updatedHabitList[index];
        const newStreak = habit.streak > 0 ? -1 : habit.streak - 1;

        // Optimistic update
        updatedHabitList[index] = { ...habit, streak: newStreak };
        setHabitList(updatedHabitList);

        if (user) {
            const { error } = await supabase
                .from('habits')
                .update({ streak: newStreak })
                .eq('id', habit.id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating habit streak:', error.message);
                // Revert optimistic update
                updatedHabitList[index] = habit;
                setHabitList(updatedHabitList);
            }
        }
    }, [habitList, user]);

    return (
        <HabitsContext.Provider value={{
            habitList,
            newHabit,
            setNewHabit,
            maxStreakEver,
            handleHabitAdd,
            handleHabitDelete,
            handleStreakIncrement,
            handleStreakDecrement,
            user
        }}>
            {children}
        </HabitsContext.Provider>
    );
};