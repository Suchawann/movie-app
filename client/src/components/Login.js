import React from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Form, Button, Row } from "react-bootstrap";

export function Login({ email, password, onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <Form onSubmit={handleSubmit(onLogin)} >
      <Form.Group className="mb-3" controlId="formBasicEmail" >
        <Row style={{ textAlign: "center"}}>
            <div className='header'>
                <h1 className='listing-title' style={{marginTop:"10px"}}> Welcome to MovieBloom!</h1>
            </div>
        </Row>
        <Form.Label style={{marginTop: "10px"}}>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"cd 
          defaultValue={email}
          {...register("email", { required: true })}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          defaultValue={password}
          {...register("password", { required: true, min: 8 })}
        />
      </Form.Group>

      {/* <input type="submit" /> */}
      <div className="d-grid gap-2">
        <Button type="submit" variant="outline-dark">
          Login
        </Button>
      </div>
    </Form>
  );
}

Login.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  onLogin: PropTypes.func,
};

Login.defaultProps = {
  email: null,
  password: false,
  onLogin: undefined,
};
