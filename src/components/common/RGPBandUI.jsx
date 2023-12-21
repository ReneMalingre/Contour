import React, { useState, useContext } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  Typography,
} from '@mui/material';
import { MultiCurveContext } from '../context/MultiCurveContext';
import { calculateSag, calculateTangentSag } from '../../utils/lensDesigns'; // Assuming a utility function for sag calculation

const RGPBandUI = ({ bandKey }) => {
  const [formType, setFormType] = useState('Asphere');
  const [inputValues, setInputValues] = useState({
    angle: isToric ? [10, 10] : [10],
    width: isToric ? [0.1, 0.1] : [0.1],
    radius: isToric ? [3, 3] : [3],
    eValue: isToric ? [0, 0] : [0],
  });
  const { updateLensBand } = useContext(MultiCurveContext);

  const handleFormTypeChange = (event) => {
    setFormType(event.target.value);
  };

  const handleInputChange = (name, index, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: prevValues[name].map((val, i) => (i === index ? value : val)),
    }));
  };

  const handleSubmit = () => {
    // Validate inputs here

    // Calculate sags and update context
    // const sags = inputValues.angle.map((angle, index) => calculateSag(inputValues, index, formType));
    updateLensBand(bandKey, { ...inputValues, sags });
  };

  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Band Type</FormLabel>
        <RadioGroup
          row
          name="bandType"
          value={formType}
          onChange={handleFormTypeChange}
        >
          <FormControlLabel
            value="Tangent"
            control={<Radio />}
            label="Tangent"
          />
          <FormControlLabel
            value="Asphere"
            control={<Radio />}
            label="Asphere"
          />
        </RadioGroup>
      </FormControl>

      <Grid container spacing={2}>
        {formType === 'Tangent' && (
          <>
            {[...Array(isToric ? 2 : 1)].map((_, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Angle ${index + 1} (Degrees)`}
                    type="number"
                    value={inputValues.angle[index]}
                    onChange={(e) =>
                      handleInputChange(
                        'angle',
                        index,
                        parseFloat(e.target.value),
                      )
                    }
                    inputProps={{ min: 10, max: 80, step: 'any' }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Width ${index + 1} (mm)`}
                    type="number"
                    value={inputValues.width[index]}
                    onChange={(e) =>
                      handleInputChange(
                        'width',
                        index,
                        parseFloat(e.target.value),
                      )
                    }
                    inputProps={{ min: 0.1, max: 5, step: 'any' }}
                    fullWidth
                  />
                </Grid>
              </React.Fragment>
            ))}
          </>
        )}

        {formType === 'Asphere' && (
          <>
            {[...Array(isToric ? 2 : 1)].map((_, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={`Radius ${index + 1} (mm)`}
                    type="number"
                    value={inputValues.radius[index]}
                    onChange={(e) =>
                      handleInputChange(
                        'radius',
                        index,
                        parseFloat(e.target.value),
                      )
                    }
                    inputProps={{ min: 3, max: 15, step: 'any' }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={`Width ${index + 1} (mm)`}
                    type="number"
                    value={inputValues.width[index]}
                    onChange={(e) =>
                      handleInputChange(
                        'width',
                        index,
                        parseFloat(e.target.value),
                      )
                    }
                    inputProps={{ min: 0.1, max: 15, step: 'any' }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={`e Value ${index + 1}`}
                    type="number"
                    value={inputValues.eValue[index]}
                    onChange={(e) =>
                      handleInputChange(
                        'eValue',
                        index,
                        parseFloat(e.target.value),
                      )
                    }
                    inputProps={{ min: 0, max: 2, step: 'any' }}
                    fullWidth
                  />
                </Grid>
              </React.Fragment>
            ))}
          </>
        )}
      </Grid>

      <button onClick={handleSubmit}>Update Lens Band</button>
    </div>
  );
};

export default RGPBandUI;
