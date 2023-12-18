import { useContext } from 'react';
import ModalContext from '../contexts/ModalContext';

export default function TransactionItem({ item, setTransactionItem }) {
    const { updateShowModal } = useContext(ModalContext);

    async function handleEditTransaction() {
        setTransactionItem(item);
        updateShowModal('update-transaction');
    }

    async function handleDeleteTransaction() {
        if (window.confirm(`Are you sure you want to delete this transaction? (${item.uuid})`)) {
            try {
                const response = await fetch('http://localhost:5050/transactions/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uuid: item.uuid
                    })
                });
                const result = await response.json();
                console.log(result);
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div className='grid grid-cols-6 gap-4 ease-in-out duration-300 hover:bg-light-accent dark:hover:bg-dark-accent'>
            <div className='transaction-items-info'>
                <span>{item.transaction}</span>
            </div>
            <div className='transaction-items-info'>
                <span>{item.category}</span>
            </div>
            <div className='transaction-items-info'>
                <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className='transaction-items-info'>
                <span>{item.amount}</span>
            </div>
            <div className='transaction-items-info'>
                <span>{item.note}</span>
            </div>
            <div className='p-2 flex gap-3 justify-end items-end'>
                <div className='cursor-pointer ease-in-out duration-300 hover:scale-110' onClick={handleEditTransaction}>
                    <svg className='w-4 h-4' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
                        <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
                    </svg>
                </div>
                <div className='cursor-pointer ease-in-out duration-300 hover:scale-110' onClick={handleDeleteTransaction}>
                    <svg className='w-4 h-4' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}