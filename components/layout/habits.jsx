"use client"

import { useState } from "react"
import deleteIcon from '@/public/assets/delete-icon.svg'
import Image from "next/image"

function Habits() {
    const [habitList, setHabitList] = useState([{name: 'habit1', streak: 0}]);

    function handleHabitAdd(){
        const habitName = document.getElementById('add-habit-name').value;
        if (habitName.trim()!==""){
            setHabitList(prevHabitList => [...prevHabitList, {name: habitName, streak: 0}])
            document.getElementById('add-habit-name').value = ""
        }
    }
    function handleHabitDelete(index){
        setHabitList(habitList.filter((_, i) => i!==index))
    }
    function handleStreakIncrement(index){
        const prevHabitList = [...habitList]
        if(prevHabitList[index].streak<0){
            prevHabitList[index].streak = 1;
        }
        else{
            prevHabitList[index].streak++;
        }
        setHabitList(prevHabitList)

    }
    function handleStreakDecrement(index){
        const prevHabitList = [...habitList]
        if(prevHabitList[index].streak>0){
            prevHabitList[index].streak = -1;
        }
        else{
            prevHabitList[index].streak--;
        }
        setHabitList(prevHabitList)
    }
    return (
        <>
            <div className="habits">
                <div className="habits_heading title">
                    Habits
                </div>
                <div className="habits_content">
                    {habitList.map((habit, index) =>
                        <div className="habits_content-cell" key={index}>
                        <div className="habits_content-cell-streak">{habit.streak}</div>
                        <div className="habits_content-cell-inner">
                            <div className="btn-div-left"><button onClick={() => handleStreakIncrement(index)}>+</button></div>
                            <div className="habit-name">{habit.name}</div>
                            <div className="btn-div-right"><button onClick={() => handleStreakDecrement(index)}>-</button></div>
                        </div>
                        <div className="habits_content-cell-delete"><Image src={deleteIcon} onClick={() => handleHabitDelete(index)} alt="delete"/>
                        </div>
                    </div>
                    )}
                </div>
                <div className="habits-add">
                    <input type="text" placeholder="Habit Name" maxLength="20" id="add-habit-name"/>
                    <button onClick={handleHabitAdd}>+</button>
                </div>
            </div>
        </>
    )
}

export default Habits