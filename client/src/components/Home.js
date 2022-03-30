
import { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBRipple, MDBRow, MDBCol } from 'mdb-react-ui-kit';

import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import { storage } from "../firebase";

export default function Home() {
    const API_URL =  process.env.REACT_APP_API_URL;

    const [show, setShow] = useState(false);
    const [model, setModel] = useState(false);
    const [movie, setMovie] = useState([])
    const [rows, setRows] = useState([])
    const [fileName,setFileName] = useState(null)
    const [movieList, setMovieList] = useState({
        image:"",
        title: "",
        synopsis: "",
        actor: "",
        min: ""
    })
    const [Url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    //Input references
    const refTitle = useRef(null);
    const refSysnopsis= useRef(null);
    const refMin = useRef(null);
    const refImage = useRef(null);
    const refActor = useRef(null);

    const handlePhoto = (e) => {
        if (e.target.files[0]) {
            setFileName(e.target.files[0]);
          }
    }

    useEffect(() => {
        const fetchMovies = async () => {
            const res = await axios.get(`${API_URL}/movie`)
            console.log(res)
            setMovie(res.data)
        }
        fetchMovies()
    }, [])

    const handleShowAdd = () => {
        setModel(true);
        setShow(true);
    };
    const handleUpdate = (movie) => {
        console.log("Update Movie", movie);
        console.log(movie._id);
        movie.current = movie._id;
        setShow(true);
        setMovieList(movie);  
    }

    const handleClose = () => {
        setModel(false);
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleDelete = (movie) => {
        console.log(movie);
        if (window.confirm(`Are you sure to delete ${movie.title}?`)) {
            fetch(`${API_URL}/movie/${movie._id}`, {
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
      
        const uploadTask = storage.ref(`images/${fileName.name}`).put(fileName);
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
              .ref("images")
              .child(fileName.name)
              .getDownloadURL()
              .then(url => {
                setUrl(url);
                // var src = URL.createObjectURL(url);
              
                if (model) {
                    //Add new news
                    const newMovie = {
                        image: url,
                        title: refTitle.current.value,
                        synopsis: refSysnopsis.current.value,
                        actor: refActor.current.value,
                        min: refMin.current.value
                    }
                    console.log(newMovie);
            //         axios.post(`${API_URL}/movie`, { newMovie })
            //   .then(res => {
            //     console.log(res);
            //     console.log(res.data);
            //     movie.push(res);
            //                 setMovie(movie)
            //                 handleClose();
            //   })
        
                    fetch(`${API_URL}/movie`, {
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
                            movie.push(json);
                            setMovie(movie)
                            handleClose();
                        });
                        
                } else {
                    // Update product
                    const updatedMovie = {
                        _id: movieList._id,
                        image:movieList.image.getDownloadURL(),
                        title: refTitle.current.value,
                        synopsis: refSysnopsis.current.value,
                        actor: refActor.current.value,
                        min: refMin.current.value
                    };
                    console.log(updatedMovie);
        
                    fetch(`${API_URL}/movie`, {
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
                        body: JSON.stringify(updatedMovie), // body data type must match "Content-Type" header
                    })
                        .then((res) => res.json())
                        .then((json) => {
                            // Successfully updated the product
                            console.log("PUT Result", json);
                            for (let i = 0; i < movie.length; i++) {
                                if (movie[i]._id === updatedMovie._id) {
                                    console.log(movie[i], updatedMovie);
                                    movie[i] = updatedMovie;
                                    break;
                                }
                            }
                    
                            setMovie(movie)
                            handleClose();
                                  });
                }
           
                //handleFormAction()
                console.log(url)
              }
            )
          }
        );

                
        

        
      };

    // const handleFormAction = () => {
    //     if (model) {
    //         //Add new news
    //         const newMovie = {
    //             img: Url,
    //             title: refTitle.current.value,
    //             synopsis: refDesc.current.value,
    //             actor: refActor.current.value,
                
    //             min: refTime.current.value
    //         }
    //         console.log(newMovie);
    // //         axios.post(`${API_URL}/movie`, { newMovie })
    // //   .then(res => {
    // //     console.log(res);
    // //     console.log(res.data);
    // //     movie.push(res);
    // //                 setMovie(movie)
    // //                 handleClose();
    // //   })

    //         fetch(`${API_URL}/movie`, {
    //             method: "POST", // *GET, POST, PUT, DELETE, etc.
    //             mode: "cors", // no-cors, *cors, same-origin
    //             cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //             // credentials: "same-origin", // include, *same-origin, omit
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // "Content-Type":"multipart/form-data"
    //                 // 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             redirect: "follow", // manual, *follow, error
    //             referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //             body: JSON.stringify(newMovie), // body data type must match "Content-Type" header

    //         })
    //             .then((res) => res.json())
    //             .then((json) => {
    //                 // Successfully added the product
    //                 console.log("POST Result", json);
    //                 movie.push(json);
    //                 setMovie(movie)
    //                 handleClose();
    //             });
    //     } else {
    //         // Update product
    //         const updatedMovie = {
    //             _id: movieList._id,
    //             img: movieList.url,
    //             title: refTitle.current.value,
    //             synopsis: refDesc.current.value,
    //             actor: refActor.current.value,
    //             min: refTime.current.value
    //         };
    //         console.log(updatedMovie);

    //         fetch(`${API_URL}/movie`, {
    //             method: "PUT", // *GET, POST, PUT, DELETE, etc.
    //             mode: "cors", // no-cors, *cors, same-origin
    //             cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //             // credentials: "same-origin", // include, *same-origin, omit
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             redirect: "follow", // manual, *follow, error
    //             referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //             body: JSON.stringify(updatedMovie), // body data type must match "Content-Type" header
    //         })
    //             .then((res) => res.json())
    //             .then((json) => {
    //                 // Successfully updated the product
    //                 console.log("PUT Result", json);
    //                 for (let i = 0; i < movie.length; i++) {
    //                     if (movie[i]._id === updatedMovie._id) {
    //                         console.log(movie[i], updatedMovie);
    //                         movie[i] = updatedMovie;
    //                         break;
    //                     }
    //                 }
            
    //                 setMovie(movie)
    //                 handleClose();
    //             });
    //     }
    // }


    return (
        <>
            
               
                {/* <div className='listing-header'>
                    <h1 className='listing-title'> Movie News</h1>
                    <h1 className='listing-para'>The latest movie news on the movies you're most interested in seeing</h1>
                </div>

                <div>
                    <h2>
                        <span>
                            Latest
                        </span>
                    </h2>
                </div> */}
              
                    {/* <div style={{ marginBotton: '20px' }}>
                        <h1 className="App-header">Kirsten Stewart On How Spencer Helped Her Understand Mental Health Struggles</h1>
                        <img className='thumb-nail' src={Princess} />
                        <p>Spencer's Kirsten Stewart spotlights mental health in a public statement, making the most of awards season following her Academy Award nomination</p>
                        <h3 className="author"><a href="author.html"> By Frank Abagnail</a></h3>
                        <h3 className="author">22 July 2017 | Only 6 min read </h3>
                    </div> */}

                    <div className="add-button" >
                    <Button variant="outline-secondary" onClick={handleShowAdd}>Create Movies</Button>
                        {/* <FaPlus onClick={handleShowAdd} /> */}
                    </div>

                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                            {model ? "Add New News" : "Update News"}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form encType="multipart?form-data ">
                                <Row>
                                    <Col>Title</Col>
                                    <Col>
                                        <input type="text" ref={refTitle} defaultValue={movieList.title} />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Image</Col>
                                    <Col >
                                        <input type="file" name="img" onChange={handlePhoto}   />
                                       {/* <img src={url}></img> */}
                                        {/* <button onClick={handleUpload}>Upload</button> */}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Description</Col>
                                    <Col>
                                        <input type="text" ref={refSysnopsis} defaultValue={movieList.synopsis} />
                                       {/* <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                        />
                                        </div> */}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Lead Actor</Col>
                                    <Col>
                                        <input type="text" ref={refActor} defaultValue={movieList.actor} />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>Time</Col>
                                    <Col>
                                        <input type="text" ref={refMin} defaultValue={movieList.min} />
                                    </Col>
                                </Row>

                               
                            </Form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleUpload}>
                                {model ? "Add" : "Update"}
                            </Button>
                        </Modal.Footer>

                    </Modal>
                    <MDBRow>
      <MDBCol sm='6'>
                <MDBCard style={{ maxWidth: '22rem', borderRadius:"10px", paddingBottom:"20px", marginLeft:"75%" }} >
                    {movie.map((movies) => (

                <><MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                            <MDBCardImage src={movies.image} style={{ objectFit: "cover", borderRadius: "10px 10px 0 0", boxShadow: "1px 1px 1px 1px #888888" }} fluid alt='...' />
                            <a>
                                <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
                            </a>
                        </MDBRipple><MDBCardBody style={{ boxShadow: "1px 1px 1px 1px #888888", borderRadius: "0 0 10px 10px", marginBottom:"20px" }}>
                                <MDBCardTitle>{movies.title}</MDBCardTitle>
                                <MDBCardText style={{fontSize:"14px", color:"#0009", fontWeight:"bold"}}>
                                    Lead Actor: {movies.actor}
                                </MDBCardText><br></br>
                                
                                <MDBCardText style={{fontSize:"12px"}}>
                                    {movies.synopsis}
                                </MDBCardText><br></br>
                                <MDBCardText style={{fontSize:"12px",color:"#0009", fontWeight:"bold"}}>
                                    Movie length: {movies.min} mins
                                </MDBCardText><br></br>
                                <FaPencilAlt onClick={() => handleUpdate(movies)} />
                                <FaTrashAlt onClick={() => handleDelete(movies)} />
                            </MDBCardBody></>
  
                        ))}
                </MDBCard>
                </MDBCol>
                </MDBRow>
                    
                    

            
            
           
        </>
    )


}

// const handleUpdate = (news) => {
//     console.log("Update News", news);
//     console.log(refTitle);
//     refTitle.current = news.title;

//     setShow(true);
//     setMovieNews(news);
// };



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


    // useEffect(() => {
    //     fetch(`${API_URL}`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             const rows = data.map((e, i) => {
    //                 return (
    //                     <tr key={i}>
    //                         <td>
    //                             <FaPencilAlt
    //                                 onClick={() => {
    //                                     handleUpdate(e);
    //                                 }}
    //                             />
    //                             &nbsp;
    //                             <FaTrashAlt
    //                                 onClick={() => {
    //                                     handleDelete(e);
    //                                 }}
    //                             />
    //                         </td>
    //                         <td>{e.title}</td>
    //                         <td>{e.desc}</td>
    //                         <td>{e.image}</td>
    //                         <td>{e.author}</td>
    //                         <td>{e.time}</td>
    //                         <td>{e.date}</td>
    //                     </tr>
    //                 );
    //             });
    //             setNews(data);
    //             setNewsRows(rows);
    //         });
    // }, []);

