import './App.css';
import { AuthProvider } from './AuthContext';
import Content from './main/Content';

function App() {
  return (
    <AuthProvider>
      <Content/>
    </AuthProvider>
  );
}

export default App;
