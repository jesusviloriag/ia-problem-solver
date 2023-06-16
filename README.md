# ia-problem-solver
An AI that uses ChatGPT to solve problems by creating Javascript codes and then executing them

Crawl webpages
![alt text](https://i.imgur.com/giUiQZI.png)
Mathematical operations
![alt text](https://i.imgur.com/8yyfFTz.png)

## Installation

Web Client
```
npm install
```
AI Server
```
cd server
npm install
```
Add your OpenAI API Key here:
/server/index.js line 16
```
const openAIToken = '<your API key>';
```

## Usage

To start the project:

Web Client
```
npm start
```
AI Server
```
cd server
npm start
```

You start by describing the problem, the input format and the expected output format. Then click the "train" button. You can improve the solution by clicking the "improve" button.

After a code appears in the "Result" section the you can go to the "Execute" part to execute the code with different inputs.

## License

MIT

---
