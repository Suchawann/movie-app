import { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Button, Form, Modal, Card } from "react-bootstrap";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBRipple } from 'mdb-react-ui-kit';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import '../App.css'
import Princess from './img/Kirsten.jpg'
import axios from 'axios'
import { storage } from "../firebase";

export default function News() {
    const API_URL =  process.env.REACT_APP_API_URL;

    const [show, setShow] = useState(false);
    const [modeAdd, setModeAdd] = useState(false);
    const [news, setNews] = useState([])
    const [fileName,setFileName] = useState(null)
    const [movieNews, setMovieNews] = useState({
        title: "",
        desc: "",
        author: "",
        time: "",
        date: "",
        img: ""
    })
    const [Url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);

    //Input references
    const refTitle = useRef(null);
    const refDesc = useRef(null);
    const refDate = useRef(null);
    const refTime = useRef(null);
    const refAuthor = useRef(null);

    const handlePhoto = (e) => {
        if (e.target.files[0]) {
            setFileName(e.target.files[0]);
          }
    }

    useEffect(() => {
        const fetchNews = async () => {
            const res = await axios.get(`${API_URL}/news`)
            console.log(res)
            setNews(res.data)
        }
        fetchNews()
    }, [])


    const handleShowAdd = () => {
        setModeAdd(true);
        setShow(true);
    };

    const handleUpdate = (news) => {
        console.log("Update News", news);
        console.log(news._id)
        news.current = news._id;

        setShow(true);
        setMovieNews(news);  
    }

    const handleClose = () => {
        setModeAdd(false);
        setShow(false);
        window.location.reload(true);
    };

    const handleShow = () => setShow(true);

    const handleDelete = (news) => {
        console.log(news);
        if (window.confirm(`Are you sure to delete ${news.title}?`)) {
            fetch(`${API_URL}/news/${news._id}`, {
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
                    const newNews = {
                        title: refTitle.current.value,
                        desc: refDesc.current.value,
                        author: refAuthor.current.value,
                        img: Url,
                        date: refDate.current.value,
                        time: refTime.current.value
                    }
                    console.log(newNews);
        
                    fetch(`${API_URL}/news`, {
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
                        body: JSON.stringify(newNews), // body data type must match "Content-Type" header
        
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            // Successfully added the product
                            console.log("POST Result", json);
                            news.push(json);
                            setNews(news)
                         
                            handleClose();
                        });
                } else {
                    // Update product
                    const updatedNews = {
                        _id: movieNews._id,
                        title: refTitle.current.value,
                        desc: refDesc.current.value,
                        author: refAuthor.current.value,
                        date: refDate.current.value,
                        img: Url,
                        time: refTime.current.value
                    };
                    console.log(updatedNews);
        
                    fetch(`${API_URL}/news`, {
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
                        body: JSON.stringify(updatedNews), // body data type must match "Content-Type" header
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            // Successfully updated the product
                            console.log("PUT Result", json);
                            for (let i = 0; i < news.length; i++) {
                                if (news[i]._id === updatedNews._id) {
                                    console.log(news[i], updatedNews);
                                    news[i] = updatedNews;
                                    break;
                                }
                            }
                            setNews(news)
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
                    <h1 className='listing-title'> Movie News</h1>
                    <h1 className='listing-para'>The latest movie news on the movies you're most interested in seeing</h1>
                </div>

                <div>
                    <h2>
                        <span>
                            Latest Hot News
                        </span>
                    </h2>
                </div>
 
                <div className="card-columns listfeaturedtag">
                    <div style={{ marginBotton: '20px' }}>
                        <h1 className="App-header">Kirsten Stewart On How Spencer Helped Her Understand Mental Health Struggles</h1>
                        <img className='thumb-nail' src={Princess} />
                        <p>Spencer's Kirsten Stewart spotlights mental health in a public statement, making the most of awards season following her Academy Award nomination</p>
                        <h1 className="author">By Frank Abagnail</h1>
                        <h1 className="author">22 July 2017 | Only 6 min read </h1>
                    </div>

                    <div className="App-logo">
                        
                        <Button variant="success"  onClick={handleShowAdd} encType="multipart/form-data" >
                        <FaPlus style={{marginRight:"10px"}}/>
                            Add News
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
                                {modeAdd ? "Add New News" : "Update News"}
                                
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form>
                                <Row>
                                    <Col>Title</Col>
                                    <Col>
                                        <input type="text" ref={refTitle} defaultValue={movieNews.title} />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Image</Col>
                                    <Col >
                                        <input type="file" name="img" onChange={handlePhoto} />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Description</Col>
                                    <Col>
                                        <input type="text" ref={refDesc} defaultValue={movieNews.desc} />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Author</Col>
                                    <Col>
                                        <input type="text" ref={refAuthor} defaultValue={movieNews.author} />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Date</Col>
                                    <Col>
                                        <input type="date" ref={refDate} defaultValue={movieNews.date} />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Time</Col>
                                    <Col>
                                        <input type="time" ref={refTime} defaultValue={movieNews.time} />
                                    </Col>
                                </Row>
                            </Form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleUpload} >
                                {modeAdd ? "Add" : "Update"}
                                
                            </Button>
                        </Modal.Footer>

                    </Modal>

                    <div>
                        {news.map((newspaper) => (
                            <MDBCard>
                                <MDBCardBody className="row" key={newspaper._id}>
                                    <MDBCardImage className="col-md-4 wrapthumbnail" src={newspaper.img}  style={{ objectFit: "cover", borderRadius: "10px 10px 0 0"}} fluid alt='...'/>
                                    {/* <MDBCardImage src={newspaper.img} fluid alt='...' /> */}
                                    <div className="col-md-6" >
                                        <div className="card-block">
                                            <h3>{newspaper.title}</h3>
                                            <h1 className="card-text">{newspaper.desc}</h1>
                                            <h1 className="author-card">By {newspaper.author}</h1>
                                            <h1 className="author-card">{newspaper.date} |  {newspaper.time} </h1>
                                            <FaPencilAlt onClick={() => handleUpdate(newspaper) } />
                                            <FaTrashAlt onClick={() => handleDelete(newspaper)} />
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

