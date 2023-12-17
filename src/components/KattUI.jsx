import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CompactPicker } from 'react-color';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import { useKattLenses } from '../hooks/KattLensContext';

const KattUI = ({ lensKey }) => {
  const { kattLenses, updateLens } = useKattLenses();
  const lens = kattLenses[lensKey];

  const [values, setValues] = useState({
    baseCurve: lens.baseCurve,
    asphericity: lens.eValue,
    t1: lens.t1,
    t2: lens.t2,
    slz: lens.slz,
    lensDiameter: lens.lensDiameter,
    // Add more text fields as needed
    color: lens.color,
    drawLandmarkLabels: false,
    drawSagLabels: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (color) => {
    setValues((prevValues) => ({
      ...prevValues,
      color: color.hex,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedLens = new KattLens(
      values.baseCurve,
      values.asphericity,
      values.t1,
      values.t2,
      values.slz,
      values.lensDiameter,
      values.color,
      values.drawLandmarkLabels,
      values.drawSagLabels,
      // ... other properties
    );
    // Update the lens in the global context
    updateLens(lensKey, updatedLens);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1} direction="column">
        <div
          style={{
            height: '20px',
            width: '100%',
            backgroundColor: values.color,
          }}
        />
        <Grid container spacing={1}>
          <Grid item xs={6} sm={4}>
            <TextField
              name="baseCurve"
              label="Base Curve"
              value={values.baseCurve}
              onChange={handleChange}
              type="number"
              size="small"
              sx={{ mb: 0, width: '90%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ fontSize: 'small' }}>mm</span>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: 4,
                max: 15,
                step: 'any', // allows decimal values
              }}
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              name="asphericity"
              label="e Value"
              value={values.asphericity}
              onChange={handleChange}
              type="number"
              size="small"
              sx={{ mb: 0, width: '90%' }}
              inputProps={{
                min: 0,
                max: 2,
                step: 'any',
              }}
              variant="standard"
              helperText="0 sph, 0.5, 0.98"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              name="t1"
              label="T1"
              value={values.t1}
              onChange={handleChange}
              type="number"
              size="small"
              sx={{ mb: 0, width: '90%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ fontSize: 'small' }}>deg</span>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: 20,
                max: 80,
                step: 'any',
              }}
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              name="t2"
              label="T2"
              value={values.t2}
              onChange={handleChange}
              type="number"
              size="small"
              sx={{ mb: 0, width: '90%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ fontSize: 'small' }}>deg</span>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: 20,
                max: 80,
                step: 'any',
              }}
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              name="slz"
              label="SLZ"
              value={values.slz}
              onChange={handleChange}
              type="number"
              size="small"
              sx={{ mb: 0, width: '90%' }}
              inputProps={{
                min: 0,
                max: 5,
              }}
              variant="standard"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              name="lensDiameter"
              label="Lens Diameter"
              value={values.lensDiameter}
              onChange={handleChange}
              type="number"
              size="small"
              sx={{ mb: 0, width: '90%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ fontSize: 'small' }}>mm</span>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                min: 16.5,
                max: 18.5,
                step: 0.5,
              }}
              variant="standard"
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={6} sm={6}>
            {/* 2/3 of the space for CompactPicker */}
            <FormControl
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: 0,
              }}
            >
              <div style={{ maxWidth: 'fit-content' }}>
                <CompactPicker
                  color={values.color}
                  onChange={handleColorChange}
                />
              </div>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6}>
            {' '}
            {/* Remaining space for checkboxes */}
            <FormControlLabel
              control={
                <Checkbox
                  name="drawLandmarkLabels"
                  checked={values.drawLandmarkLabels}
                  onChange={handleChange}
                />
              }
              label="Show Bands"
              sx={{ mb: 0, width: '90%' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="drawSagLabels"
                  checked={values.drawSagLabels}
                  onChange={handleChange}
                />
              }
              label="Show Sags"
              sx={{ mb: 0, width: '90%' }}
            />
            {/* Add more checkboxes as needed */}
          </Grid>
        </Grid>
        <div
          style={{
            height: '20px',
            width: '100%',
            backgroundColor: values.color,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 1 }} // Using sx for margin-top
        >
          Draw
        </Button>
      </Stack>
    </form>
  );
};

export default KattUI;
