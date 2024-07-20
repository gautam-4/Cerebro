"use client"

import { useState } from "react"
import deleteIconRed from '@/public/assets/delete-icon-red.svg'
import Image from "next/image";

function ExpenseTracker() {
    const [expenseList, setExpenseList] = useState([]);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [expenseData, setExpenseData] = useState({ newExpense: '', amount: '' });

    function getDate() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const date = today.getDate().toString().padStart(2, '0');
        const year = today.getFullYear().toString().slice(-2).padStart(2, '0');
        const dateString = `${date}/${month}`;
        return { dateString, year };
    }

    function handleExpenseAdd() {
        const { newExpense, amount } = expenseData;
        const expenseAmount = parseFloat(amount);
        const name = newExpense.trim();
        if (name !== "" && !isNaN(expenseAmount) && expenseAmount > 0) {
            const roundedAmount = Math.round(expenseAmount * 100) / 100;
            setExpenseList(prevExpenseList => [...prevExpenseList, { date: getDate().dateString, year: getDate().year, name, amount: roundedAmount }]);
            setExpenseData({ newExpense: '', amount: '' });
            setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal + roundedAmount).toFixed(2)));
        }
    }

    function handleExpenseDelete(index) {
        setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal - expenseList[index].amount).toFixed(2)));
        setExpenseList(expenseList.filter((_, i) => i !== index));
    }

    function handleExpenseClear() {
        setExpenseList([]);
        setExpenseTotal(0);
    }

    function handleInputChange(event) {
        const { name, value } = event.target;

        if (name === "amount") {
            // Validate amount to allow only numbers with up to 6 non-decimal digits
            const regex = /^[0-9]{0,6}(\.[0-9]*)?$/;
            if (regex.test(value)) {
                setExpenseData(prevData => ({ ...prevData, [name]: value }));
            }
        } else {
            setExpenseData(prevData => ({ ...prevData, [name]: value }));
        }
    }

    return (
        <>
            <div className="expense-tracker">
                <div className="expense-tracker_total">
                    $ <span>{expenseTotal.toFixed(2)}</span>
                </div>
                <div className="expense_add">
                    <input 
                        type="text" 
                        placeholder="Expense" 
                        maxLength="18" 
                        name="newExpense"
                        value={expenseData.newExpense} 
                        onChange={handleInputChange}
                    />
                    <input 
                        type="number" 
                        step="0.01" 
                        placeholder="Amount" 
                        max="999999.99" 
                        name="amount" 
                        value={expenseData.amount} 
                        onChange={handleInputChange}
                    />
                    <button className="flex items-center justify-center" onClick={handleExpenseAdd}>Add</button>
                </div>
                <div className="expense_history">
                    <div className="expense_history-heading">History <button
                        className="expense_history-clear-btn" onClick={handleExpenseClear}>clear</button></div>
                    <div className="expense_history-content">
                        {expenseList.map((expenseItem, index) => 
                            <div className="expense_history-cell" key={index}>
                                <div className="expense-date">{expenseItem.date}<span className="hidden sm:inline">/{expenseItem.year}</span></div>
                                <div className="expense-name">{expenseItem.name}</div>
                                <div className="expense-amount">$ {expenseItem.amount.toFixed(2)}</div>
                                <div className="expense-delete"><Image src={deleteIconRed} onClick={() => handleExpenseDelete(index)} alt="delete" /></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ExpenseTracker;