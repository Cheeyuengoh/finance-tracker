import './App.css';
import { useEffect, useState } from 'react';
import ModalContext from './components/contexts/ModalContext';
import Topbar from './components/topbar/Topbar';
import Dashboard from './components/Dashboard';
import TransactionModal from './components/modals/transactionModal/TransactionModal';
// import UpdateTransactionModal from './components/modals/transactionModal/UpdateTransactionModal';
import CategoryModal from './components/modals/categoryModal/CategoryModal';
import UpdateCategoryModal from './components/modals/categoryModal/UpdateCategoryModal';
import useLocalStorage from './components/hooks/useLocalStorage';

function App() {
  const [localStorageState, setLocalStorageState] = useLocalStorage('financeTracker');
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    let html = document.querySelector('html');
    if(localStorageState.darkMode){
      html.classList.add('dark');
    }else{
      html.classList.remove('dark');
    }
  });

  function updateShowModal(modal) {
    setShowModal(modal);
  }

  function toggleTheme() {
    setLocalStorageState({darkMode: !localStorageState.darkMode});
  }

  return (
    <div className="w-screen h-screen">
      <ModalContext.Provider value={{ showModal: showModal, updateShowModal: updateShowModal }}>
        <Topbar darkMode={localStorageState.darkMode} toggleTheme={toggleTheme}></Topbar>
        <Dashboard></Dashboard>

        {showModal === 'transaction' ? <TransactionModal></TransactionModal> : null}
        {/* {showModal === 'update-transaction' ? <UpdateTransactionModal></UpdateTransactionModal> : null} */}
        {showModal === 'category' ? <CategoryModal></CategoryModal> : null}
        {showModal === 'update-category' ? <UpdateCategoryModal></UpdateCategoryModal> : null}
      </ModalContext.Provider>
    </div>
  );
}

export default App;
