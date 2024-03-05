import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Content from './main/Content';
import Ad from './main/ad/Ad';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/create-ad" element={<Ad />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;