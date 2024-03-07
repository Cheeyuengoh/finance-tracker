import { createContext, useReducer } from "react";
import useLocalStorage from "../hook/useLocalStorage";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [storage, setStorage] = useLocalStorage("finance-tracker");
    const [state, dispatch] = useReducer(authReducer, storage);

    function authReducer(state, action) {
        switch (action.type) {
            case "AUTHENTICATED":
                setStorage({ user: action.payload });
                return { user: action.payload };
            case "NOT_AUTHENTICATED":
                setStorage({ user: null });
                return { user: null };
            default:
                return state;
        }
    }

    console.log("AuthContext state:", state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}