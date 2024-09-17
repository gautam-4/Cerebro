"use client";

import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const TodoContext = createContext();

const DEFAULT_TODO = { id: 'default', name: 'todo1', isDone: false };

export const TodoProvider = ({ children }) => {
    const [todoList, setTodoList] = useState([DEFAULT_TODO]);
    const [newTodo, setNewTodo] = useState('');
    const [totalTodosCompletedEver, setTotalTodosCompletedEver] = useState(0);
    const [todoPercentage, setTodoPercentage] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchTodosFromSupabase(session.user.id);
            } else {
                setTodoList([DEFAULT_TODO]);
                setTotalTodosCompletedEver(0);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchTodosFromSupabase(session.user.id);
            } else {
                setTodoList([DEFAULT_TODO]);
                setTotalTodosCompletedEver(0);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (todoList.length > 0) {
            const completedTodos = todoList.filter(todo => todo.isDone).length;
            const percentage = (completedTodos / todoList.length) * 100;
            setTodoPercentage(percentage.toFixed(0));
        } else {
            setTodoPercentage(0);
        }
    }, [todoList]);

    const fetchTodosFromSupabase = async (userId) => {
        const { data: todos, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching todos:', error.message);
        } else if (todos && todos.length > 0) {
            setTodoList(todos.map(todo => ({ id: todo.id, name: todo.name, isDone: todo.is_done })));
            const completedCount = todos.filter(todo => todo.is_done).length;
            setTotalTodosCompletedEver(completedCount);
        } else {
            setTodoList([]);
        }
    };

    const handleTodoAdd = async () => {
        if (newTodo.trim() !== "") {
            const newTodoItem = { id: Date.now().toString(), name: newTodo, isDone: false };
            
            // Optimistic update
            setTodoList(prevTodoList => [...prevTodoList, newTodoItem]);
            setNewTodo('');

            if (user) {
                const { data, error } = await supabase
                    .from('todos')
                    .insert({ name: newTodo, is_done: false, user_id: user.id })
                    .select();

                if (error) {
                    console.error('Error adding todo:', error.message);
                    // Revert optimistic update
                    setTodoList(prevTodoList => prevTodoList.filter(todo => todo.id !== newTodoItem.id));
                } else {
                    // Update with the real ID from the database
                    setTodoList(prevTodoList => prevTodoList.map(todo => 
                        todo.id === newTodoItem.id ? { ...todo, id: data[0].id } : todo
                    ));
                }
            }
        }
    };

    const handleTodoTick = useCallback(async (index) => {
        const updatedTodoList = [...todoList];
        const todoItem = updatedTodoList[index];
        const newIsDone = !todoItem.isDone;

        // Optimistic update
        updatedTodoList[index] = { ...todoItem, isDone: newIsDone };
        setTodoList(updatedTodoList);
        setTotalTodosCompletedEver(prev => newIsDone ? prev + 1 : prev - 1);

        if (user) {
            const { error } = await supabase
                .from('todos')
                .update({ is_done: newIsDone })
                .eq('id', todoItem.id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating todo:', error.message);
                // Revert optimistic update
                updatedTodoList[index] = { ...todoItem, isDone: !newIsDone };
                setTodoList(updatedTodoList);
                setTotalTodosCompletedEver(prev => newIsDone ? prev - 1 : prev + 1);
            }
        }
    }, [todoList, user]);

    const handleTodoDelete = async (index) => {
        const todoToDelete = todoList[index];

        // Optimistic update
        setTodoList(prevTodoList => prevTodoList.filter((_, i) => i !== index));
        if (todoToDelete.isDone) {
            setTotalTodosCompletedEver(prev => prev - 1);
        }

        if (user) {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', todoToDelete.id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error deleting todo:', error.message);
                // Revert optimistic update
                setTodoList(prevTodoList => [...prevTodoList.slice(0, index), todoToDelete, ...prevTodoList.slice(index)]);
                if (todoToDelete.isDone) {
                    setTotalTodosCompletedEver(prev => prev + 1);
                }
            }
        }
    };

    return (
        <TodoContext.Provider
            value={{
                todoList,
                newTodo,
                setNewTodo,
                totalTodosCompletedEver,
                todoPercentage,
                handleTodoAdd,
                handleTodoTick,
                handleTodoDelete,
                user,
            }}
        >
            {children}
        </TodoContext.Provider>
    );
};