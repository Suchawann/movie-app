import { useState, useRef, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Navbar,
    Nav,
    Container,
    Row,
    Col,
    Button,
    Form,
  } from "react-bootstrap";
import { useLocalStorage } from "react-use";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from './components/Home'
import { Login } from "./components/Login";
import Criticism from './components/Criticism'
import News from './components/News'
import logo from './components/img/logo.png'

const API_URL = process.env.REACT_APP_API_URL;

function App () {
  const [user, setUser] = useState();

  const handleLogin = (data) => {
    console.log('handleLogin',data)
    fetch(`${API_URL}/users/login`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        window.alert("Error:"+data.error)
      } else {
        window.alert("Welcome "+data.name)
        console.log(data)
      }
    })
    ;
  };

  return ( 
  <Router>
      <Navbar bg="light" variant="light">
      <span ></span>
      <div className="container"><a><img src={logo} /></a>
      <div>
        <Container>
          <Nav>
            <Nav.Link href="/">Login</Nav.Link>
            <Nav.Link href="/react-movie">Home</Nav.Link>
            <Nav.Link href="/react-movie/news">News</Nav.Link>
            <Nav.Link href="/react-movie/criticism">
              Criticism
            </Nav.Link>
          </Nav>
        </Container>
        </div>
        </div>
      </Navbar>

      <Routes>
        <Route
          path="/react-movie/criticism"
          element={<Criticism />}
        />

        <Route path="/react-movie/news" element={<News />} />
        <Route path="/react-movie" element={<Home />} />

        <Route
          path="/"
          element={
           <Container>
              {user ? (
                <div>Hello {user.name}</div>
              ) : (
                <Login onLogin={handleLogin} />
              )}
            </Container>
          }
        />
        
      </Routes>
    </Router>
    
  );
}

export default App
