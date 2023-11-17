import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componentes/navbar';
import Articulos from './componentes/articulos';
import LoginPage from './componentes/firebase/login';
import Clientes from './componentes/clientes';
import TemplateDemo from './componentes/timeLine';

function App() {
  return (
    <div>
      <Router>
      <Navbar />
        <Routes>
        <Route path='/' element={<><LoginPage/><TemplateDemo/></>}/>
          <Route path='/componentes/articulos' element={<Articulos/>}/>
          <Route path='/componentes/clientes' element={<Clientes/>}/>
        </Routes>
      </Router>
      
      
    </div>

  );
}

export default App;
