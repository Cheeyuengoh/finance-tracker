import { useContext, useMemo } from 'react';
import ModalContext from '../../contexts/ModalContext';
import CategoryForm from '../forms/CategoryForm';
import { validatedCategory } from '../../miscs/validation';

export default function CategoryModal() {
    const { updateShowModal } = useContext(ModalContext);
    const type = useMemo(() => { return 'create' }, []);

    async function handleSubmit(e, formData){
        e.preventDefault();

        if(!validatedCategory(type, formData)){
            console.log('Empty Fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/categories/create', {
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
        <div className='modal-container'>
            <div className='modal'>
                <CategoryForm key={'create-category'} type={type} handleSubmit={handleSubmit}></CategoryForm>
            </div>
            <div className='overlay' onClick={() => { updateShowModal(null) }}></div>
        </div>
    );
}