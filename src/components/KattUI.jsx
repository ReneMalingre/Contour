import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import { useKattLenses } from '../hooks/useKattLenses';
import KattLens from '../utils/Classes/KattLens';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const KattUI = ({ lensKey }) => {
  const { kattLenses, updateLens } = useKattLenses();
  const lens = kattLenses[lensKey];

  // Initialize the internal state
  const [values, setValues] = useState(getLensValues(lens));
  const [invalidData, setInvalidData] = useState(false);

  // Update internal state when the lens data changes
  useEffect(() => {
    setValues(getLensValues(lens));
  }, [lens]);

  // Helper function to extract lens values
  function getLensValues(lens) {
    return {
      baseCurve: lens.baseCurve,
      asphericity: lens.eValue,
      t1: lens.t1,
      t2: lens.t2,
      slz: lens.slz,
      lensDiameter: lens.lensDiameter,
      color: lens.color,
      drawLandmarkLabels: lens.drawLandmarkLabels,
      drawSagLabels: lens.drawSagLabels,
    };
  }

  const lensKeyLastChar = lensKey.slice(-1);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: updatedValue,
    }));

    // Now use updatedValue for validation and updates
    // this is needed because the setValues function is asynchronous
    const newValues = { ...values, [name]: updatedValue };

    // check that the values are valid
    if (
      newValues.baseCurve < 4 ||
      newValues.baseCurve > 15 ||
      newValues.asphericity < 0 ||
      newValues.asphericity > 2 ||
      newValues.t1 < 20 ||
      newValues.t1 > 80 ||
      newValues.t2 < 20 ||
      newValues.t2 > 80 ||
      newValues.slz < 0 ||
      newValues.slz > 5 ||
      newValues.lensDiameter < 16.5 ||
      newValues.lensDiameter > 18.5
    ) {
      setInvalidData(true);
    } else {
      setInvalidData(false);
      updateKattLens(newValues);
    }
  };

  const updateKattLens = (newValues) => {
    const updatedLens = new KattLens(
      newValues.baseCurve,
      newValues.asphericity,
      newValues.t1,
      newValues.t2,
      newValues.slz,
      newValues.lensDiameter,
      lensKey,

      // ... other properties
    );
    updatedLens.color = values.color;
    updateLens.drawLandmarkLabels = values.drawLandmarkLabels;
    updatedLens.drawSagLabels = values.drawSagLabels;
    // Update the lens in the global context
    updateLens(lensKey, updatedLens);
  };

  return (
    <form>
      <Stack spacing={0.1} direction="column">
        <div
          style={{
            height: '0.25rem',
            width: '100%',
            backgroundColor: values.color,
          }}
        />
        <Grid container spacing={0.25}>
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
                step: 0.1, // allows decimal values
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
                step: 0.1,
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
                step: 1,
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
                step: 1,
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
          <Grid item xs={4}>
            <Typography
              variant="body2"
              style={{
                color: values.color,
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              KATT Lens {lensKeyLastChar}
            </Typography>
          </Grid>
          {invalidData ? (
            <>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  style={{ color: values.color, textAlign: 'center' }}
                >
                  Fix your entries to update the lens.
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={4}>
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
              </Grid>
              <Grid item xs={4}>
                <Typography
                  variant="body2"
                  style={{
                    color: values.color,
                    marginBottom: '0.1rem',
                    textAlign: 'left',
                  }}
                >
                  Back Optic Sag: {lens.sagIncludingBackOpticZone}; T1:{' '}
                  {lens.sagIncludingT1}; T2: {lens.sagIncludingT2}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
        {values.lensDiameter != 16.5 ? (
          <Grid item xs={12}>
            <Typography
              variant="body2"
              style={{
                color: values.color,
                textAlign: 'left',
                marginTop: '1rem',
              }}
            >
              The landing position of this lens assumes a sclera with radius of
              13 mm. Be cautious if you are comparing lenses with different
              diameters.
            </Typography>
          </Grid>
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
