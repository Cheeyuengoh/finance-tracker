import NavbarComponent from "../component/NavbarComponent";
import { Outlet } from "react-router-dom";

export default function WithNavbarLayout() {
    return (
        <div>
            <NavbarComponent />
            <Outlet />
        </div>
    );
}