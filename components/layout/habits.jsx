"use client"

import { useContext } from 'react';
import { HabitsContext } from '@/context/habitsContext';
import deleteIcon from '@/public/assets/delete-icon.svg';
import Image from 'next/image';

function Habits() {
    const { habitList, newHabit, setNewHabit, handleHabitAdd, handleHabitDelete, handleStreakIncrement, handleStreakDecrement } = useContext(HabitsContext);

    return (
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
    );
}

export default Habits;