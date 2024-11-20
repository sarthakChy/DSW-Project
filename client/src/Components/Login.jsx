import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const val = e.target.value;
    setInputs(inputs => ({ ...inputs, [name]: val }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const url = 'http://localhost:80/api/login.php';

    try {
      const response = await axios.post(url, inputs, { headers: { 'Content-Type': 'application/json' } });
      setMsg(response.data);
      localStorage.setItem('inputs', JSON.stringify(inputs));
      setTimeout(() => {
        setMsg("");
        navigate(`/${inputs['user']}/dashboard`);
      }, '2000');
    } catch (error) {
      console.log(error);
      setMsg(error.response.data);
      setTimeout(() => {
        setMsg("");
      }, '2000');
    }
  };

  return (
    <Container>
      <LoginBox>
        <Form>
          {msg && <ErrorMessage>{msg}</ErrorMessage>}
          <InputField>
            <Input type="text" placeholder="User name / Email" name="user" required onChange={handleChange} />
          </InputField>
          <InputField>
            <Input type="password" placeholder="Password" name="pass" onChange={handleChange} />
          </InputField>
          <LoginButton onClick={handleLogin}>LOG IN NOW</LoginButton>
        </Form>
        <FooterText>
          Don't have an account? 
          <SignUpButton onClick={() => navigate('/signup')}>Sign Up</SignUpButton>
        </FooterText>
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
  background-color: #d1f1f0; /* Light variant of your previous theme */
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const LoginBox = styled.div`
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InputField = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 0px 15px 5px;
  font-size: 16px;
  color: #333;
  background-color: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #009688; /* Match your theme */
  }
`;

const LoginButton = styled.button`
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #009688; /* Primary theme color */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #00796b; /* Darker shade for hover effect */
    transform: translateY(-2px);
  }
`;

const FooterText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #333;
  text-align: center;
`;

const SignUpButton = styled.button`
  background: none;
  border: none;
  color: #009688; /* Match the theme */
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 5px;
  transition: color 0.3s;

  &:hover {
    color: #00796b; /* Darker shade for hover effect */
  }
`;

const ErrorMessage = styled.p`
  color: red; /* Error message color */
  text-align: center;
  margin-bottom: 20px;
`;

export default Login;
