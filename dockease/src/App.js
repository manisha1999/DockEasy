
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import Home from './Components/Home/Home'
import TerminalComponent from './Components/TerminalComponent/TerminalComponent'
function App() {
  
    
    const params = useParams();
  
    console.log("params",  params.containerId); // 👉️ {userId: '4200'}
  
   
  return (
    <div className="App">
       <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        {/* <Route exact path="/:containerId" element = {<TerminalComponent/>}/> */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
