import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function CreateCategoryComponent({ setData }) {
    const [show, setShow] = useState(false);
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [validated, setValidated] = useState(false);
    const { dispatch } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    function showModal() {
        setType("expense");
        setName("");
        setShow(true);
    }

    function hideModal() {
        setShow(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        async function createData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/category/create", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, type })
                });
                const json = await response.json();

                if (response.ok) {
                    setData((prevState) => {
                        let nextState = [...prevState];
                        nextState.push(json.data);
                        return nextState;
                    });
                    hideModal();
                } else {
                    if (json.msg === "no token provided") {
                        dispatch({ type: "NOT_AUTHENTICATED" });
                        navigate(`/login?redirect=${location.pathname.replace("/", "")}`);
                    }

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
                                createData();
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
            createData();
            setValidated(false);
        }

        setValidated(true);
    }

    return (
        <div>
            <Button onClick={showModal}>Create Category</Button>
            <Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Transaction Type</Form.Label>
                            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="inputName">Category Name</Form.Label>
                            <Form.Control id="inputName" type="text" required onChange={(e) => setName(e.target.value)}></Form.Control>
                            <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Button type="submit">Create</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}