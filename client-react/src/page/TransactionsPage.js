import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import UpdateTransactionComponent from "../component/UpdateTransactionComponent";
import DeleteTransactionComponent from "../component/DeleteTransactionComponent";
import CreateTransactionComponent from "../component/CreateTransactionComponent";

export default function TransactionsPage() {
    const [data, setData] = useState(null);
    const { dispatch } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/transaction/userTransactions", {
                    method: "GET",
                    credentials: "include"
                });
                const json = await response.json();

                if (response.ok) {
                    setData(json.data);
                } else {
                    if (json.msg === "no token provided") {
                        dispatch({ type: "NOT_AUTHENTICATED" });
                        navigate(`/login?redirect=${location.pathname.replace("/", "")}`);
                    }

                    if (json.msg === "access token:jwt expired") {
                        try {
                            const response = await fetch(process.env.REACT_APP_API_URI + "/api/user/refreshTokens", {
                                method: "GET",
                                credentials: "include"
                            });
                            const json = await response.json();

                            if (response.ok) {
                                dispatch({ type: "AUTHENTICATED", payload: json.data });
                                fetchData();
                            } else {
                                dispatch({ type: "NOT_AUTHENTICATED" });
                                navigate(`/login?redirect=${location.pathname.replace("/", "")}`);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (!data) fetchData();
    }, [data, dispatch, location.pathname, navigate]);

    if (!data) return (<Spinner></Spinner>);

    return (
        <div>
            <CreateTransactionComponent setData={setData}></CreateTransactionComponent>
            <Table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((transaction, index) => {
                        return (
                            <tr key={index}>
                                <td>{transaction.typeCategory.type}</td>
                                <td>{transaction.typeCategory.name}</td>
                                <td>{transaction.amount}</td>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="d-flex gap-2">
                                    <UpdateTransactionComponent transaction={transaction} setData={setData}></UpdateTransactionComponent>
                                    <DeleteTransactionComponent transaction={transaction} setData={setData}></DeleteTransactionComponent>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}