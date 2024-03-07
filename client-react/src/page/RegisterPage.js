import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity()) {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/user/create", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });
                const json = await response.json();

                if (response.ok) {
                    dispatch({ type: "AUTHENTICATED", payload: json.data });

                    navigate("/");
                } else {
                    console.log(json.msg);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setValidated(false);
            }
        }

        setValidated(true);
    }

    return (
        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
            <Card>
                <Card.Header>
                    <Card.Title>Register</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label htmlFor="inputEmail">Email</Form.Label>
                            <Form.Control id="inputEmail" type="email" required onChange={(e) => setEmail(e.target.value)}></Form.Control>
                            <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="inputPassword">Password</Form.Label>
                            <Form.Control id="inputPassword" type="password" required onChange={(e) => setPassword(e.target.value)}></Form.Control>
                            <Form.Control.Feedback type="invalid">Please provide a valid password</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Button type="submit">Register</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Card.Text>Login <Link to="/login">here</Link></Card.Text>
                </Card.Footer>
            </Card>
        </div>
    );
}