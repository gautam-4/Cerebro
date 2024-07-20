"use client"

import { useState } from "react"
import deleteIcon from '@/public/assets/delete-icon.svg'
import Image from "next/image"

function Habits() {
    const [habitList, setHabitList] = useState([{ name: 'habit1', streak: 0 }])
    const [newHabit, setNewHabit] = useState('')

    function handleHabitAdd() {
        if (newHabit.trim() !== "") {
            setHabitList(prevHabitList => [...prevHabitList, { name: newHabit, streak: 0 }])
            setNewHabit('') // Clear input field
        }
    }

    function handleHabitDelete(index) {
        setHabitList(prevHabitList => 
            prevHabitList.filter((_, i) => i !== index)
        )
    }

    function handleStreakIncrement(index) {
        setHabitList(prevHabitList =>
            prevHabitList.map((habit, i) =>
                i === index
                    ? { ...habit, streak: habit.streak < 0 ? 1 : habit.streak + 1 }
                    : habit
            )
        )
    }

    function handleStreakDecrement(index) {
        setHabitList(prevHabitList =>
            prevHabitList.map((habit, i) =>
                i === index
                    ? { ...habit, streak: habit.streak > 0 ? -1 : habit.streak - 1 }
                    : habit
            )
        )
    }

    return (
        <>
            <div className="habits flex-1">
                <div className="habits_heading title">
                    Habits
                </div>
                <div className="habits_content">
                    {habitList.map((habit, index) => (
                        <div className="habits_content-cell" key={index}>
                            <div className="habits_content-cell-streak">{habit.streak}</div>
                            <div className="habits_content-cell-inner w-full">
                                <div className="btn-div-left">
                                    <button onClick={() => handleStreakIncrement(index)} className="flex justify-center items-center pb-2">+</button>
                                </div>
                                <div className="habit-name w-full">{habit.name}</div>
                                <div className="btn-div-right">
                                    <button onClick={() => handleStreakDecrement(index)} className="flex justify-center items-center pb-1.5 pl-0.5">-</button>
                                </div>
                            </div>
                            <div className="habits_content-cell-delete">
                                <Image src={deleteIcon} onClick={() => handleHabitDelete(index)} alt="delete"/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="habits-add">
                    <input 
                        type="text" 
                        placeholder="Habit Name" 
                        maxLength="20" 
                        value={newHabit} 
                        onChange={(e) => setNewHabit(e.target.value)} 
                    />
                    <button onClick={handleHabitAdd} className="flex justify-center items-center pb-2.5 pl-0.5">+</button>
                </div>
            </div>
        </>
    )
}

export default Habits