"use client"

import { useEffect, useState } from "react";
import resetIcon from '@/public/assets/reset2.png';

import Image from "next/image";

function Pomodoro() {
    const [isStudying, setIsStudying] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const initialTimeStudy = 25 * 60;
    const initialTimeBreak = 5 * 60;
    const [timeStudy, setTimeStudy] = useState(initialTimeStudy);
    const [timeBreak, setTimeBreak] = useState(initialTimeBreak);

    useEffect(() => {
        let interval;
        if (isStudying && isRunning) {
            interval = setInterval(() => {
                setTimeStudy(prevSeconds => {
                    if (prevSeconds === 0) {
                        clearInterval(interval);
                        return prevSeconds;
                    } else {
                        return prevSeconds - 1;
                    }
                });
            }, 1000);
        }
        else if(!isStudying && isRunning){
            interval = setInterval(() => {
                setTimeBreak(prevSeconds => {
                    if (prevSeconds === 0) {
                        clearInterval(interval);
                        return prevSeconds;
                    } else {
                        return prevSeconds - 1;
                    }
                });
            }, 1000); 
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    function handleSwitch() {
        setIsRunning(!isRunning);
    }

    function formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    function handleStudy() {
        setIsStudying(true);
        if(isRunning){
            setIsRunning(!isRunning);
        }
    }

    function handleBreak() {
        setIsStudying(false);
        if(isRunning){
            setIsRunning(!isRunning);
        }
    }

    function handleReset(){
        if(isStudying){
            setTimeStudy(initialTimeStudy);
        }
        else{
            setTimeBreak(initialTimeBreak);
        }
    }

    return (
        <>
            <div className="pomodoro">
                <div className="pomodoro-options">
                    <button className={isStudying ? "active-btn" : "inactive-btn"} onClick={handleStudy}>Study</button>
                    <button className={isStudying ? "inactive-btn" : "active-btn"} onClick={handleBreak}>Break</button>
                </div>
                <div className="pomodoro-timer">{formatTime(isStudying?timeStudy:timeBreak)}</div>
                <div className="pomodoro-reset"><button onClick={handleReset}><Image src={resetIcon} alt="reset" /></button></div>
                <div className="pomodoro-start"><button onClick={handleSwitch}>{isRunning ? 'Stop' : 'Start'}</button></div>
            </div>
        </>
    );
}

export default Pomodoro;
