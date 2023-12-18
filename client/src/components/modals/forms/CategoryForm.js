import { useContext, useState } from "react";
import TransactionBar from "../../bars/TransactionBar";
import CategoryBar from "../../bars/CategoryBar";
import ModalContext from "../../contexts/ModalContext";

export default function CategoryForm({ type, handleSubmit, handleDeleteCategory }) {
    const { showModal, setShowModal } = useContext(ModalContext);

    const [transactionSelected, setTransactionSelected] = useState(null);
    const [categorySelected, setCategorySelected] = useState(null);
    const [categoryInput, setcategoryInput] = useState('');

    function updateTransactionSelected(transaction) {
        setTransactionSelected(transaction);

        if (transaction !== transactionSelected) {
            setCategorySelected(null);
            setcategoryInput('');
        }
    }

    function updateCategorySelected(category) {
        if (category === categorySelected) {
            setCategorySelected(null);
            setcategoryInput('');
        } else {
            setCategorySelected(category);
            setcategoryInput(category);
        }
    }

    function toggleCategoryModal() {
        setShowModal((prevState) => {
            if (prevState === 'category') {
                return 'update-category';
            } else {
                return 'category'
            }
        });
    }

    let formData = type === 'create' ? {
        transaction: transactionSelected,
        category: categoryInput.toLowerCase()
    } : {
        transaction: transactionSelected,
        oldCategory: categorySelected,
        newCategory: categoryInput.toLowerCase()
    }

    return (
        <form className='h-full flex flex-col justify-between' onSubmit={(e) => { handleSubmit(e, formData) }}>
            <div>
                <div className='flex justify-between'>
                    <TransactionBar type={type} transactionSelected={transactionSelected} updateTransactionSelected={updateTransactionSelected}></TransactionBar>
                    <div className='pb-2'>
                        <div className={`tag-item ${showModal === 'category' ? 'bg-purple-400' : 'bg-slate-500'}`}>
                            <label htmlFor='checkbox-toggle'>{showModal === 'category' ? 'Create' : 'Update'}</label>
                            <input id='checkbox-toggle' type='checkbox' checked={showModal === 'category'} onChange={toggleCategoryModal}></input>
                        </div>
                    </div>
                </div>
                {
                    showModal === 'update-category' ? <CategoryBar type={type} transactionSelected={transactionSelected} categorySelected={categorySelected} updateCategorySelected={updateCategorySelected}></CategoryBar> : null
                }
            </div>

            <div className='flex flex-col gap-1'>
                {
                    showModal === 'update-category' && categorySelected ?
                        <div className='input-div'>
                            <label htmlFor="input-delete" className='bg-red-300 cursor-pointer'>Delete</label>
                            <input id='input-delete' className='hidden' type='button' onClick={() => { handleDeleteCategory(transactionSelected, categorySelected) }}></input>
                        </div>
                        : null
                }
                <div className='input-div'>
                    <label htmlFor="input-category">category</label>
                    <input id='input-category' type='text' value={categoryInput} onChange={(e) => { setcategoryInput(e.currentTarget.value) }}></input>
                </div>
                <div className='input-div'>
                    <input type='submit' value={type}></input>
                </div>
            </div>
        </form>
    );
}