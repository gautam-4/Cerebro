"use client"

import { useState } from "react"

function Progress() {
    const [percentage, setPercentage] = useState(75);
    return (
        <>
            <div className="progress">
                <h3 className="text-lg font-bold">Progress</h3>
                <div>
                    <div className="text-lg flex text-nowrap gap-3 mb-1"> <div>To-dos progress:</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-20 rounded-md">
                            <div
                                className="bg-blue-400 opacity-80 text-lg font-semibold text-black text-center p-1.5 leading-none rounded-md"
                                style={{ width: `${percentage}%` }}
                            >
                                {percentage}%
                            </div>
                        </div>
                    </div>
                    <div className="text-lg">To-dos completed ever: <span className="font-semibold">12</span></div>
                    <div className="text-lg">Maximum habit streak ever: <span className="font-semibold">30</span></div>
                </div>
            </div>
        </>
    )
}

export default Progress