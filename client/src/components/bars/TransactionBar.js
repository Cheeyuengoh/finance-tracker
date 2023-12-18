import { useEffect, useMemo } from "react";
import useFetch from "../hooks/useFetch";

export default function TransactionBar({ type, transactionSelected, updateTransactionSelected }) {
    const fetchConfig = useMemo(() => {
        return {
            url: 'http://localhost:5050/categories/types',
            options: {
                method: 'GET'
            }
        };
    }, []);

    const { data, isLoading, error } = useFetch(fetchConfig);

    useEffect(() => {
        if (type === 'create' && !transactionSelected) {
            if (data && !isLoading && !error) {
                updateTransactionSelected(data[0]);
            }
        }
    }, [type, transactionSelected, data, isLoading, error, updateTransactionSelected]);

    if (isLoading) return (<div>Loading</div>);
    if (error) return (<div>{error}</div>);

    if (data && !isLoading && !error) {
        return (
            <div className='flex gap-2 pb-2 overflow-auto'>
                {
                    data.map((transaction) => {
                        return <div key={transaction} className={`tag-item ${transactionSelected === transaction ? 'bg-selected' : 'bg-light-primary dark:bg-dark-primary hover:bg-light-accent dark:hover:bg-dark-accent'}`}>
                            <label htmlFor={type + '-checkbox-' + transaction}>{transaction}</label>
                            <input id={type + '-checkbox-' + transaction} type='checkbox' checked={transactionSelected === transaction} onChange={() => { updateTransactionSelected(transaction) }}></input>
                        </div>
                    })
                }
            </div>
        );
    }
}