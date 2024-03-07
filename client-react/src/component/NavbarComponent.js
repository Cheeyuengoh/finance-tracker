import useAuthContext from "../hook/useAuthContext";
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";

export default function NavbarComponent() {
    const { user, dispatch } = useAuthContext();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const response = await fetch(process.env.REACT_APP_API_URI + "/api/user/logout", {
                method: "GET",
                credentials: "include"
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "NOT_AUTHENTICATED" });
                navigate("/login");
            } else {
                console.log(json.msg);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Navbar>
            <Navbar.Brand href="/">Finance Tracker</Navbar.Brand>
            <Nav className="w-100">
                <Nav.Item>
                    <Nav.Link href="/transactions">Transactions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/categories">Categories</Nav.Link>
                </Nav.Item>
                {
                    user ?
                        <Nav.Item className="ms-auto">
                            <Dropdown>
                                <Dropdown.Toggle>{user.email}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav.Item>
                        :
                        <Nav.Item className="ms-auto">
                            <Nav.Link href="/login">Login</Nav.Link>
                        </Nav.Item>
                }

            </Nav>
        </Navbar>
    );
}