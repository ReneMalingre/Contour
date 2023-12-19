import { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useKattLenses } from '../hooks/useKattLenses';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';

const CompareSags = ({ halfChordIndex }) => {
  const { kattLenses } = useKattLenses();

  // get the initial width from localStorage based on halfChordIndex
  let initialWidth = localStorage.getItem(`kattHalfChord${halfChordIndex}`);
  if (initialWidth === null || isNaN(initialWidth) || initialWidth === '') {
    switch (halfChordIndex) {
      case '0':
        initialWidth = 0;
        break;
      case '1':
        initialWidth = 3;
        break;
      case '2':
        initialWidth = 5;
        break;
      case '3':
        initialWidth = 6;
        break;
      case '4':
        initialWidth = 7;
        break;
      default:
        initialWidth = 0;
    }
  } else {
    initialWidth = parseFloat(initialWidth);
  }

  const [inputValue, setInputValue] = useState(initialWidth);
  const [outputValue, setOutputValue] = useState(0);

  // get the KattLenses from the global context
  const lens1 = kattLenses['lens1'];
  const lens2 = kattLenses['lens2'];

  // Function to calculate and set the output value
  // needs to be defined before it is used in the dependency array of the useEffect hook
  const calculateAndSetOutput = useCallback(
    (value) => {
      if (lens1 === undefined || lens2 === undefined) {
        setOutputValue('Invalid lens data');
        return;
      }

      // check for valid input
      if (isNaN(value) || value < 0 || value > 10) {
        setOutputValue('Invalid input');
        return;
      }
      if (lens1.lensDiameter / 2 < value || lens2.lensDiameter / 2 < value) {
        setOutputValue('Too wide');
        return;
      }
      const calculatedValue = (
        (lens1.calculateSagAtYRelativeToLandingZone(value) -
          lens2.calculateSagAtYRelativeToLandingZone(value)) *
        1000
      ).toFixed(0);
      setOutputValue(calculatedValue);
      return;
    },
    [lens1, lens2],
  );
  // ensure the output value is calculated when the component is first rendered
  useEffect(() => {
    calculateAndSetOutput(initialWidth);
  }, [initialWidth, calculateAndSetOutput]); // Dependency array ensures this runs only when initialValue changes

  const handleInputChange = (event) => {
    const newValue = parseFloat(event.target.value);
    console.log(`newValue: ${newValue}`);

    if (!isNaN(newValue) && newValue >= 0 && newValue <= 10) {
      setInputValue(newValue);
      localStorage.setItem(`kattHalfChord${halfChordIndex}`, newValue);
      calculateAndSetOutput(newValue); // Function to calculate and set the output value
    }
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={5} sm={5}>
        <TextField
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span
                  style={{
                    fontSize: 'small',
                  }}
                >
                  mm
                </span>
              </InputAdornment>
            ),
          }}
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          variant="standard"
          autoComplete="off"
          size="small"
          sx={{ width: '100%' }} // Adjust width as needed
        />
      </Grid>
      <Grid item xs={7} sm={7}>
        <Typography
          variant="body1"
          sx={{ textAlign: 'left', fontWeight: 'bold', color: '#2ecc71' }}
        >
          {outputValue} µm
        </Typography>
      </Grid>
    </Grid>
  );
};

CompareSags.propTypes = { halfChordIndex: PropTypes.string.isRequired };

export default CompareSags;
