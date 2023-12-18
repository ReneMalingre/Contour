import { useState } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { GithubPicker } from 'react-color';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import { useKattLenses } from '../hooks/useKattLenses';
import KattLens from './common/KattLens';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const KattUI = ({ lensKey }) => {
  const { kattLenses, updateLens } = useKattLenses();
  const lens = kattLenses[lensKey];
  // console.log(`lensKey ${lensKey} ${lens.lensParametersString()}`);
  // console.log(`${lens.lensBandSagsString()}`);
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
  // console.log(`values ${values.color}`);

  const [dirtyData, setDirtyData] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setDirtyData(true); // Update dirtyData state
  };

  const handleColorChange = (color) => {
    setValues((prevValues) => ({
      ...prevValues,
      color: color.hex,
    }));
    console.log(`color ${color.hex}`);
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
      lensKey,

      // ... other properties
    );
    (updatedLens.color = values.color),
      (updateLens.drawLandmarkLabels = values.drawLandmarkLabels),
      (updatedLens.drawSagLabels = values.drawSagLabels),
      // Update the lens in the global context
      updateLens(lensKey, updatedLens);
    setDirtyData(false); // Reset dirtyData state after update
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={0.1} direction="column">
        <div
          style={{
            height: '0.25rem',
            width: '100%',
            backgroundColor: values.color,
          }}
        />
        <Grid container spacing={0.5}>
          <Grid item xs={4} sm={3} md={2}>
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
          <Grid item xs={4} sm={3} md={2}>
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
          <Grid item xs={4} sm={3} md={2}>
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
          <Grid item xs={4} sm={3} md={2}>
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
          <Grid item xs={4} sm={3} md={2}>
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
          <Grid item xs={4} sm={3} md={2}>
            <TextField
              name="lensDiameter"
              label="Lens Diameter"
              value={values.lensDiameter}
              onChange={handleChange}
              type="number"
              size="small"
              sx={{ mb: 0, width: '95%' }}
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
          <Grid item xs={6}>
            {/* 2/3 of the space for CompactPicker */}
            <FormControl
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: 0,
              }}
            >
              <GithubPicker
                key={values.color}
                color={values.color}
                onChange={handleColorChange}
                width="100%"
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <div
              style={{
                height: '100%',
                width: '100%',
              }}
            >
              {dirtyData ? (
                <>
                  <Typography
                    variant="body2"
                    style={{ color: values.color, textAlign: 'center' }}
                  >
                    Press Update Lens to see new sags
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 1 }} // Using sx for margin-top
                  >
                    Update Lens
                  </Button>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    style={{
                      color: values.color,
                      marginBottom: '0.1rem',
                      textAlign: 'left',
                      fontWeight: 'bold',
                    }}
                  >
                    Sag at Reference ({lens.landingReferencePoint} mm):{' '}
                    {lens.sagIncludingSLZ}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      color: values.color,
                      marginBottom: '0.1rem',
                      textAlign: 'left',
                    }}
                  >
                    Back Optic Sag: {lens.sagIncludingBackOpticZone}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      color: values.color,
                      marginBottom: '0.1rem',
                      textAlign: 'left',
                    }}
                  >
                    T1: {lens.sagIncludingT1}; T2: {lens.sagIncludingT2}
                  </Typography>
                </>
              )}
            </div>
          </Grid>
        </Grid>
        {values.lensDiameter != 16.5 ? (
          <Typography
            variant="body2"
            style={{
              color: values.color,
              textAlign: 'left',
              marginTop: '1rem',
            }}
          >
            The landing position assumes a sclera with radius of 13 mm. Be
            cautious if you are comparing lenses with different diameters.
          </Typography>
        ) : (
          <></>
        )}
      </Stack>
    </form>
  );
};
KattUI.propTypes = {
  lensKey: PropTypes.string.isRequired,
};
export default KattUI;
