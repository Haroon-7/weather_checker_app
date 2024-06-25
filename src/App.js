import React from 'react';
import './App.css';
import Header from './components/Header';
import Weather from './components/Weather';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <Weather />
      </div>
      <Footer />
    </div>
  );
}

export default App;
