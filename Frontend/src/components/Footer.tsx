import React from 'react';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';

const footerStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  background: '#5F86C8'
};

const Footer: React.FC = () => {
  return (
    <AppBar position="static" sx={footerStyle}>
      <Container>
        <Toolbar>
          <Typography variant="body1" color="inherit">
            &copy; {new Date().getFullYear()} Energy Management System
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Footer;
