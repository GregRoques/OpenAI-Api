import express from 'express';
const app = express();
import cors from "cors";
import helmet from "helmet";

import chatGPT from "./getChatGPT.js";

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", chatGPT);

const PORT = 2000;
app.listen(PORT, () => {
  console.log("Listening on ", PORT);
});