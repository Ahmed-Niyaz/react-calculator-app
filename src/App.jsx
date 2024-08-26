import { useState } from "react";
import Caldata from "./data";
import PropTypes from 'prop-types';

const operators = ["AC", "/", "*", "+", "-", "="];
const numbers = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export default function App() {
  const [input, setInput] = useState('0');
  const [output, setOutput] = useState('');
  
  
  function handleKeyPress(value) {
    
    const number = numbers.find(num => num === value);
    const operator = operators.find(op => op === value);
    
    switch(value) {
      case "AC": handleClear();
        break;
      case "=": submit();
        break;
      case number: handleNumbers(value);
        break;
      case operator: handleOperator(value);
        break;
      case '.': handleDotOp();
        break;
      default: break;
    }
  }
  
  function handleClear() {
    setInput('0');
    setOutput('');
  }
  
  function submit() {
    
    if (output.includes('=')) {
      return;
    }
    
    const lastChar = output[output.length - 1];
    
    if (operators.includes(lastChar)) {
      const newOutput = output.slice(0, -1);
      const ans = eval(newOutput);

      setInput(ans);
      setOutput(newOutput + '=' + ans);
    }
    
    const ans = eval(output);
    
    setInput(ans);
    setOutput(prev => prev + '=' + ans);
    return; 
  }
  
  function handleNumbers(val) {
    
    const value = String(val);
    
    if (input === '0' && value === '0') {
      return;
    }
    
    if (input === '0' || input === 'DISPLAY LIMIT MET') {
      setInput(value);
      setOutput(value);
      return;
    }
    
    if (input === '-') {
      setInput(prev => prev + value);
      setOutput(prev => prev + value);
      return
    }
    
    if (operators.includes(input)) {
      setInput(value);
      setOutput(prev => prev + value);
      return
    }
    
    if (output.includes('=')) {
      setOutput(value);
      setInput(value);
      return;
    }
     
    if (input.length > 13) {
      setInput('DISPLAY LIMIT MET');
      return;
    }
    setInput(prev => prev + value);
    setOutput(prev => prev + value);
    return;
    
  }
  
  function handleOperator(value) {
    
    if (output === '0.') {
      return;
    }
    
    if (input === '0' && value === '-') {
      setInput(value);
      setOutput(value);
      return;
    }
    
    if (!output.length) {
      return;
    }
    
    // this checks if last char is a operator
    const lastChar = output[output.length - 1];
    
    if(operators.includes(lastChar)) {
      
      // if last char is * and value is -
      if (lastChar === '*' && value === '-') {
        setOutput(output + value);
        setInput(value);
        return;
      }
      
      const newOutput = output.slice(0, -1)
      
      setInput(value);
      setOutput(newOutput + value);
      return;
    }
    
    if (output.includes('=')) {
      const foundEqualIndex = output.indexOf('=');
      const newOutput = output.slice(foundEqualIndex + 1);
      
      setOutput(newOutput + value);
      setInput(value)
      return;
    }
    
    setInput(value);
    setOutput(prev => prev + value);
  }
  
  function handleDotOp() {
    
    if (output.includes('=')) {
      const foundEqualIndex = output.indexOf('=');
      const newOutput = output.slice(foundEqualIndex + 1);
      
      if (String(newOutput) === String(input)) {
        setInput('0.');
        setOutput('0.');
        return;
      }
      return;
    } 
    
    if (input === '0') {
      setInput('0.')
      setOutput('0.')
      return;
    }
    
    if (input.includes('.')) {
      return;
    }
  
    
    if (operators.includes(input)) {
      setInput('0.')
      setOutput(prev => prev + '0.')
      return;
    }
    
    setInput(prev => prev + '.');
    setOutput(prev => prev + '.');
  }
  
  
  
  
  return (
    <div className="calculator">
      <Display input={input} output={ output } />
      <Keys handleKeyPress={handleKeyPress} />
    </div>
  )
}

function Keys({ handleKeyPress }) {
  return (
    <div className="keys">
      {Caldata.map((key) => {
        const { id, value } = key;
        return <button onClick={() => handleKeyPress(value)} className="key" key={id} id={id}>{value}</button>
      })}
    </div>
  )
}

function Display({ input, output }) {
  return (

    <div className="display">
    <div className="formulaScreen">{ output }</div>
    <div className="outputScreen" id="display">{ input }</div>
    </div>
  )
}

Keys.propTypes = {
  handleKeyPress: PropTypes.func,
};