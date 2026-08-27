import './App.css'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Map from './pages/Map'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/map" element={<Map />}/>
        <Route path="/" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App