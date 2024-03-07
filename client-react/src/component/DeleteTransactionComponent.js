import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function DeleteTransactionComponent({ transaction, setData }) {
    const [show, setShow] = useState(false);
    const { dispatch } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    function showModal() {
        setShow(true);
    }

    function hideModal() {
        setShow(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        async function deleteData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/transaction/delete", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ transactionId: transaction._id })
                });
                const json = await response.json();

                if (response.ok) {
                    setData((prevState) => {
                        let nextState = [...prevState];
                        const index = nextState.findIndex((ele) => {
                            return ele._id === json.data._id;
                        });
                        nextState.splice(index, 1);
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
                                deleteData();
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

        deleteData();
    }

    return (
        <div>
            <Button onClick={showModal}>
                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z" /></svg>
            </Button>
            <Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="d-flex flex-column">
                            <Form.Text>Are you sure you want to delete this transaction?</Form.Text>
                            <Form.Text>Transaction Type: {transaction.typeCategory.type}</Form.Text>
                            <Form.Text>Category Name: {transaction.typeCategory.name}</Form.Text>
                            <Form.Text>Amount: {transaction.amount}</Form.Text>
                            <Form.Text>Amount: {new Date(transaction.date).toLocaleDateString()}</Form.Text>
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Button type="submit">Delete</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}