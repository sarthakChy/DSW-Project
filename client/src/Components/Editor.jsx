import React, { useState, useRef, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Editor() {
    const [quill, setQuill] = useState(null);
    const [delta, setDelta] = useState(null);
    const socketRef = useRef(null); // Using ref for WebSocket
    const {id: documentId} = useParams();
    const valueRef = useRef();
    var Delta = Quill.import('delta');

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



    const loadDocument = async(q)=>
    {
      const url = 'http://localhost:80/api/loadDocument.php';

        try{
          const response = await axios.post(url,{docid:documentId},{ headers: { 'Content-Type': 'application/json' } });
          if (response?.data) {
            const content = response.data.Content;
            if (content && typeof content === 'object') {
              q.setContents(content);

            }
          }
          else {
            console.error(response.data.error);
          }
  
        }
        catch(error)
        {
          console.log(error);
        }
    }


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
          setDelta(delta);
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

        loadDocument(q);

        setQuill(q);

        
    }, []);

    const handleClick = async (e)=>
      {
        if(wrapperRef)
          {
                // const elements = document.querySelector("div.ql-editor.ql-blank") || document.querySelector("div.ql-editor") 
                // valueRef.current = elements.innerHTML;
                // console.log(valueRef.current);
                // console.log(localStorage.getItem('inputs'));
                // console.log(localStorage.getItem("Eid"));

              const content = quill?.getContents();
              const url = 'http://localhost:80/api/saveDocument.php';

              try{
                
                const response = await axios.post(url, {uid:1,docid:documentId,title:'untiled',content: JSON.stringify(content),visibility:"Public"}, { headers: { 'Content-Type': 'application/json' } });
                console.log(response.data);
              }catch(error)
              {
                console.log(error.response.data);
              }
          }
  
      }
    
    return (
      <Wrapper>
        <Header>
          <h1>Document Editor</h1>
        </Header>
        <MainContent>
          <Sidebar>
            <h3>Documents</h3>
            <ul>
              <li><a href="#">Document 1</a></li>
              <li><a href="#">Document 2</a></li>
              <li><a href="#">Document 3</a></li>
              <li><a href="#">Create New Document</a></li>
            </ul>
          </Sidebar>
          <EditorSection>
            <h2>Create/Edit Document</h2>
  
  
            <form>
              <label htmlFor="title">Title</label>
              <input type="text" id="title" placeholder="Enter document title" required />
  
              <label htmlFor="content">Content</label>
              <Container ref={wrapperRef}></Container>
  
              <div className="buttons">
                <button type="button" onClick={handleClick} className="save-btn">Save Document</button>
                <button type="button"  className="cancel-btn">Cancel</button>
              </div>
            </form>
          </EditorSection>
        </MainContent>
  
        <Footer>
          <div>&copy; 2024 LiveDraft. All rights reserved.</div>
          <div>Founders: Sarthak Choudhary | Yash Kumar Singh | Asmit Agarwal | Sparsh Aggarwal</div>
        </Footer>
      </Wrapper>
    );
  }
  export default Editor;

  // Styled Components for the layout

const Wrapper = styled.div`
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
color: #333;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
min-height: 100vh;
width: 100%;
overflow-x:hidden;
`;

const Container = styled.div`
width: 100%;
height: 500px; /* Adjusted height for better view of editor */

margin-bottom: 0px;
`;

const Header = styled.header`
text-align: center;
padding: 0px 0;
margin-top 0px;
margin-bottom:10px;
background-color: #00796b;
color: white;
width: 100%;
h1 {
    font-size: 2.5rem;
    font-weight: 600;
}
`;

const MainContent = styled.div`
display: flex;
width: 100%;
max-width: 1200px;
background-color: #fff;
border-radius: 12px;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
padding: 20px;
`;

const Sidebar = styled.aside`
width: 250px;
background-color: #f1f1f1;
padding: 20px;
border-radius: 12px;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
margin-right: 20px;

h3 {
    margin-top: 0;
    color: #00796b;
}

ul {
    list-style-type: none;
    padding: 0;
}

ul li {
    margin: 10px 0;
}

ul li a {
    color: #00796b;
    text-decoration: none;
    font-weight: bold;
}

ul li a:hover {
    text-decoration: underline;
}
`;

const EditorSection = styled.section`
flex-grow: 1;
padding: 20px;
background: #fff;
border-radius: 12px;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

h2 {
    color: #00796b;
    margin-bottom: 10px;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 10px;
    font-size: 1.2rem;
    color: #00796b;
}

input {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    color: #333;
}

.buttons {
margin-top: 50px;
    display: flex;
    justify-content: space-between;
}

.save-btn, .cancel-btn {
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
}

.save-btn {
    background-color: #00796b;
    color: white;
}

.save-btn:hover {
    background-color: #004d40;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
}

.cancel-btn:hover {
    background-color: #d32f2f;
}
`;

const Footer = styled.footer`
text-align: center;
padding: 1rem;
background-color: black;
color: white;
width: 100%;
box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
margin-top: 20px;
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
    width: 100%;
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
