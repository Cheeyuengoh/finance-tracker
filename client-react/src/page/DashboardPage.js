import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";

export default function DashboadPage() {
    const [data, setData] = useState(null);
    const [totalExpense, setTotalExpense] = useState("");
    const [totalIncome, setTotalIncome] = useState("");
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

    useEffect(() => {
        function calculateTotalByType(type) {
            let total = 0;
            for (const transaction of data) {
                if (transaction.typeCategory.type === type) {
                    total += transaction.amount;
                }
            }
            return total;
        }

        if (data) {
            setTotalExpense(calculateTotalByType("expense"));
            setTotalIncome(calculateTotalByType("income"));
        }
    }, [data]);

    if (!data) return (<Spinner></Spinner>);

    return (
        <div className="d-flex gap-2 justify-content-center">
            <Card>
                <Card.Header className="text-danger">
                    <Card.Title>Total Expense</Card.Title>
                </Card.Header>
                <Card.Body>
                    {totalExpense}
                </Card.Body>
            </Card>
            <Card>
                <Card.Header className="text-success">
                    <Card.Title>Total Income</Card.Title>
                </Card.Header>
                <Card.Body>
                    {totalIncome}
                </Card.Body>
            </Card>
        </div>
    );
}