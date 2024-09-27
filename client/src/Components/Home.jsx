import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container>
            <Header>
                <h1>LiveDraft</h1>
                <Nav>
                    <NavList>
                        <Link to = '/login'>Login</Link>
                        <NavItem><NavLink href="#about">About</NavLink></NavItem>
                        <NavItem><NavLink href="#features">Features</NavLink></NavItem>
                        <NavItem><NavLink href="/login">Login</NavLink></NavItem>
                        <NavItem><NavLink href="/signup">Sign Up</NavLink></NavItem>
                    </NavList>
                </Nav>
            </Header>

            <Section id="about">
                <h2>About</h2>
                <p>LiveDraft is your go-to platform for seamless, real-time text editing. Whether you're working on a group project, drafting a document with colleagues, or simply brainstorming ideas, LiveDraft makes collaboration easy and efficient.</p>
            </Section>

            <Section id="features">
                <h2>Key Features</h2>
                <FeatureList>
                    <FeatureItem>Real-Time Editing</FeatureItem>
                    <FeatureItem>User-Friendly Interface</FeatureItem>
                    <FeatureItem>Secure Login and Registration</FeatureItem>
                    <FeatureItem>Version Control</FeatureItem>
                    <FeatureItem>Multi-User Support</FeatureItem>
                </FeatureList>
            </Section>

            <Footer>
                <div>© 2024 LiveDraft. All rights reserved.</div>
                <div>Founders: Sarthak Choudhary | Yash Kumar Singh | Asmit Agarwal | Sparsh Aggarwal</div>
            </Footer>
        </Container>
    );
};

// Styled Components

const Container = styled.div`
    font-family: 'Arial', sans-serif;
    background-color: #f0f8ff;
`;

const Header = styled.header`
    background-color: #009688;
    color: #fff;
    padding: 1.5rem 0;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Nav = styled.nav``;

const NavList = styled.ul`
    list-style: none;
    padding: 0;
`;

const NavItem = styled.li`
    display: inline;
    margin: 0 1.5rem;
`;

const NavLink = styled.a`
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
        color: #ffeb3b;
    }
`;

const Section = styled.section`
    padding: 2.5rem;
    margin: 1.5rem auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    animation: fadeIn 0.6s ease-in-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    h2 {
        color: #009688;
        margin-bottom: 1rem;
    }
`;

const FeatureList = styled.ul`
    list-style-type: square;
    padding-left: 20px;
`;

const FeatureItem = styled.li``;

const Footer = styled.footer`
    text-align: center;
    padding: 1rem;
    background-color: #000;
    color: #fff;
    width: 100%;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
`;

export default Home;
