// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red, deepPurple, teal } from '@mui/material/colors';

// Create a theme instance with updated colors.
const theme = createTheme({
  palette: {
    primary: deepPurple, // A more vibrant color for the primary palette
    secondary: teal, // A complementary color for the secondary palette
    error: {
      main: red.A400,
    },
    customColors: {
      selectedButton: '#D1C4E9',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff', // White text for better contrast
        },
      },
    },
  },
  typography: {
    // Customize typography settings if desired
  },
});

export default theme;
