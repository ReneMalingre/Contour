// src/components/MenuBar.jsx
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const MenuBar = () => {
  const theme = useTheme();

  const linkStyle = {
    marginRight: '10px',
    color: theme.palette.customColors.lightLavender,
    textDecoration: 'none', // To remove the underline from links
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: theme.palette.secondary.main, // assuming this is teal
    borderRadius: '5px',
  };

  // Define the paths and labels for the menu items
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/katt-designer', label: 'KATT Lens Designer' },
    { path: '/multi-curve-designer', label: 'Multi-curve Designer' },
    { path: '/eye-model', label: 'Medmont Eye Model' },
    // Add more items as needed
  ];

  return (
    <AppBar position="static" sx={{ mb: 1 }}>
      <Toolbar>
        {menuItems.map((item) => (
          <Button
            key={item.path}
            color="inherit"
            component={NavLink}
            to={item.path}
            style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
