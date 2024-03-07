import { useState } from "react";

export default function useLocalStorage(key) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify({ user: null }));
    }

    const [state, setState] = useState(JSON.parse(localStorage.getItem(key)));

    function setStorage(obj) {
        setState(obj);
        localStorage.setItem(key, JSON.stringify(obj));
    }

    return [state, setStorage];
}