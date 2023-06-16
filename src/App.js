import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';

function App() {

  const [problem, setProblem] = useState('');
  const [problemInput, setProblemInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [result, setResult] = useState('');
  const [x, setX] = useState(1);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const api_url = "http://localhost:8080/";

  const train = () => {
    setX(x+1);
    return fetch(api_url + "train", {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem: problem,
        problemInput: problemInput,
        expectedOutput: expectedOutput
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //testing if we need to iterate
      return fetch(api_url + "execute", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: problemInput
        })
      })
      .then((response) => response.json())
      .then((responseJson2) => {
        if(typeof JSON.parse(expectedOutput) === typeof responseJson2.result){
          alert("Finished with " + x + " iterations")
          setResult(responseJson.result);
        }
        else{
          console("Trying another iteration")
          train();
        }
      });
    });
  }

  const improve = () => {
    return fetch(api_url + "improve", {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem: problem,
        problemInput: problemInput,
        expectedOutput: expectedOutput
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      setResult(responseJson.result);
    });
  }

  const execute = () => {
    return fetch(api_url + "execute", {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      setOutput(responseJson.result);
    });
  }

  return (
    <div className="App">
      <h1>Training</h1>
      <header className="App-header">
        <div style={{display: 'flex',  width: '100%', flexDirection: 'row'}}>          
          <div style={{width: '50%', flex: 1, textAlign: 'left', padding: 15}}>
            Problem description: <br/>
            <textarea value={problem} onChange={
              function(event) {
                setProblem(event.target.value);
              }
            } id="problem" name="problem" rows="15" cols="50"></textarea>
          </div>
          <div style={{width: '50%', flex: 1, textAlign: 'left', padding: 15}}>
            Input Example: <span style={{fontSize: 8}}>(strings need quotes)</span><br/>
            <textarea value={problemInput} onChange={
              function(event) {
                setProblemInput(event.target.value);
              }
            }id="input" name="input" rows="15" cols="50"></textarea>
          </div>
        </div>
        <div  style={{display: 'flex',  width: '100%', flexDirection: 'row'}}>
          <div style={{width: '50%', flex: 1, textAlign: 'left', padding: 15}}>
            Expected Output: <br/>
            <textarea value={expectedOutput} onChange={
              function(event) {
                setExpectedOutput(event.target.value);
              }
            } id="output" name="output" rows="15" cols="50"></textarea>
          </div>
          <div style={{width: '50%', flex: 1, textAlign: 'left', padding: 15}}>
            Result Code: <br/>
            <textarea value={result} onChange={
              function(event) {
                setResult(event.target.value);
              }
            } id="result" name="result" rows="15" cols="50"></textarea>
          </div>
        </div>
        <div style={{display: 'flex',  width: '100%', flexDirection: 'row', alignContent: 'center', alignContent: 'center', justifyContent: 'center'}}>
          <button onClick={()=> {setX(0);train()}} type="button" style={{marginBottom: 25, marginRight: 25}}>Train</button> 
          <button onClick={improve} type="button" style={{marginBottom: 25}}>Improve</button> 
        </div>
        
      </header>
      <h1>Execute</h1>
      <header className="App-header">
        <div style={{display: 'flex',  width: '100%', flexDirection: 'row'}}>
          <div style={{width: '50%', flex: 1, textAlign: 'left', padding: 15}}>
            Input: <span style={{fontSize: 8}}>(strings need quotes)</span><br/>
            <textarea value={input} onChange={
              function(event) {
                setInput(event.target.value);
              }
            }id="input" name="input" rows="15" cols="50"></textarea>
          </div>
          <div style={{width: '50%', flex: 1, textAlign: 'left', padding: 15}}>
            Output: <br/>
            <textarea value={output} onChange={
              function(event) {
                setOutput(event.target.value);
              }
            }id="output" name="output" rows="15" cols="50"></textarea>
          </div>
        </div>
        
        <button onClick={execute} type="button" style={{marginBottom: 25}}>execute</button> 
        <br></br>
      </header>
    </div>
  );
}

export default App;
