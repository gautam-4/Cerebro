"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from '@/lib/supabaseClient'; // Make sure this import is correct for your project structure
import deleteIconRed from '@/public/assets/delete-icon-red.svg'
import Image from "next/image";

function ExpenseTracker() {
    const [expenseList, setExpenseList] = useState([]);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [expenseData, setExpenseData] = useState({ newExpense: '', amount: '' });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchExpensesFromSupabase(session.user.id);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchExpensesFromSupabase(session.user.id);
            } else {
                setExpenseList([]);
                setExpenseTotal(0);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const fetchExpensesFromSupabase = async (userId) => {
        const { data: expenses, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching expenses:', error.message);
        } else if (expenses && expenses.length > 0) {
            setExpenseList(expenses.map(expense => ({
                id: expense.id,
                date: expense.date,
                year: expense.year,
                name: expense.name,
                amount: expense.amount
            })));
            setExpenseTotal(expenses.reduce((total, expense) => total + expense.amount, 0));
        } else {
            setExpenseList([]);
            setExpenseTotal(0);
        }
    };

    function getDate() {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const date = today.getDate().toString().padStart(2, '0');
        const year = today.getFullYear().toString().slice(-2).padStart(2, '0');
        const dateString = `${date}/${month}`;
        return { dateString, year };
    }

    async function handleExpenseAdd() {
        const { newExpense, amount } = expenseData;
        const expenseAmount = parseFloat(amount);
        const name = newExpense.trim();
        if (name !== "" && !isNaN(expenseAmount) && expenseAmount > 0) {
            const roundedAmount = Math.round(expenseAmount * 100) / 100;
            const newExpenseItem = { 
                id: Date.now().toString(),
                date: getDate().dateString, 
                year: getDate().year, 
                name, 
                amount: roundedAmount 
            };

            // Optimistic update
            setExpenseList(prevExpenseList => [...prevExpenseList, newExpenseItem]);
            setExpenseData({ newExpense: '', amount: '' });
            setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal + roundedAmount).toFixed(2)));

            if (user) {
                const { data, error } = await supabase
                    .from('expenses')
                    .insert({ 
                        date: newExpenseItem.date,
                        year: newExpenseItem.year,
                        name: newExpenseItem.name,
                        amount: newExpenseItem.amount,
                        user_id: user.id 
                    })
                    .select();

                if (error) {
                    console.error('Error adding expense:', error.message);
                    // Revert optimistic update
                    setExpenseList(prevExpenseList => prevExpenseList.filter(expense => expense.id !== newExpenseItem.id));
                    setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal - roundedAmount).toFixed(2)));
                } else {
                    // Update with the real ID from the database
                    setExpenseList(prevExpenseList => prevExpenseList.map(expense => 
                        expense.id === newExpenseItem.id ? { ...expense, id: data[0].id } : expense
                    ));
                }
            }
        }
    }

    async function handleExpenseDelete(index) {
        const expenseToDelete = expenseList[index];

        // Optimistic update
        setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal - expenseToDelete.amount).toFixed(2)));
        setExpenseList(expenseList.filter((_, i) => i !== index));

        if (user) {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', expenseToDelete.id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error deleting expense:', error.message);
                // Revert optimistic update
                setExpenseList(prevExpenseList => [...prevExpenseList.slice(0, index), expenseToDelete, ...prevExpenseList.slice(index)]);
                setExpenseTotal(prevExpenseTotal => parseFloat((prevExpenseTotal + expenseToDelete.amount).toFixed(2)));
            }
        }
    }

    async function handleExpenseClear() {
        // Optimistic update
        setExpenseList([]);
        setExpenseTotal(0);

        if (user) {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('user_id', user.id);

            if (error) {
                console.error('Error clearing expenses:', error.message);
                // Revert optimistic update
                await fetchExpensesFromSupabase(user.id);
            }
        }
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
                            <div className="expense_history-cell" key={expenseItem.id}>
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