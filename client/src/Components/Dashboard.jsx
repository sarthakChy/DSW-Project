import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


const Dashboard = () => {

  const {user} = useParams();

  return (
    <Container>
      <Header>
        <h1>Welcome to {user}'s Dashboard</h1>
      </Header>

      <Section>
        <h2>Your Documents</h2>
        <DocumentList>
          <DocumentItem><StyledLink to="/edit/1">Document 1</StyledLink></DocumentItem>
          <DocumentItem><StyledLink to="/edit/2">Document 2</StyledLink></DocumentItem>
          <DocumentItem><StyledLink to="/edit/3">Document 3</StyledLink></DocumentItem>
        </DocumentList>
        <CreateDoc>
          <StyledLink to={`/editor/${uuidv4()}`}>Create New Document</StyledLink>
        </CreateDoc>
      </Section>

      <Footer>
        <div>&copy; 2024 LiveDraft. All rights reserved.</div>
        <div>Founders: Sarthak Choudhary | Yash Kumar Singh | Asmit Agarwal | Sparsh Aggarwal</div>
      </Footer>
    </Container>
  );
};

// Styled Components

const Container = styled.div`
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  background-color: #f0f8ff;
`;

const Header = styled.header`
  background-color: #009688;
  color: #fff;
  padding: 2rem 1.25rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  margin: 3rem auto;
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

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

const CreateDoc = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  background-color: #000;
  color: white;
  margin-top: 3rem;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
`;

export default Dashboard;
