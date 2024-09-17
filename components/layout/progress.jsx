"use client"

import { useContext } from 'react';
import { TodoContext } from '@/context/TodoContext';
import { HabitsContext } from '@/context/habitsContext';

function Progress() {
    const { totalTodosCompletedEver, todoPercentage } = useContext(TodoContext);
    const { maxStreakEver } = useContext(HabitsContext);

    return (
        <>
            <div className="progress">
                <h3 className="text-lg font-bold">Progress</h3>
                <div>
                    <div className="text-lg flex text-nowrap gap-3 mb-1"> <div>To-dos completed:</div>

                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-20 rounded-md">
                        <div
                            className="bg-blue-400 opacity-80 text-lg font-semibold text-black text-center p-1.5 leading-none rounded-md"
                            style={{ width: `${todoPercentage}%` }}
                        >
                            {todoPercentage}%
                        </div>
                    </div>
                    {/* <div className="text-lg">To-dos completed all-time: <span className="font-semibold">{totalTodosCompletedEver/2}</span></div>
                    <div className="text-lg">Maximum habit streak ever: <span className="font-semibold">{maxStreakEver}</span></div> */}
                </div>
            </div>
        </>
    )
}

export default Progress