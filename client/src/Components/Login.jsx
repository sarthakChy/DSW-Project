import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { getError } from '../Utils';
import axios from "axios";

const Login = () => {

  const [inputs,setInputs] = useState({})

  const handleChange = (e)=>
  {
    const name = e.target.name;
    const val = e.target.value;
    
    setInputs(inputs => ({...inputs,[name]:val}))
  }

  const handleLogin = async(e)=>
  {
    e.preventDefault();

    const url = "http://localhost:80/api/login.php"

    
    
    const response = await axios.post(url, inputs, { headers: { "Content-Type": "application/json" } });

    console.log(response)
  }

  return (
    <Container>
      <LoginBox>
        <Form>
          <InputField>
            <Input type="text" placeholder="User name / Email" name = "user" required onChange={(e)=>handleChange(e)}></Input>
          </InputField>
          <InputField> 
            <Input type="password" placeholder="Password" name = "pass" onChange={(e)=>handleChange(e)}/>
          </InputField>
          <LoginButton onClick={(e)=>handleLogin(e)}>LOG IN NOW</LoginButton>
        </Form>
      </LoginBox>
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

const LoginBox = styled.div`
  width: 50vw;
  height: 40vh;
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
  margin-bottom: 30px;
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

const LoginButton = styled.button`
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

const SocialLogin = styled.div`
  text-align: center;
  margin-top: 20px;

  p {
    color: #666;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const SocialIcon = styled.i`
  font-size: 20px;
  color: #673ab7;
  margin: 0 10px;
  cursor: pointer;
  
  &:hover {
    color: #5e35b1;
  }
`;

export default Login;
