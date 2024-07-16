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
        const expenseAmount = parseInt(document.getElementById('add-expense-amount').value);
        if (expenseName.trim()!=="" && !isNaN(expenseAmount) && expenseAmount>0){
            setExpenseList(prevExpenseList => [...prevExpenseList, {date: getDate(), name: expenseName, amount: expenseAmount}])
            document.getElementById('add-expense-name').value = ""
            document.getElementById('add-expense-amount').value = ""
            setExpenseTotal(prevExpenseTotal => prevExpenseTotal+expenseAmount)
        }
    }
    function handleExpenseDelete(index){
        setExpenseTotal(prevExpenseTotal => prevExpenseTotal - expenseList[index].amount)
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
                    ₹ <span>{expenseTotal}</span>
                </div>
                <div className="expense_add">
                    <input type="text" placeholder="Transaction name" maxLength="18" id="add-expense-name"/><input type="number"
                        placeholder="Amount" maxLength="6" id="add-expense-amount"/><button onClick={handleExpenseAdd}>Add</button>
                </div>
                <div className="expense_history">
                    <div className="expense_history-heading">History <button
                        className="expense_history-clear-btn" onClick={handleExpenseClear}>clear</button></div>
                    <div className="expense_history-content">
                        {expenseList.map((expenseItem, index) => 
                            <div className="expense_history-cell" key={index}>
                                <div className="expense-date">{expenseItem.date}</div>
                                <div className="expense-name">{expenseItem.name}</div>
                                <div className="expense-amount">₹ {expenseItem.amount}</div>
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