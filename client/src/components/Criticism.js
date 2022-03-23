import React from 'react'
import { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import '../App.css'
import Princess from './img/Kirsten.jpg'
import Tinder from './img/tinder-swindler-movie-poster.jpg'
import SpiderMan from './img/no-way-home.jpg'
import Look from './img/MoviePoster.jpg'
import ThirtyNine from './img/39.jpg'
import axios from 'axios'

function Criticism ()  {
    const API_URL = process.env.REACT_APP_API_URL;

    const [show, setShow] = useState(false);
    const [newsRows, setNewsRows] = useState([]);
    const [modeAdd, setModeAdd] = useState(false);
    const [modeUpdate, setModeUpdate] = useState(false);
    const [news, setNews] = useState([])
    const [movieNews, setMovieNews] = useState({
        title: "",
        desc : "",
        author: "",
        time: "",
        image : "",
        date: ""
    })

    //Input references
    const refTitle = useRef();
    const refDesc = useRef();
    const refDate = useRef();
    const refTime = useRef();
    const refImage = useRef();
    const refAuthor = useRef();

    useEffect (() => {
        const fetchNews = async () => {
            const res = await axios.get(API_URL)
            console.log(res)
            setNews(res.data)
        }
        fetchNews()
    }, [])

    useEffect(() => {
        fetch(`${API_URL}`)
          .then((res) => res.json())
          .then((data) => {
            const rows = data.map((e, i) => {
              return (
                <tr key={i}>
                  <td>
                    <FaPencilAlt
                      onClick={() => {
                        handleUpdate(e);
                      }}
                    />
                    &nbsp;
                    <FaTrashAlt
                      onClick={() => {
                        handleDelete(e);
                      }}
                    />
                  </td>
                  <td>{e.title}</td>
                  <td>{e.desc}</td>
                  <td>{e.image}</td>
                  <td>{e.author}</td>
                  <td>{e.time}</td>
                  <td>{e.date}</td>
                </tr>
              );
            });
            setNews(data);
            setNewsRows(rows);
          });
      }, []);

    const handleShowAdd = () => {
        setModeAdd(true);
        setShow(true);
    };

    const handleShowUpdate = () => {
        setModeUpdate(true);
        setShow(true);
    }
    
    const handleClose = () => {
        setModeAdd(false);
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleDelete = (news) => {
        console.log(news);
        if (window.confirm(`Are you sure to delete ${news.title}?`)) {
          fetch(`${API_URL}/${news._id}`, {
            method: "DELETE",
            mode: "cors",
          })
            .then((res) => res.json())
            .then((json) => {     
              handleClose();
            });
        }
      };

      const handleUpdate = (news) => {
        console.log("Update News", news);
        console.log(refTitle);
        refTitle.current = news.title;
    
        setShow(true);
        setMovieNews(news);
      };

    const handleFormAction = () => {
        if (modeAdd) {
            //Add new news
            const newMovie = {
                title : refTitle.current.value,
                desc : refDesc.current.value,
                author: refAuthor.current.value,
                image: refImage.current.value,
                date: refDate.current.value,
                time: refTime.current.value
            }
            console.log(newMovie);

            fetch(`${API_URL}`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                  "Content-Type": "application/json",
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
                  const rows = news.map((e, i) => {
                    return (
                        <tr key={i}>
                            <td>
                                <FaPencilAlt
                                    onClick={() => {
                                        handleUpdate(e);
                                    }}
                                />
                                &nbsp;
                                <FaTrashAlt
                                    onClick={() => {
                                        handleDelete(e);
                                    }}
                                />
                            </td>
                        </tr>
                    )
                  });
        
                  setNews(news);
                //   setProductRows(rows);
                  handleClose();
                });
        }  else if (modeUpdate) {
            // Update product
            const updatedNews = {
              _id: news._id,
              title : refTitle.current.value,
              desc : refDesc.current.value,
              author: refAuthor.current.value,
              date: refDate.current.value,
              time: refTime.current.value
            };
            console.log(updatedNews);
      
            fetch(`${API_URL}`, {
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
      
                const newmovie = news.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <FaPencilAlt
                          onClick={() => {
                            handleUpdate(e);
                          }}
                        />
                        &nbsp;
                        <FaTrashAlt
                          onClick={() => {
                            handleDelete(e);
                          }}
                        />
                      </td>

                    </tr>
                  );
                });
      
                setNews(newmovie);
                // setProductRows(rows);
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
                <div style={{marginBotton:'20px'}}>
                    <h1 className="App-header">Kirsten Stewart On How Spencer Helped Her Understand Mental Health Struggles</h1>
                    <img className='thumb-nail' src={Princess}/>
                    <p>Spencer's Kirsten Stewart spotlights mental health in a public statement, making the most of awards season following her Academy Award nomination</p>
                        <h1 className="author"><a href="author.html"> By Frank Abagnail</a></h1>
                        <h1 className="author">22 July 2017 | Only 6 min read </h1>       
                </div>

                <div className="App-logo">
                    <FaPlus onClick={handleShowAdd}/>
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
                {news.map((newspaper, index) => (
                    <div className="card">
                
                        <div className="row" key={index}>
                                <div className="col-md-4 wrapthumbnail">
                                    <a><img className="img-size" src={newspaper.img}/> </a>
                                </div>
                            
                                <div className="col-md-6" >
                                    <div className="card-block">
                                        <h3>{newspaper.title}</h3>
                                        <h1 className="card-text">{newspaper.desc}</h1>
                                        <h1 className="author-card"><a href="author.html"> By {newspaper.author}</a></h1>
                                        <h1 className="author-card">{newspaper.date} |  {newspaper.time} </h1> 
                                            <FaPencilAlt onClick={handleShowUpdate}/>
                                        
                                            .
                                            &nbsp;
                                            <FaTrashAlt onClick={handleDelete}/>
                                    </div>
                                </div>
                        </div>
                    
                    </div>
                 ))}
                </div>
              

            {/* <div className="card">
			    <div className="row">
                    <div className="col-md-4 wrapthumbnail">
                        <a><img className='img-size' src={Look}/></a>
                    </div>
                    <div className="col-md-6">
                        <div clasName="card-block">
                            <h3><a>Can Works Like "Don’t Look Up" Get Us Out of Our Heads?</a></h3>
                            <h1 className="card-text">In the doomsday smash and Bo Burnham’s pandemic musical “Inside,” themes of climate change, digital distraction and inequality merge and hit home.</h1>
                            <h1 className="author-card"><a href="author.html"> By Maya Salam</a></h1>
                            <h1 className="author-card">23 Jan 2022 | 8 mins read </h1> 
                        </div>
                    </div>
			    </div>
		    </div> */}

            {/* <div className="card">
			    <div className="row">
                    <div className="col-md-4 wrapthumbnail">
                        <a><img className='img-size' src={Tinder}/></a>
                    </div>
                    <div className="col-md-6">
                        <div className="card-block">
                            <h3><a>Where Is Simon Leviev From The Tinder Swindler Now?</a></h3>
                            <h1 className="card-text">Simon Leviev is no longer on Tinder, but he is a free man. Here's what he's been up to since the release of Netflix's true-crime documentary</h1>
                            <h1 className="author-card"><a href="author.html"> By Kelsie Gibson</a></h1>
                            <h1 className="author-card">01 Mar 2022 | 8 mins read </h1> 
                        </div>
                    </div>
			    </div>
		    </div>

            <div className="card">
                <div className="row">
                    <div className="col-md-4 wrapthumbnail">
                        <a><img className='img-size' src={ThirtyNine}/></a>
                    </div>
                    <div className="col-md-6">
                        <div className="card-block">
                            <h3><a>“Thirty-Nine” To Go On Hiatus Next Week</a></h3>
                            <h1 className="card-text">On March 4, JTBC officially announced that the drama starring Son Ye Jin, Jeon Mi Do, and Kim Ji Hyun would be going on a one-week hiatus due to coverage of South Korea’s presidential election.</h1>
                            <h1 className="author-card"><a href="author.html"> By E Cha</a></h1>
                            <h1 className="author-card">04 Mar 2022 | 8 mins read </h1> 
                        </div>
                    </div>
                </div>
            </div> */}
            </div>
        </section>

    </>
    )


}

export default Criticism