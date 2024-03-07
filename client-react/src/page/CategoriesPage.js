import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../hook/useAuthContext";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import CreateCategoryComponent from "../component/CreateCategoryComponent";
import DeleteCategoryComponent from "../component/DeleteCategoryComponent";
import UpdateCategoryComponent from "../component/UpdateCategoryComponent";

export default function CategoriesPage() {
    const [data, setData] = useState(null);
    const { dispatch } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URI + "/api/category/userCategories", {
                    method: "GET",
                    credentials: "include"
                });
                const json = await response.json();

                if (response.ok) {
                    setData(json.data.userCreated);
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
            <CreateCategoryComponent setData={setData}></CreateCategoryComponent>
            <Table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((category, index) => {
                        return (
                            <tr key={index}>
                                <td>{category.type}</td>
                                <td>{category.name}</td>
                                <td className="d-flex gap-2">
                                    <UpdateCategoryComponent category={category} setData={setData}></UpdateCategoryComponent>
                                    <DeleteCategoryComponent category={category} setData={setData}></DeleteCategoryComponent>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}