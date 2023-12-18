import { useContext, useMemo } from "react";
import ModalContext from '../../contexts/ModalContext';
import CategoryForm from "../forms/CategoryForm";
import { validatedCategory } from '../../miscs/validation';

export default function UpdateCategoryModal() {
    const { updateShowModal } = useContext(ModalContext);
    const type = useMemo(() => { return 'update' }, []);

    async function handleSubmit(e, formData) {
        e.preventDefault();

        if (!validatedCategory(type, formData)) {
            console.log('Empty Fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/categories/update', {
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

    async function handleDeleteCategory(transaction, category) {
        if (window.confirm(`Are you sure you want to delete this category? (${category})`)) {
            let formData = {
                transaction: transaction,
                category: category
            };

            try {
                const response = await fetch('http://localhost:5050/categories/delete', {
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
    }

    return (
        <div className='modal-container'>
            <div className="modal">
                <CategoryForm key={'update-category'} type={type} handleSubmit={handleSubmit} handleDeleteCategory={handleDeleteCategory}></CategoryForm>
            </div>
            <div className='overlay' onClick={() => { updateShowModal(null) }}></div>
        </div>
    );
}