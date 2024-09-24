import React, { useState } from 'react';
import styled from 'styled-components';
import { getError } from '../Utils';
import axios from "axios";

const Register = () => {

  const [inputs, setInputs] = useState({})

  const handleChange = (e) => {
    const name = e.target.name;
    const val = e.target.value;
    
    setInputs(inputs => ({ ...inputs, [name]: val }))
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    const url = "http://localhost/api/register.php"

    try {
      let result = await axios.post(
        url,         // your URL
        {            // data if post, put
          ...inputs  // sending the collected inputs (name, email, password)
        }
      );
      console.log(result.data);
    } catch (error) {
      console.error(getError(error));
    }
  }

  return (
    <Container>
      <RegisterBox>
        <Form>
          <InputField>
            <Input type="text" placeholder="Name" name="name" required onChange={(e) => handleChange(e)}></Input>
          </InputField>
          <InputField>
            <Input type="email" placeholder="Email" name="email" required onChange={(e) => handleChange(e)}></Input>
          </InputField>
          <InputField>
            <Input type="password" placeholder="Password" name="pass" required onChange={(e) => handleChange(e)}></Input>
          </InputField>
          <RegisterButton onClick={(e) => handleRegister(e)}>REGISTER NOW</RegisterButton>
        </Form>
      </RegisterBox>
    </Container>
  );
};

// Styled Components

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d1c4e9;
`;

const RegisterBox = styled.div`
  width: 50vw;
  height: 50vh;
  padding: 40px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.2);
`;

const Form = styled.form`
  margin-top: 10%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InputField = styled.div`
  width: 85%;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 20px 35px;
  font-size: 16px;
  color: #333;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  outline: none;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #673ab7;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
  
  &:hover {
    background-color: #5e35b1;
  }
`;

export default Register;

