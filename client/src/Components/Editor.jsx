import React, {useState, useCallback, useRef} from 'react'
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

function Editor() {

    const valueRef = useRef("");

    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
   
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'direction': 'rtl' }],                         // text direction
        
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      ];

    const wrapperRef = useCallback((wrapper)=>{
        if(wrapper == null) return
        
        wrapper.innerHTML = "";

        const editor = document.createElement("div")
        wrapper.append(editor)

        new Quill(editor, {theme: 'snow', modules:{
            toolbar: toolbarOptions
        }})
    })

    const handleClick = (e)=>
    {
      if(wrapperRef)
        {
            const elements = document.querySelector("div.ql-editor.ql-blank") || document.querySelector("div.ql-editor") 
            valueRef.current = elements.innerHTML;
            console.log(valueRef.current);
            console.log(localStorage.getItem('inputs'));
        }

    }
    
    

  return (
    <>
    <Wrapper>
    <Button onClick={(e)=>handleClick(e)}>
      Save
    </Button>
    <Container id='editor' ref={wrapperRef}>

    </Container>
    
    </Wrapper>
    </>
  )
}

export default Editor

const Container = styled.div`
    height: 70%;
    width: 80%;
`
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
`
const Button = styled.button`
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #009688; /* Primary theme color */
  border: none;
  border-radius: 8px;
  margin: 30px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #00796b; /* Darker shade for hover effect */
    transform: translateY(-2px);
  }
`;