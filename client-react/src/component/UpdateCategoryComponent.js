import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

export default function UpdateCategoryComponent({ category, setData }) {
    const [show, setShow] = useState(false);
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [validated, setValidated] = useState(false);
    const { dispatch } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    function showModal() {
        setType(category.type);
        setName(category.name);
        setShow(true);
    }

    function hideModal() {
        setShow(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        async function updateData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/category/update", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        categoryId: category._id,
                        name: name,
                        type: type
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

    return (
        <div>
            <Button onClick={showModal}>
                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19,2a1,1,0,0,0-1,1V5.33A9,9,0,0,0,3,12a1,1,0,0,0,2,0A7,7,0,0,1,16.86,7H14a1,1,0,0,0,0,2h5a1,1,0,0,0,1-1V3A1,1,0,0,0,19,2Z"></path><path d="M20,11a1,1,0,0,0-1,1A7,7,0,0,1,7.11,17H10a1,1,0,0,0,0-2H5a1,1,0,0,0-1,1v5a1,1,0,0,0,2,0V18.67A9,9,0,0,0,21,12,1,1,0,0,0,20,11Z"></path></svg>
            </Button>
            <Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Category</Modal.Title>
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
                            <Form.Label htmlFor="inputName">Category Name</Form.Label>
                            <Form.Control id="inputName" type="text" value={name} required onChange={(e) => setName(e.target.value)}></Form.Control>
                            <Form.Control.Feedback type="invalid">Please provide a valid category name</Form.Control.Feedback>
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