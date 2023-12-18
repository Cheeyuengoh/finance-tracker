import { useState } from "react";

export default function useLocalStorage(key) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify({ darkMode: false }));
    }
    const [state, setState] = useState(JSON.parse(localStorage.getItem(key)));
    function setStorage(data) {
        console.log(data);
        setState(data);
        localStorage.setItem(key, JSON.stringify(data));
    }
    return [state, setStorage];
}