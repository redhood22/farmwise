import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Weather from './pages/Weather'
import CropHealth from './pages/CropHealth'
import Practices from './pages/Practices'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/crop-health" element={<CropHealth />} />
        <Route path="/practices" element={<Practices />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App