import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import WithoutNavbarLayout from "./layout/WithoutNavbarLayout";
import WithNavbarLayout from "./layout/WithNavbarLayout";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import DashboardPage from "./page/DashboardPage";
import TransactionsPage from "./page/TransactionsPage";
import CategoriesPage from "./page/CategoriesPage";

function App() {
  return (
    <div className="m-4">
      <Routes>
        <Route element={<WithoutNavbarLayout />}>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
        </Route>
        <Route element={<WithNavbarLayout />}>
          <Route index element={<DashboardPage />}></Route>
          <Route path="/transactions" element={<TransactionsPage />}></Route>
          <Route path="/categories" element={<CategoriesPage />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
