import { useMemo } from "react";
import useFetch from "../hooks/useFetch";

export default function CategoryBar({ type, transactionSelected, categorySelected, updateCategorySelected }) {
    const fetchConfig = useMemo(() => {
        return {
            url: 'http://localhost:5050/categories?q=' + transactionSelected,
            options: {
                method: 'GET'
            }
        }
    }, [transactionSelected]);

    const { data, isLoading, error } = useFetch(fetchConfig);

    if (isLoading) return (<div>Loading</div>);
    if (error) return (<div>{error}</div>);

    if (data && !isLoading && !error) {
        return (
            <div className='flex gap-2 pb-2 overflow-auto'>
                {
                    data.map((category) => {
                        return <div key={category} className={`tag-item ${Array.isArray(categorySelected) ? categorySelected.indexOf(category) > -1 ? 'bg-selected' : 'bg-light-primary dark:bg-dark-primary hover:bg-light-accent dark:hover:bg-dark-accent' : categorySelected === category ? 'bg-selected' : 'bg-light-primary dark:bg-dark-primary hover:bg-light-accent dark:hover:bg-dark-accent' }`}>
                            <label htmlFor={type + '-checkbox-' + category}>{category}</label>
                            <input id={type + '-checkbox-' + category} type='checkbox' checked={Array.isArray(categorySelected) ? categorySelected.indexOf(category) > -1: categorySelected === category} onChange={() => {updateCategorySelected(category)}}></input>
                        </div>
                    })
                }
            </div>
        );
    }
}