import { useEffect, useState } from "react";

export default function MonthBar({ yearSelected, monthSelected, updateMonthSelected }) {
    const [numMonths, setNumMonths] = useState(12);

    useEffect(() => {
        let currentDate = new Date();
        if (yearSelected === currentDate.getFullYear()) {
            setNumMonths(currentDate.getMonth() + 1);
        } else {
            setNumMonths(12);
        }
    }, [yearSelected, setNumMonths]);

    function renderMonthItems() {
        let monthItems = [];
        for (let i = 0; i < numMonths; i++) {
            monthItems.unshift(
                <div key={i}>
                    <label className={`inline-block w-full p-2 cursor-pointer ease-in-out duration-300 hover:-translate-y-1 ${monthSelected === i ? 'bg-selected' : 'bg-light-primary dark:bg-dark-primary hover:bg-light-accent  dark:hover:bg-dark-accent'}`} htmlFor={'checkbox-' + getMonthName(i)}>{getMonthName(i)}</label>
                    <input className='hidden' id={'checkbox-' + getMonthName(i)} type='checkbox' checked={monthSelected === i} onChange={() => { updateMonthSelected(i) }}></input>
                </div>
            );
        }
        return monthItems;
    }

    return (
        <div className='w-8 mr-2 flex flex-col bg-slate-500 overflow-hidden'>
            {renderMonthItems()}
        </div>
    );
}

function getMonthName(num) {
    let date = new Date();
    date.setMonth(num);

    return date.toLocaleString('en-US', { month: 'long' });
}