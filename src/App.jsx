import './App.css';

import KattDesigner from './pages/KattDesigner.jsx';
import EyePlot from './pages/EyePlot.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuBar from './components/MenuBar/MenuBar';
import ContactLensWidgets from './pages/ContactLensWidgets.jsx';
import MultiCurveDesigner from './pages/MultiCurveDesigner.jsx';

function App() {
  return (
    <Router>
      <MenuBar />
      <Routes>
        <Route path="/" element={<ContactLensWidgets />} />
        <Route path="/katt-designer" element={<KattDesigner />} />
        <Route path="/multi-curve-designer" element={<MultiCurveDesigner />} />
        <Route path="/eye-model" element={<EyePlot />} />
      </Routes>
    </Router>
  );
}

export default App;
