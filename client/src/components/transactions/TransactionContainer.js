import { useContext, useMemo, useState } from "react";
import useFetch from "../hooks/useFetch";
import TransactionItem from "./TransactionItem";
import ModalContext from "../contexts/ModalContext";
import UpdateTransactionModal from "../modals/transactionModal/UpdateTransactionModal";

export default function TransactionContainer({ transactionSelected, categorySelected, yearSelected, monthSelected }) {
    const { showModal } = useContext(ModalContext);
    const [transactionItem, setTransactionItem] = useState(null);

    const fetchConfig = useMemo(() => {
        return {
            url: 'http://localhost:5050/transactions',
            options: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transaction: transactionSelected,
                    category: categorySelected,
                    year: yearSelected,
                    month: monthSelected ? monthSelected + 1 : monthSelected
                })
            }
        }
    }, [transactionSelected, categorySelected, yearSelected, monthSelected]);

    const { data, isLoading, error } = useFetch(fetchConfig);

    if (isLoading) return (<div>Loading</div>);
    if (error) return (<div>{error}</div>);

    if (data && !isLoading && !error) {
        return (
            <div>
                {
                    data.map((month) => {
                        return <div key={month._id} className='bg-light-primary dark:bg-dark-primary'>
                            {
                                month.transactions.map((item) => {
                                    return <TransactionItem key={item.uuid} item={item} setTransactionItem={setTransactionItem}></TransactionItem>
                                })
                            }
                        </div>
                    })
                }
                {showModal === 'update-transaction' ? <UpdateTransactionModal transactionItem={transactionItem}></UpdateTransactionModal> : null}
            </div>
        );
    }
}