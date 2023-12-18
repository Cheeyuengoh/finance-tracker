import { useEffect, useState } from "react";
import CategoryBar from "../../bars/CategoryBar";
import TransactionBar from "../../bars/TransactionBar";

export default function TransactionForm({ type, handleSubmit, transactionItem }) {
    const [transactionSelected, setTransactionSelected] = useState(null);
    const [categorySelected, setCategorySelected] = useState(null);
    const [date, setDate] = useState(null);
    const [amount, setAmount] = useState(null);
    const [note, setNote] = useState(null);

    useEffect(() => {
        if (type === 'update') {
            setTransactionSelected(transactionItem.transaction);
            setCategorySelected(transactionItem.category);
            setDate(new Date(transactionItem.date));
            setAmount(transactionItem.amount);
            setNote(transactionItem.note);
        }
    }, [type, transactionItem]);

    function updateTransactionSelected(transaction) {
        setTransactionSelected(transaction);

        if (transaction !== transactionSelected) {
            setCategorySelected(null);
        }
    }

    function updateCategorySelected(category) {
        if (category === categorySelected) {
            setCategorySelected(null);
        } else {
            setCategorySelected(category);
        }
    }

    function updateDate(date) {
        setDate(new Date(date));
    }

    function updateAmount(amount) {
        setAmount(amount);
    }

    function updateNote(note) {
        console.log(note);
        setNote(note);
    }

    let formData = {
        transaction: transactionSelected,
        category: categorySelected,
        date: date,
        amount: amount,
        note: note
    }

    if (type === 'update') {
        formData.uuid = transactionItem.uuid;
    }

    return (
        <form className='h-full flex flex-col justify-between' onSubmit={(e) => { handleSubmit(e, formData) }}>
            <div>
                <TransactionBar type={type} transactionSelected={transactionSelected} updateTransactionSelected={updateTransactionSelected}></TransactionBar>
                <CategoryBar type={type} transactionSelected={transactionSelected} categorySelected={categorySelected} updateCategorySelected={updateCategorySelected}></CategoryBar>
            </div>
            <div className='flex flex-col gap-1'>
                <div className='input-div'>
                    <label htmlFor='input-date'>date</label>
                    <input id='input-date' type='date' value={type === 'update' && date ? date.toLocaleDateString('en-CA') : ''} onChange={(e) => { updateDate(e.currentTarget.value) }}></input>
                </div>
                <div className='input-div'>
                    <label htmlFor='input-amount'>amount</label>
                    <input id='input-amount' type='number' value={type === 'update' && amount ? amount : ''} onChange={(e) => { updateAmount(e.currentTarget.value) }}></input>
                </div>
                <div className='input-div'>
                    <label htmlFor='input-note'>note</label>
                    <input id='input-note' type='text' value={type === 'update' && note ? note : ''} onChange={(e) => { updateNote(e.currentTarget.value) }}></input>
                </div>
                <div className='input-div'>
                    <input type='submit' value={type}></input>
                </div>
            </div>
        </form>
    );
}