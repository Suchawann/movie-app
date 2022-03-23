import { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Button, Form, Modal, Card } from "react-bootstrap";
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import '../App.css'
import Princess from './img/Kirsten.jpg'
import axios from 'axios'

export default function News() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [show, setShow] = useState(false);
    const [modeAdd, setModeAdd] = useState(false);
    const [news, setNews] = useState([])
    const [movieNews, setMovieNews] = useState({
        title: "",
        desc: "",
        author: "",
        time: "",
        image: "",
        date: ""
    })

    //Input references
    const refId = useRef();
    const refTitle = useRef();
    const refDesc = useRef();
    const refDate = useRef();
    const refTime = useRef();
    const refImage = useRef();
    const refAuthor = useRef();

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
        news.current = news.title;
        setShow(true);
        setMovieNews(news);  
    }

    const handleClose = () => {
        setModeAdd(false);
        setShow(false);
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
                });
        }
    };

    const handleFormAction = () => {
        if (modeAdd) {
            //Add new news
            const newMovie = {
                id: refId.current.value,
                title: refTitle.current.value,
                desc: refDesc.current.value,
                author: refAuthor.current.value,
                image: refImage.current.value,
                date: refDate.current.value,
                time: refTime.current.value
            }
            console.log(newMovie);

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
                body: JSON.stringify(newMovie), // body data type must match "Content-Type" header

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
                });
        }
    }


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
                            Latest
                        </span>
                    </h2>
                </div>
                <div className="card-columns listfeaturedtag">
                    <div style={{ marginBotton: '20px' }}>
                        <h1 className="App-header">Kirsten Stewart On How Spencer Helped Her Understand Mental Health Struggles</h1>
                        <img className='thumb-nail' src={Princess} />
                        <p>Spencer's Kirsten Stewart spotlights mental health in a public statement, making the most of awards season following her Academy Award nomination</p>
                        <h3 className="author"><a href="author.html"> By Frank Abagnail</a></h3>
                        <h3 className="author">22 July 2017 | Only 6 min read </h3>
                    </div>

                    <div className="App-logo">
                        <FaPlus onClick={handleShowAdd} encType="multipart/form-data"/>
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
                                        <input type="file" ref={refImage} defaultValue={movieNews.image} />
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
                            <Button variant="primary" onClick={handleFormAction}>
                                {modeAdd ? "Add" : "Update"}
                            </Button>
                        </Modal.Footer>

                    </Modal>

                    <div>
                        {news.map((newspaper) => (
                            <Card className="card">

                                <Card.Body className="row" key={newspaper._id}>
                                    <img className="col-md-4 wrapthumbnail" src={newspaper.img}/>
                                     {/* </Card.Img> */}
                                    

                                    <div className="col-md-6" >
                                        <div className="card-block">
                                            <h3>{newspaper.title}</h3>
                                            <h1 className="card-text">{newspaper.desc}</h1>
                                            <h1 className="author-card"><a href="author.html"> By {newspaper.author}</a></h1>
                                            <h1 className="author-card">{newspaper.date} |  {newspaper.time} </h1>
                                            <FaPencilAlt onClick={() => handleUpdate(newspaper) } />
                                            <FaTrashAlt onClick={() => handleDelete(newspaper)} />
                                        </div>
                                    </div>
                                </Card.Body>

                            </Card>
                        ))}
                        
                    </div>
                    

                </div>
            </section>
           
        </>
    )


}

