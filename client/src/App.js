import React from 'react'
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
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from './components/Home'
import Criticism from './components/Criticism'
import News from './components/News'
import logo from './components/img/logo.png'

function App () {
  return (
    
  <Router>
      <Navbar bg="light" variant="light">
      <span ></span>
      <div className="container"><a><img src={logo} /></a>
      <div>
        <Container>
          <Nav>
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
      </Routes>
    </Router>
    
  );
}

export default App
