import { useContext, useMemo } from 'react';
import ModalContext from '../../contexts/ModalContext';
import TransactionForm from '../forms/TransactionForm';
import { validatedTransaction } from "../../miscs/validation";

export default function TransactionModal() {
    const { updateShowModal } = useContext(ModalContext);
    const type = useMemo(() => { return 'create' }, []);

    async function handleSubmit(e, formData) {
        e.preventDefault();

        if (!validatedTransaction(type, formData)) {
            console.log('Empty fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/transactions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.log(err);
        } finally {
            updateShowModal(null);
        }
    }

    return (
        <div className="modal-container">
            <div className="modal">
                <TransactionForm key={'create-transaction'} type={type} handleSubmit={handleSubmit}></TransactionForm>
            </div>
            <div className='overlay' onClick={() => { updateShowModal(null) }}></div>
        </div>
    );
}