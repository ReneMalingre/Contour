import { useState, useEffect } from 'react';
import { Slider, Box, Grid } from '@mui/material';
import MultiCurveLensPlot from './../graphs/MultiCurveLensPlot';

const MultiCurveChartContainer = () => {
  // Step 1: Initialize chartWidth from localStorage
  const initialWidth = localStorage.getItem('MultiCurveChartWidth')
    ? parseInt(localStorage.getItem('MultiCurveChartWidth'), 10)
    : 100;

  const [chartWidth, setChartWidth] = useState(initialWidth);

  // Step 2: Update localStorage when chartWidth changes
  useEffect(() => {
    localStorage.setItem('MultiCurveChartWidth', chartWidth);
  }, [chartWidth]);

  const handleSliderChange = (event, newValue) => {
    setChartWidth(newValue);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Slider
          value={chartWidth}
          onChange={handleSliderChange}
          aria-labelledby="chart-width-slider"
          valueLabelDisplay="auto"
          orientation="horizontal"
          min={40} // Minimum width percentage
          max={100} // Maximum width percentage
          sx={{ width: 320 }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: `${chartWidth}%`,
            mb: 1,
          }}
        >
          <MultiCurveLensPlot />
        </Box>
      </Grid>
    </Grid>
  );
};

export default MultiCurveChartContainer;
