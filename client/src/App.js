import styled from "styled-components";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Editor from "./Components/Editor";
import Dashboard from "./Components/Dashboard";

function App() {

  return (
    <>
      <Routes>
      <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/:user/dashboard" element={<Dashboard/>}/>
        <Route path="/editor/:id" element={<Editor/>}/>

      </Routes>
    </>
  );
}

export default App;