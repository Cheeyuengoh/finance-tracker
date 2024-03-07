import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

export default function UpdateTransactionComponent({ transaction, setData }) {
    const [categories, setCategories] = useState(null);
    const [show, setShow] = useState(false);
    const [type, setType] = useState(transaction.typeCategory.type);
    const [category, setCategory] = useState(transaction.typeCategory.name);
    const [amount, setAmount] = useState(transaction.amount);
    const [date, setDate] = useState(formatDate(transaction.date));
    const [validated, setValidated] = useState(false);
    const { dispatch } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/category/userCategories", {
                    method: "GET",
                    credentials: "include"
                });
                const json = await response.json();

                if (response.ok) {
                    const formattedCategories = {
                        expense: [],
                        income: []
                    };

                    for (const type in formattedCategories) {
                        for (const key in json.data) {
                            formattedCategories[type] = formattedCategories[type].concat(json.data[key].filter((category) => {
                                return category.type === type;
                            }));
                        }
                    }

                    setCategories(formattedCategories);
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
                                fetchCategories();
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

        if (!categories) fetchCategories();
    }, [categories, dispatch, location.pathname, navigate]);

    function formatDate(date) {
        let d = new Date(date);
        let month = (d.getMonth() + 1).toString();
        let day = d.getDate().toString();
        let year = d.getFullYear().toString();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }

    function showModal() {
        setType(transaction.typeCategory.type);
        setCategory(transaction.typeCategory.name);
        setAmount(transaction.amount);
        setDate(formatDate(transaction.date));
        setShow(true);
    }

    function hideModal() {
        setShow(false);
    }

    function handleKeyPress(e) {
        switch (e.key) {
            case "Backspace":
            case "Delete":
            case "Enter":
            case "ArrowLeft":
            case "ArrowRight":
            case ".":
                return;
            default:
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        async function updateData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/transaction/update", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        transactionId: transaction._id,
                        amount: amount,
                        type: type,
                        category: category,
                        date: date
                    })
                });
                const json = await response.json();

                if (response.ok) {
                    setData((prevState) => {
                        let nextState = [...prevState];
                        const index = nextState.findIndex((ele) => {
                            return ele._id === json.data._id;
                        });
                        nextState[index] = json.data;
                        return nextState;
                    });
                    hideModal();
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
                                updateData();
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

        const form = e.currentTarget;
        if (form.checkValidity()) {
            updateData();
            setValidated(false);
        }

        setValidated(true);
    }

    if (!categories) return (<Spinner></Spinner>);

    return (
        <div>
            <Button onClick={showModal}>
                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19,2a1,1,0,0,0-1,1V5.33A9,9,0,0,0,3,12a1,1,0,0,0,2,0A7,7,0,0,1,16.86,7H14a1,1,0,0,0,0,2h5a1,1,0,0,0,1-1V3A1,1,0,0,0,19,2Z"></path><path d="M20,11a1,1,0,0,0-1,1A7,7,0,0,1,7.11,17H10a1,1,0,0,0,0-2H5a1,1,0,0,0-1,1v5a1,1,0,0,0,2,0V18.67A9,9,0,0,0,21,12,1,1,0,0,0,20,11Z"></path></svg>
            </Button>
            <Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label htmlFor="inputType">Transaction Type</Form.Label>
                            <Form.Select id="inputType" value={type} required onChange={(e) => setType(e.target.value)}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="inputCategory">Category</Form.Label>
                            <Form.Select id="inputCategory" value={category} required onChange={(e) => setCategory(e.target.value)}>
                                {type && categories[type].map((category, index) => {
                                    return (
                                        <option key={index} value={category.name}>{category.name}</option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="inputAmount">Amount</Form.Label>
                            <Form.Control id="inputAmount" type="text" value={amount} required onKeyDown={handleKeyPress} onChange={(e) => setAmount(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="inputDate">Date</Form.Label>
                            <Form.Control id="inputDate" type="date" value={date} required onChange={(e) => setDate(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Button type="submit">Update</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}