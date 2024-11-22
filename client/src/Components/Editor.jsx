import React, { useState, useRef, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';

function Editor() {
    const [quill, setQuill] = useState(null);
    const [titleValue,setTitleValue] = useState("Untitled");
    const [Documents,setDocuments] = useState([]);
    const [DocumentCollab,setDocumentCollab] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [sharePerson,setSharePerson] = useState("");
    const [msg,setMsg] = useState("");

    const userName = localStorage.getItem('user');

    const socketRef = useRef(null); // Using ref for WebSocket
    const {id: documentId} = useParams();

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
            setTitleValue(response.data.Title);
            if (content && typeof content === 'object') {
              q.setContents(content);

            }
          }
          else {
            console.error(response?.data?.error);
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


    useEffect(()=>
      {
        loadDocument(quill);
        fetchDocuments();
    
      },[documentId])
    
      const fetchDocuments = async () => {
        const url = 'http://localhost:80/api/getDocument.php';
    
        try{
          const response = await axios.post(url,{user:userName},{ headers: { 'Content-Type': 'application/json' } });
          if (response.data) {
            setDocuments(response.data['Documents']);
            setDocumentCollab(response.data['collab']);
            console.log(response.data);
          } else {
              setDocuments([]); 
          }
        }catch(error)
        {
          console.error(error.response);
        }
        
      };


    const handleChange = (e)=>
    {
      setTitleValue(e.target.value);
    }
    const handleClick = async (e)=>
      {
        if(wrapperRef)
          {
              const content = quill?.getContents();
              const url = 'http://localhost:80/api/saveDocument.php';

              try{
                
                const response = await axios.post(url, {user:userName,docid:documentId,title:titleValue,content: JSON.stringify(content),visibility:"Private"}, { headers: { 'Content-Type': 'application/json' } });
                console.log(response.data);
                fetchDocuments()
              }catch(error)
              {
                console.log(error.response.data.error);
              }
          }
  
      }

    const handleShare = async ()=>
    {
      
      const url = 'http://localhost:80/api/shareDocument.php';

              try{
                
                const response = await axios.post(url, {user:sharePerson,docid:documentId,role:'Editor'}, { headers: { 'Content-Type': 'application/json' } });
                console.log(response.data);
                setPopupVisible(false);
                fetchDocuments();

              }catch(error)
              {
                console.log(error.response.data.message);
                setMsg(error.response.data.message);

                setTimeout(()=>{
                  setMsg("");
                },'1000')
              }
    }
      
  
    return (
      <>
        {
          <>
          {
            isPopupVisible?
            <>
              <Popup>
                {msg && <ErrorMessage>{msg}</ErrorMessage>}
              <h3>Enter Username</h3>
              <input
                type="text"
                placeholder="username"
                value={sharePerson}
                onChange={(e)=>{setSharePerson(e.target.value)}}
                style={{
                  padding: '8px',
                  width: '80%',
                  marginBottom: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}/>
                <ButtonDiv>
                  <ShareButton onClick={()=>handleShare()}>Share</ShareButton>
                  <CloseButton onClick={() => setPopupVisible(false)}>Close</CloseButton>
                </ButtonDiv>  
              </Popup>
            </>
            :
            <>
            </>
          }
            <Wrapper pop={isPopupVisible}>
        <Header>
          <Home>
            <StyledLink style={{color:'white'}} to={`/${userName}/dashboard`}>Home</StyledLink>
          </Home>
          <DashTitle>
            <h1>Document Editor</h1>
          </DashTitle>
        </Header>
        <MainContent>
          <Sidebar>
          <DocumentList>
            {Documents?.length === 0 && DocumentCollab?.length===0 ? (
                <p>No documents found</p>
            ) : (
              <>
                    {Documents?.map((document) => (
                        <DocumentItem><StyledLink key={document.DocumentID} to={`/editor/${document.DocumentID}`}>{document.Title}</StyledLink></DocumentItem>
                    ))}
                    {DocumentCollab?.map((document) => (
                        <DocumentItem><StyledLink key={document.DocumentID} to={`/editor/${document.DocumentID}`}>{document.Title}(Collab)</StyledLink></DocumentItem>
                    ))}
              </>
            )}
                        
          </DocumentList>
          </Sidebar>
          <EditorSection>
            <SectionTop>
            <h2>Create/Edit Document</h2>
            <div className="buttons">
                <button type="button" onClick={handleClick} className="save-btn">Save</button>
                <button type="button" onClick={() => setPopupVisible(true)} className="share-btn">Share</button>
            </div>
            </SectionTop>
            
            <SectionBottom>
            <form onSubmit={e => { e.preventDefault(); }}>
              <label htmlFor="title">Title</label>
              
              <input type="text" id="title" placeholder="Enter document title" value={titleValue} onChange={(e)=>handleChange(e)} required />
  
              <label htmlFor="content">Content</label>
              
            </form>
            <Container ref={wrapperRef}></Container>
            </SectionBottom>
          </EditorSection>
        </MainContent>
  
        <Footer>
          <div>&copy; 2024 LiveDraft. All rights reserved.</div>
          <div>Founders: Sarthak Choudhary | Yash Kumar Singh | Asmit Agarwal | Sparsh Aggarwal</div>
        </Footer>
      </Wrapper>
          </>
        }

      </>
    );
  }
  export default Editor;

  // Styled Components for the layout

const Wrapper = styled.div`
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
color: #333;
display: flex;
filter:${props=>props.pop?`blur(2px)`:`blur(0px)`};
flex-direction: column;
justify-content: flex-end;
align-items:center;
height: 150vh;
width: 100%;
overflow-x:hidden;
`;

const Container = styled.div`
width: 100%;
height:530px;
margin-bottom: 0px;
`;

const Header = styled.div`
display:flex;
margin-bottom:10px;
align-items:center;
justify-content:space-around;
background-color: #00796b;
color: white;
width: 100vw;
height: 10vh;
`;
const Home = styled.div`
width:10vw;
height:100%;
font-size: 1rem;
font-weight: 600;
display:flex;
justify-content:center;
align-items:center;
`
const DashTitle = styled.div`
width:90vw;
font-size: 1rem;
font-weight: 600;
height:100%;
display:flex;
justify-content:center;
align-items:center;

`
const MainContent = styled.div`
display: flex;
width: 100%;
max-width: 1200px;
height:130vh;
background-color: #fff;
border-radius: 12px;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
padding:20px;
`;

const Sidebar = styled.div`
width: 250px;
max-height:100%;
overflow-y: auto;
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
display:flex;
flex-direction:column;
padding: 20px;
border-radius: 12px;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

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

.buttons{
    display: flex;
    justify-content: space-around;
    width:20vw;
    height:6vh;
}

.save-btn, .share-btn {
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

.share-btn {
    background-color: #f44336;
    color: white;
}

.share-btn:hover {
    background-color: #d32f2f;
}
`;
const SectionTop = styled.div`
height:12%;
display:flex;
margin-bottom:40px;
justify-content: space-between;
`
const SectionBottom = styled.div``

const DocumentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const DocumentItem = styled.li`
  background-color: #f9f9f9;
  padding: 1rem;
  margin: 1.25rem 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #009688;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #00796b;
  }
`;

const ShareButton = styled.button`
margin-top: 10px;
  padding: 8px 16px;
  font-size: 14px;
  background-color: #00796b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const PopupOverlay = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1); /* Minimal darkness for transparency */
  backdrop-filter: blur(5px); /* Adds a subtle blur effect */
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ErrorMessage = styled.p`
  color: red; /* Error message color */
  text-align: center;
  margin-bottom: 20px;
`;

const Popup = styled.div`
  background-color:white;
  z-index:999;
  top:25%;
  left:30%;
  position:fixed;
  margin:50px;
  width: 30vw;
  height: 30vh;
  display:flex;
  flex-direction: column;
  justify-content: start;
  align-items:center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 14px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;

const ButtonDiv = styled.div`
display:flex;
margin-top:10%;
justify-content:space-between;
width:50%;
`
const Footer = styled.footer`
text-align: center;
margin: auto;
padding: 1rem;
background-color: black;
color: white;
width: 100%;
height:10vh;
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
