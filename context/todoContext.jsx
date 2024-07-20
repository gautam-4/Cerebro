"use client"

import { createContext, useState, useEffect, useCallback } from 'react';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const [todoList, setTodoList] = useState([{ name: 'todo1', isDone: false }]);
    const [newTodo, setNewTodo] = useState('');
    const [totalTodosCompletedEver, setTotalTodosCompletedEver] = useState(0);
    const [todoPercentage, setTodoPercentage] = useState(0);

    useEffect(() => {
        const completedTodos = todoList.filter(todo => todo.isDone).length;
        const percentage = (completedTodos / todoList.length) * 100;
        setTodoPercentage(percentage.toFixed(0));
    }, [todoList]);

    const handleTodoAdd = () => {
        if (newTodo.trim() !== "") {
            setTodoList(prevTodoList => [...prevTodoList, { name: newTodo, isDone: false }]);
            setNewTodo('');
        }
    };

    const handleTodoTick = useCallback((index) => {
        setTodoList(prevTodoList =>
            prevTodoList.map((todoItem, i) => {
                if (i === index) {
                    const newIsDone = !todoItem.isDone;
                    setTotalTodosCompletedEver(prev => newIsDone ? prev + 1 : prev - 1);
                    return { ...todoItem, isDone: newIsDone };
                }
                return todoItem;
            })
        );
    }, []);

    const handleTodoDelete = (index) => {
        setTodoList(prevTodoList => {
            const todoToDelete = prevTodoList[index];
            return prevTodoList.filter((_, i) => i !== index);
        });
    };

    return (
        <TodoContext.Provider value={{ todoList, newTodo, setNewTodo, totalTodosCompletedEver, todoPercentage, handleTodoAdd, handleTodoTick, handleTodoDelete }}>
            {children}
        </TodoContext.Provider>
    );
};