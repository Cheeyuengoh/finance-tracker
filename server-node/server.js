const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserRouter = require("./router/UserRouter");
const TransactionRouter = require("./router/TransactionRouter");
const CategoryRouter = require("./router/CategoryRouter");

const app = express();

//Middlewares
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers
app.use("/api/user", UserRouter);
app.use("/api/transaction", TransactionRouter);
app.use("/api/category", CategoryRouter);

mongoose.connect(process.env.MONGODB_URI, { dbName: "finance-tracker" })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log("Server started running on port:", process.env.PORT);
        })
    })
    .catch((error) => {
        console.log(error);
    });
