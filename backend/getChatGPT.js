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

  export default router.post("/", (req, res) => {
    try{

        const data = req.body.request;
        const type = req.body.request_type.toLowerCase();

        if(type == "image"){
          openAi.createImage({
            prompt: data,
            n: 1,
            size: "1024x1024"
          }).then(imgRes=>{
            const newImage = imgRes.data.data[0].url;
            console.log(newImage)
            return res.json(newImage)
          }).catch(err=>{
            throwError(err)
          })
        }
        if(type == "code"){
          openAi.c
          openAi.createCompletion({
            model: "text-davinci-002",
            prompt: data
          }).then(codeRes=>{
            const newCode = codeRes.data.choices[0].text;
            console.log(newCode)
            return res.json(newCode)
          }).catch(err=>{
            throwError(err)
          })
        }
        if(type == "chat"){
          openAi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: data}],
          }).then(chatRes=>{
            const newChat = chatRes.data.choices[0].message.content;
            console.log(newChat)
            return res.json(newChat)
          }).catch(err=>{
            throwError(err)
          })
        }
      
    } catch(err){
        throwError(err)
    }

    function throwError(err){
      let iAmError;
      if(err.response){
        const {status, data} = err.response;
        iAmError = `${status}: ${data}`;
      }else{
        iAmError = err
      }
      console.log(iAmError);
      throw new Error(iAmError)  
    }
  })

