import { useEffect } from 'react';
import CanvasComponent from './components/CanvasComponent';
import Header from './components/Header';

function App() {


  return (
    <div className='app'>
      <Header />
      <div className='app-slogan'>
        <h1 className='slogan'>Claim your quota</h1>
        <button className='btn app-btn'>Check</button>
      </div>
      <CanvasComponent />
    </div>
  )
}

export default App