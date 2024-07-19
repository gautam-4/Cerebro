"use client"

import { useState } from "react"
import deleteIconRed from '@/public/assets/delete-icon-red.svg'
import Image from "next/image";

function ExpenseTracker() {
    const[expenseList, setExpenseList] = useState([]);
    const[expenseTotal, setExpenseTotal] = useState(0);

    function getDate(){
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const date = today.getDate().toString().padStart(2, '0');
        const year = (today.getFullYear()).toString().slice(-2).padStart(2, '0');
        const dateString = `${date}/${month}/${year}`;
        return dateString;
    }

    function handleExpenseAdd(){
        const expenseName = document.getElementById('add-expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('add-expense-amount').value);
        if (expenseName.trim()!=="" && !isNaN(expenseAmount) && expenseAmount>0){
            const roundedAmount = Math.round(expenseAmount * 100) / 100;
            setExpenseList(prevExpenseList => [...prevExpenseList, {date: getDate(), name: expenseName, amount: roundedAmount}])
            document.getElementById('add-expense-name').value = ""
            document.getElementById('add-expense-amount').value = ""
            setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal + roundedAmount).toFixed(2)))
        }
    }

    function handleExpenseDelete(index){
        setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal - expenseList[index].amount).toFixed(2)))
        setExpenseList(expenseList.filter((_, i) => i !== index))
    }

    function handleExpenseClear(){
        setExpenseList(expenseList.filter((_, __)=>false))
        setExpenseTotal(0)
    }

    return (
        <>
            <div className="expense-tracker">
                <div className="expense-tracker_total">
                    $ <span>{expenseTotal.toFixed(2)}</span>
                </div>
                <div className="expense_add">
                    <input type="text" placeholder="Transaction name" maxLength="18" id="add-expense-name"/>
                    <input type="number" step="0.01" placeholder="Amount" maxLength="6" id="add-expense-amount"/>
                    <button className="flex items-center justify-center" onClick={handleExpenseAdd}>Add</button>
                </div>
                <div className="expense_history">
                    <div className="expense_history-heading">History <button
                        className="expense_history-clear-btn" onClick={handleExpenseClear}>clear</button></div>
                    <div className="expense_history-content">
                        {expenseList.map((expenseItem, index) => 
                            <div className="expense_history-cell" key={index}>
                                <div className="expense-date">{expenseItem.date}</div>
                                <div className="expense-name">{expenseItem.name}</div>
                                <div className="expense-amount">$ {expenseItem.amount.toFixed(2)}</div>
                                <div className="expense-delete"><Image src={deleteIconRed} onClick={() => handleExpenseDelete(index)} alt="delete" /></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExpenseTracker