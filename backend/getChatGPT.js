// =================== packages and configurations
import express from "express";
const router = express.Router();

import apiKey from "./apiKey.js";
import { Configuration, OpenAIApi } from "openai";

const openAi = new OpenAIApi(
    new Configuration({
      apiKey: apiKey,
    })
  )

  // =================== script

  export default router.post("/", async (req, res) => {
    try{

        const data = req.body.value;
        
        const response = await openAi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: data}],
        });
        const getResponse = response.data.choices[0].message.content
        console.log(getResponse)
        return res.json(getResponse);
    } catch(err){
        throw new Error(err);
    }
  })