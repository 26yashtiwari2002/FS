import express from "express";
import Connection from "./database/db.js";
import router from "./routes/api.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

app.use(cors());
app.use('/',router);


const __dirname=path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
Connection();
 