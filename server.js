import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import notFound from "./src/utils/not-found.js";
import error from "./src/utils/error.js";

const app = express();
const PORT = 8000;
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter)

app.use(notFound)
app.use(error)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})