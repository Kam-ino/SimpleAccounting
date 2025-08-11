import express from "express"
import dotenv from "dotenv";
import {initDB} from "./config/db.js";
import transactionsRoute from "./routes/transactionsRoute.js"

dotenv.config();

const app = express();

app.use(express.json());

app.use((req,res,next) => {
    console.log("Req incoming, method:",req.method)
    next()
});

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute); 

initDB().then(() => {
    app.listen(5001,() => {
        console.log("Server is up and running on PORT:",PORT);
    });
});

app.get("/", (req,res) => {
    res.send("It's working")
})


