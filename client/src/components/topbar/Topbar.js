import { useContext } from 'react';
import ModalContext from '../contexts/ModalContext';

export default function Topbar({ darkMode, toggleTheme }) {
    const { updateShowModal } = useContext(ModalContext);

    return (
        <div className='fixed top-0 left-0 w-full h-7 px-5 flex justify-between items-center bg-slate-100 dark:bg-slate-900'>
            <div className='flex gap-5'>
                <div className='topbar-item' onClick={() => { updateShowModal('transaction') }}>+Transaction</div>
                <div className='topbar-item' onClick={() => { updateShowModal('category') }}>+Category</div>
            </div>
            <div>
                <div className='topbar-item' onClick={toggleTheme}>{darkMode ? 'Dark' : 'Light'}</div>
            </div>
        </div>
    );
}