import express from "express";
import bodyParser from 'body-parser';
import { ChatGPTAPI } from 'chatgpt'
import cache from 'memory-cache';
import fs from 'fs';

const app = express();

app.on('uncaughtException', function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

const sDUrl = 'http://127.0.0.1:7860/sdapi/v1/txt2img';

const openAIToken = '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';

const api = new ChatGPTAPI({
  apiKey: openAIToken
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json())

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.listen(8080, () => {
  console.log("Project is running!");
}).setTimeout(500000000);

app.get("/", (req, res) => {
  res.send("ProblemSolverBot running");
})

app.post("/train", (req, res) => {

  console.log("We got a request", req.body);

  const problem = req.body.problem;
  const problemInput = req.body.problemInput;
  const expectedOutput = req.body.expectedOutput;

  let content = "Please generate a javascript code of a function called resultFunc with an input for " + problem + 
    ". Suppose the input is: " + problemInput + ". The expected output would be: " + expectedOutput + 
    ", give me the code only with no explanation or additional text (no intro, no explanation, no apologies, no conclusion, just the code), no example use, some comments in the code are accepted, with no imports of external libraries";

  console.log("Sending text to ChatGPT: " + content);

  api.sendMessage(content, {
    conversationId: cache.get('conversationId'),
    parentMessageId: cache.get('messageId')
  }).then(function(response) {
    //send message to ChatGPT
    cache.put('conversationId', response.conversationId);  //save conversation follow up
    cache.put('messageId', response.id);  //save conversation follow up (pre. message)

    console.log(response.text);

    let responseText = response.text.replaceAll("```javascript","").replaceAll("```js","").replaceAll("```","");

    if(!responseText.includes("export default")) {
      if(responseText.includes("async function")) {
        responseText = responseText.replaceAll("async function", "export default async function")
      } else {
        responseText = responseText.replaceAll("function", "export default function")
      }
    }

    // Save algorithm to a file
    fs.writeFileSync('algorithm.js', responseText);

    res.send({"result": responseText});  //send message to discord chat
  });  
})

app.post("/improve", (req, res) => {

  console.log("We got a request", req.body);

  const problem = req.body.problem;
  const problemInput = req.body.problemInput;
  const expectedOutput = req.body.expectedOutput;

  let content = "It didn't work, can you improve it? Please generate a javascript code of a function called resultFunc with an input for " + problem + ". Suppose the input is: " + problemInput + ". The expected output would be: " + expectedOutput + ", give me the code only with no explanation or additional text (no intro, no explanation, no apologies, no conclusion, just the code), no example use, some comments in the code are accepted, with no imports of external libraries";

  console.log("Sending text to ChatGPT: " + content);

  api.sendMessage(content, {
    conversationId: cache.get('conversationId'),
    parentMessageId: cache.get('messageId')
  }).then(function(response) {
    //send message to ChatGPT
    cache.put('conversationId', response.conversationId);  //save conversation follow up
    cache.put('messageId', response.id);  //save conversation follow up (pre. message)

    console.log(response.text);

    let responseText = response.text.replaceAll("```js","").replaceAll("```javascript","").replaceAll("```","");

    if(!responseText.includes("export default")) {
      if(responseText.includes("async function")) {
        responseText = responseText.replaceAll("async function", "export default async function")
      } else {
        responseText = responseText.replaceAll("function", "export default function")
      }
    }

    // Save algorithm to a file
    fs.writeFileSync('algorithm.js', responseText);

    res.send({"result": responseText});  //send message to discord chat
  });  
})

app.post("/execute", (req, res) => {

  console.log("We got a request", req.body);

  const input = req.body.input;

  import('./algorithm.js?foo=' + new Date()).then(function (resultFunc) {
    console.log(resultFunc);
    // Run the algorithm and get the result
    const result = resultFunc.default(JSON.parse(input));

    if(result && result.then) {
      result.then((resultP) => {
        console.log("Result: ", resultP)

        res.send({"result": resultP});
      })
    } else {
      console.log("Result: ", result)

      res.send({"result": result});
    }
  })  
  
})