import styled from "styled-components";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Route, Routes } from "react-router-dom";

function App() {




  return (
    <>
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </>
  );
}

export default App;