import React, { useState, useRef, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

function Editor() {
    const [quill, setQuill] = useState(null);
    const socketRef = useRef(null); // Using ref for WebSocket
    const {id: documentId} = useParams();
    const valueRef = useRef();

    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      
        [{ 'direction': 'rtl' }],                         
        [{ 'color': [] }, { 'background': [] }], 
        [{ 'font': [] }],
        [{ 'align': [] }],
    ];

    useEffect(() => {
       
        const s = new WebSocket('ws://localhost:8080');
        socketRef.current = s;

        s.onopen = () => {
            console.log('WebSocket connected');
        };

        s.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            if (s) s.close();
        };
    }, []);

    useEffect(() => {
        if (socketRef.current === null || quill === null) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return;
          
            const message = {
              docId: documentId,
              delta: delta
          };
          socketRef.current.send(JSON.stringify(message));
        };

        quill.on('text-change', handler);

        return () => {
            quill.off('text-change', handler);
        };
    }, [socketRef, quill]);

    useEffect(() => {
        if (socketRef.current === null) return;

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(message.docId !== documentId) return;
            if (message.delta && quill) {
                quill.updateContents(message.delta, 'silent');
            }
        };
    }, [socketRef, quill]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper === null) return;

        wrapper.innerHTML = '';
        localStorage.setItem('Eid', JSON.stringify({ id: documentId }));

        const editor = document.createElement('div');
        wrapper.append(editor);

        const q = new Quill(editor, {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        setQuill(q);
    }, []);

    const handleClick = (e)=>
      {
        if(wrapperRef)
          {
              const elements = document.querySelector("div.ql-editor.ql-blank") || document.querySelector("div.ql-editor") 
              valueRef.current = elements.innerHTML;
              console.log(valueRef.current);
              console.log(localStorage.getItem('inputs'));
              console.log(localStorage.getItem("Eid"));
          }
  
      }

    return (
        <Wrapper>
            <Button onClick={(e) => handleClick(e)}>Save</Button>
            <Container ref={wrapperRef}></Container>
        </Wrapper>
    );
}

export default Editor;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
`;

const Container = styled.div`
    height: 70%;
    width: 80%;
`;

const Button = styled.button`
    padding: 15px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #009688;
    border: none;
    border-radius: 8px;
    margin: 30px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: #00796b;
        transform: translateY(-2px);
    }
`;





/*import React, {useState, useCallback, useRef, useEffect} from 'react'
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

function Editor() {
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    const valueRef = useRef("");
    const id = useRef("");

    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        
        ['blockquote', 'code-block'],
   
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      
        [{ 'direction': 'rtl' }],                         
        
        [{ 'color': [] }, { 'background': [] }], 
        [{ 'font': [] }],
        [{ 'align': [] }],
      ];

    useEffect(()=>{
      const s = new WebSocket('ws://localhost:8080');
      setSocket(s);

      return()=>
      {
        s.close();
      }
    },[])

    useEffect(()=>{
      if(socket == null || quill == null) return

      const handler = (delta,oldDelta,source)=>{
        if(source!= "user") return
        socket.send(JSON.stringify({ delta: delta }));
      }
      quill.on("text-change",handler)

      return ()=>{
        quill.off('text-cahnge',handler)
      }
    },[socket,quill]);

    useEffect(() => {
      if (socket === null) return;

      socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.delta && quill) {
              quill.updateContents(message.delta, 'silent');
          }
      };

      return () =>
      {
        socket.close();
      }
  }, [socket, quill]);

    const wrapperRef = useCallback((wrapper)=>{
        if(wrapper == null) return
        
        wrapper.innerHTML = "";
        id.current = uuidv4();
        
        localStorage.setItem("Eid", JSON.stringify({"id":id}));

        const editor = document.createElement("div")
        wrapper.append(editor)

        const q = new Quill(editor, {theme: 'snow', modules:{
            toolbar: toolbarOptions
        }})

        setQuill(q);
    })

    const handleClick = (e)=>
    {
      if(wrapperRef)
        {
            const elements = document.querySelector("div.ql-editor.ql-blank") || document.querySelector("div.ql-editor") 
            valueRef.current = elements.innerHTML;
            console.log(valueRef.current);
            console.log(localStorage.getItem('inputs'));
            console.log(localStorage.getItem("Eid"));
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
  background-color: #009688;
  border: none;
  border-radius: 8px;
  margin: 30px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #00796b;
    transform: translateY(-2px);
  };
`*/
