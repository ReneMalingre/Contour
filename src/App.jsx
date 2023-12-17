import { useState } from 'react';
import BetaLensPlot from './components/graphs/BetaLensPlot';
import './App.css';
import {
  generateKATTLensPoints,
  generateLensPoints,
} from './utils/lensDesigns';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import KattUI from './components/KattUI';
import Button from '@mui/material/Button';
import KattLens from './components/common/KattLens';

function App() {
  const [scale, setScale] = useState(1);
  let radii = [5, 7.8, 10.5];
  let eValues = [0, 0, 0];
  let widths = [8, 8.8, 9.8];
  const lensDesign1 = generateLensPoints(radii, eValues, widths);

  radii = [6, 7.8, 10.5];
  eValues = [0.5, 0, 0];
  widths = [7, 8.8, 9.8];
  const lensDesign2 = generateLensPoints(radii, eValues, widths);

  const kattDesign = generateKATTLensPoints(7.0, 0.98, 16.5, 45, 50, 0);
  const kattDesign2 = generateKATTLensPoints(7.0, 0, 16.5, 45, 50, 0, true);
  // {data: lensDesign1.points, strokeColour: "#0044ff", label: "Lens 1", referenceYs: lensDesign1.referenceLinesY, referenceXs: lensDesign1.referenceLinesX, referenceYPosition: "insideLeft", referenceXPosition: "insideTop"},
  // {data: lensDesign2.points, strokeColour: "#ff0000", label: "Lens 2", referenceYs: lensDesign2.referenceLinesY, referenceXs: lensDesign2.referenceLinesX, referenceYPosition: "insideRight", referenceXPosition: "insideTop"},

  function handleTest() {
    console.log('test');
    let myKattLens = new KattLens(7.0, 0.98, 50, 45, 0, 16.5);
    console.log(myKattLens.guesstimateSLZPointSag(1));
  }

  const datasets = [
    {
      data: kattDesign.points,
      strokeColour: '#00ff00',
      label: 'KATT Lens',
      referenceYs: kattDesign.referenceLinesY.refPoints,
      referenceXs: kattDesign.referenceLinesX.refPoints,
      referenceYPosition: 'insideLeft',
      referenceXPosition: 'insideTop',
      referenceYLabels: kattDesign.referenceLinesY.refLabels,
      referenceXLabels: kattDesign.referenceLinesX.refLabels,
    },
    {
      data: kattDesign2.points,
      strokeColour: '#00ff',
      label: 'KATT Lens 2',
      referenceYs: kattDesign2.referenceLinesY.refPoints,
      referenceXs: kattDesign2.referenceLinesX.refPoints,
      referenceYPosition: 'insideLeft',
      referenceXPosition: 'insideBottom',
      referenceYLabels: kattDesign2.referenceLinesY.refLabels,
      referenceXLabels: kattDesign2.referenceLinesX.refLabels,
    },
  ];

  return (
    <Container maxWidth="sm" sx={{ width: '100%', padding: 0 }}>
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
        >
          Material UI Vite.js example
        </Typography>
        <div>
          <h2>Lens Plots</h2>
          <BetaLensPlot scale={scale} datasets={datasets} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              marginTop: 2,
            }}
          >
            <Button variant="contained" onClick={() => setScale(scale * 1.1)}>
              Zoom In
            </Button>
            <Button variant="contained" onClick={() => setScale(scale / 1.1)}>
              Zoom Out
            </Button>
            <Button variant="contained" onClick={() => handleTest()}>
              Test
            </Button>
          </Box>
        </div>
        <div>
          <h2>KATT Lens UI</h2>
          <KattUI />
        </div>
      </Box>
    </Container>
  );
}

export default App;
