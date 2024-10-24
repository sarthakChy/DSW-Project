import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components';


function Dashboard() {

    let {user} = useParams();

  return (
    <S>
      {user} dashboard
    </S>
  )
}

export default Dashboard


const S = styled.button`
width:100vw;
height:100vh;
background-color:red;

`