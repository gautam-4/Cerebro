"use client"

import { useContext } from 'react';
import { TodoContext } from '@/context/todoContext';
import deleteIcon from '@/public/assets/delete-icon.svg';
import tickIcon from '@/public/assets/tick-icon2.svg';
import Image from 'next/image';

function Todo() {
    const { todoList, newTodo, setNewTodo, handleTodoAdd, handleTodoTick, handleTodoDelete } = useContext(TodoContext);

    return (
        <div className="todo">
            <div className="todo_heading title">
                To-do
            </div>
            <div className="todo_content">
                {todoList.map((todoItem, index) => (
                    <div className="todo_content-cell" key={index}>
                        <div className="todo_content-cell-inner w-full">
                            <div className="btn-div-left">
                                <button className="flex-center" onClick={() => handleTodoTick(index)}>
                                    <Image src={tickIcon} alt='tick' style={todoItem.isDone ? { display: 'inline' } : { display: 'none' }} />
                                </button>
                            </div>
                            <div className="todo-name w-full" style={todoItem.isDone ? { textDecoration: 'line-through' } : { textDecoration: 'none' }}>
                                {todoItem.name}
                            </div>
                        </div>
                        <div className="todo_content-cell-delete">
                            <Image src={deleteIcon} alt="delete" onClick={() => handleTodoDelete(index)} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="todo-add">
                <input 
                    type="text" 
                    placeholder="To-do Name" 
                    maxLength="20" 
                    value={newTodo} 
                    onChange={(e) => setNewTodo(e.target.value)} 
                />
                <button onClick={handleTodoAdd} className="flex justify-center items-center pb-2.5 pl-0.5">+</button>
            </div>
        </div>
    );
}

export default Todo;