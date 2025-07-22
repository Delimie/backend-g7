import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import notFound from "./src/utils/not-found.js";
import error from "./src/utils/error.js";
import groupRouter from "./src/routes/groups.route.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter)
app.use('/groups', groupRouter)

app.use(notFound)
app.use(error)

export default app;