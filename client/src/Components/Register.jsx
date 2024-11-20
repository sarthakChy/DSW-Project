import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const name = e.target.name;
    const val = e.target.value;
    setInputs(inputs => ({ ...inputs, [name]: val }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Form data being sent:', inputs); // Log inputs to verify the data being sent

    const url = 'http://localhost/api/register.php';
    try {
      const response = await axios.post(url, inputs, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      setMsg(response.data);
      setTimeout(() => {
        setMsg("");
        navigate(`/login`);
      }, '2000');
      console.log(response.data);
      navigate('/login'); // Navigate to login page after successful registration
    } catch (error) {
      console.error('Error during POST request', error.response?.data || error.message);
    
      setMsg(error.response.data.message);
      setTimeout(() => {
        setMsg("");
      }, '2000');
    }
  };
  
  return (
    <Container>
      <RegisterBox>
        <Form onSubmit={handleRegister}>
        {msg && <ErrorMessage>{msg}</ErrorMessage>}
          <InputField>
            <Input type="text" placeholder="Name" name="name" required onChange={handleChange} />
          </InputField>
          <InputField>
            <Input type="email" placeholder="Email" name="email" required onChange={handleChange} />
          </InputField>
          <InputField>
            <Input type="password" placeholder="Password" name="pass" required onChange={handleChange} />
          </InputField>
          <RegisterButton type="submit">REGISTER NOW</RegisterButton>
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
  background-color: #d1f1f0; /* Light variant of your previous theme */
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const RegisterBox = styled.div`
  width: 400px; /* Adjust width as needed */
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

const RegisterButton = styled.button`
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
const ErrorMessage = styled.p`
  color: red; /* Error message color */
  text-align: center;
  margin-bottom: 20px;
`;
export default Register;
