import { useMemo, useState } from "react";
import TransactionBar from "../bars/TransactionBar";
import CategoryBar from "../bars/CategoryBar";
import YearBar from "../bars/Yearbar";
import MonthBar from "../bars/MonthBar";
import TransactionContainer from "./TransactionContainer";

export default function Transactions() {
    const type = useMemo(() => { return 'filter' }, []);
    const [yearSelected, setYearSelected] = useState(new Date().getFullYear());
    const [monthSelected, setMonthSelected] = useState(null);
    const [transactionSelected, setTransactionSelected] = useState(null);
    const [categorySelected, setCategorySelected] = useState([]);

    function updateTransactionSelected(transaction) {
        if (transaction === transactionSelected) {
            setTransactionSelected(null);
        } else {
            setTransactionSelected(transaction);
        }
        setCategorySelected([]);
    }

    function updateCategorySelected(category) {
        setCategorySelected((prevState) => {
            let arr = [...prevState];
            let index = arr.indexOf(category);
            if(index > -1){
                arr.splice(index, 1);
            }else{
                arr.push(category);
            }
            return arr;
        });
    }

    function updateYearSelected(value) {
        setYearSelected((prevState) => {
            return prevState += parseInt(value);
        });
        setMonthSelected(null);
    }

    function updateMonthSelected(month) {
        if(month === monthSelected){
            setMonthSelected(null);
        }else{
            setMonthSelected(month);
        }
    }

    return (
        <div>
            <TransactionBar type={type} transactionSelected={transactionSelected} updateTransactionSelected={updateTransactionSelected}></TransactionBar>
            <CategoryBar type={type} transactionSelected={transactionSelected} categorySelected={categorySelected} updateCategorySelected={updateCategorySelected}></CategoryBar>
            <YearBar yearSelected={yearSelected} updateYearSelected={updateYearSelected}></YearBar>
            <div className="flex">
                <MonthBar yearSelected={yearSelected} monthSelected={monthSelected} updateMonthSelected={updateMonthSelected}></MonthBar>
                <TransactionContainer transactionSelected={transactionSelected} categorySelected={categorySelected} yearSelected={yearSelected} monthSelected={monthSelected}></TransactionContainer>
            </div>
        </div>
    );
}