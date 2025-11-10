import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Layout>
        <Home />
      </Layout>
    </div>
  );
}

export default App;
