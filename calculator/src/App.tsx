import { useEffect, useRef, useState } from 'react';
import './style.css';
import { Calculator, Key } from './calculator';

const keys: Key[] = [
  'C',
  '+/-',
  '%',
  '/',
  '7',
  '8',
  '9',
  '*',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '0',
  '.',
  '=',
];

function App() {
  const [value, setValue] = useState('0');
  const { current: calculator } = useRef(new Calculator());

  useEffect(() => {
    return calculator.on('change', setValue);
  }, []);

  return (
    <div className="calculator">
      <div className="screen">{value}</div>
      <div className="panel">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => calculator.press(k)}
            className={'button' + (k === '0' ? ' zero' : '')}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
