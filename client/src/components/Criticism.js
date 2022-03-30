import React from 'react'
import { useState, useRef, useEffect } from "react";
import {Navbar, Nav, Container, Row, Col, Button, Form, Modal,} from "react-bootstrap"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBRipple } from 'mdb-react-ui-kit';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import '../App.css'
import axios from 'axios'
import { storage } from "../firebase";

function Criticism ()  {
    const API_URL = process.env.REACT_APP_API_URL;

    const [show, setShow] = useState(false);
    const [modeAdd, setModeAdd] = useState(false);
    const [criticism, setCriticism] = useState([])
    const [fileName,setFileName] = useState(null)
    const [movieCriticism, setMovieCriticism] = useState({
        title: "",
        author: "",
        publicationDate: "",
        img : "",
        content: ""
    })
    const [Url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);

    //Input references
    const refTitle = useRef();
    const refAuthor = useRef();
    const refPublicationDate = useRef();
    const refContent = useRef();

    const handlePhoto = (e) => {
      if (e.target.files[0]) {
          setFileName(e.target.files[0]);
        }
  }

    useEffect (() => {
        const fetchNews = async () => {
            const res = await axios.get(`${API_URL}/criticism`)
            console.log(res)
            setCriticism(res.data)
        }
        fetchNews()
    }, [])

    const handleShowAdd = () => {
        setModeAdd(true);
        setShow(true);
    };

    const handleUpdate = (criticism) => {
      console.log("Update Criticism", criticism);
      console.log(criticism._id)
      criticism.current = criticism._id;

      setShow(true);
      setMovieCriticism(criticism);  
  }

    const handleClose = () => {
        setModeAdd(false);
        setShow(false);
        window.location.reload(true);
    };

    const handleShow = () => setShow(true);

    const handleDelete = (criticism) => {
        console.log(criticism);
        if (window.confirm(`Are you sure to delete ${criticism.title}?`)) {
          fetch(`${API_URL}/criticism/${criticism._id}`, {
            method: "DELETE",
            mode: "cors",
          })
            .then((res) => res.json())
            .then((json) => {     
              handleClose();
              window.location.reload(false);
            });
        }
      };
    
      const handleUpload = () => {
        const uploadTask = storage.ref(`newsImg/${fileName.name}`).put(fileName);
        uploadTask.on(
          "state_changed",
          snapshot => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          error => {
            console.log(error);
          },
          () => {
            storage
              .ref("newsImg")
              .child(fileName.name)
              .getDownloadURL()
              .then(Url => {
                setUrl(Url);
                if (modeAdd) {
                    //Add new news
                    const newCriticism = {
                        title: refTitle.current.value,
                        content: refContent.current.value,
                        author: refAuthor.current.value,
                        img: Url,
                        date: refPublicationDate.current.value,
                    }
                    console.log(newCriticism);
        
                    fetch(`${API_URL}/criticism`, {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        mode: "cors", // no-cors, *cors, same-origin
                        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                        // credentials: "same-origin", // include, *same-origin, omit
                        headers: {
                            "Content-Type": "application/json",
                            // "Content-Type":"multipart/form-data"
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: "follow", // manual, *follow, error
                        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                        body: JSON.stringify(newCriticism), // body data type must match "Content-Type" header
        
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            // Successfully added the product
                            console.log("POST Result", json);
                            criticism.push(json);
                            setCriticism(criticism)
                         
                            handleClose();
                        });
                } else {
                    // Update product
                    const updatedCriticism = {
                        _id: movieCriticism._id,
                        title: refTitle.current.value,
                        content: refContent.current.value,
                        author: refAuthor.current.value,
                        img: Url,
                        date: refPublicationDate.current.value,
                    };
                    console.log(updatedCriticism);
        
                    fetch(`${API_URL}/criticism`, {
                        method: "PUT", // *GET, POST, PUT, DELETE, etc.
                        mode: "cors", // no-cors, *cors, same-origin
                        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                        // credentials: "same-origin", // include, *same-origin, omit
                        headers: {
                            "Content-Type": "application/json",
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: "follow", // manual, *follow, error
                        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                        body: JSON.stringify(updatedCriticism), // body data type must match "Content-Type" header
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            // Successfully updated the product
                            console.log("PUT Result", json);
                            for (let i = 0; i < criticism.length; i++) {
                                if (criticism[i]._id === updatedCriticism._id) {
                                    console.log(criticism[i], updatedCriticism);
                                    criticism[i] = updatedCriticism;
                                    break;
                                }
                            }
                            setCriticism(criticism)
                            handleClose();
                            window.location.reload(true)
                        });
                console.log(Url)
              }});
          }
        );
      };

    return (
        <>
            <section className="featured-posts">
            <span></span>
            <div className='listing-header'>
                <h1 className='listing-title'> Movie Criticism</h1>
                <h1 className='listing-para'>The latest movie reviews on the movies you're most interested in seeing</h1>
            </div>

                <div>
                    <h2>
                        <span>
                            Latest Hot Reviews
                        </span>
                    </h2>
                </div>
                <div className="card-columns listfeaturedtag">
    
                <div className="App-logo">
                        
                        <Button variant="success"  onClick={handleShowAdd}>
                        <FaPlus style={{marginRight:"10px"}}/>
                            Add Criticism
                        </Button>
                    </div>

                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modeAdd ? "Add New Criticism" : "Update Criticiism"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>Title</Col>
                                <Col>
                                    <input type="text" ref={refTitle} defaultValue={movieCriticism.title} />
                                </Col>
                            </Row>

                            <Row>
                                <Col>Content</Col>
                                <Col>
                                    <input type="text" ref={refContent} defaultValue={movieCriticism.content} />
                                </Col>
                            </Row>

                            <Row>
                                    <Col>Image</Col>
                                    <Col >
                                        <input type="file" name="img" onChange={handlePhoto} />
                                    </Col>
                                </Row>

                            <Row>
                                <Col>Author</Col>
                                <Col>
                                    <input type="text" ref={refAuthor} defaultValue={movieCriticism.author} />
                                </Col>
                            </Row>

                            <Row>
                                <Col>Publication Date</Col>
                                <Col>
                                    <input type="date" ref={refPublicationDate} defaultValue={movieCriticism.publicationDate} />
                                </Col>
                            </Row>

                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpload}>
                            {modeAdd ? "Add" : "Update"}
                        </Button>
                    </Modal.Footer>

                </Modal>

                <div>
                {criticism.map((reviews) => (
                    <MDBCard>
                    <MDBCardBody className="row" key={reviews._id}>
                        <MDBCardImage className="col-md-4 wrapthumbnail" src={reviews.img}  style={{ objectFit: "cover", borderRadius: "10px 10px 0 0"}} fluid alt='...'/>
                        {/* <MDBCardImage src={newspaper.img} fluid alt='...' /> */}
                        <div className="col-md-6" >
                            <div className="card-block">
                                <h3>{reviews.title}</h3>
                                <h1 className="card-text">{reviews.content}</h1>
                                <h1 className="author-card"> By {reviews.author}</h1>
                                <h1 className="author-card">{reviews.publicationDate}</h1>
                                <FaPencilAlt onClick={() => handleUpdate(reviews) } />
                                <FaTrashAlt onClick={() => handleDelete(reviews)} />
                            </div>
                        </div>
                    </MDBCardBody>
                </MDBCard>
                 ))}
                </div>
              
            </div>
        </section>

    </>
    )


}

export default Criticism