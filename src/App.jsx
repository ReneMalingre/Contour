import { useState } from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import KattUI from './components/KattUI';
import Button from '@mui/material/Button';
import KattLensPlot from './components/graphs/KattLensPlot';
import { KattLensProvider } from './hooks/KattLensContext.jsx';

function App() {
  const [scale, setScale] = useState(1);
  // function handleTest() {
  //   console.log('test');
  //   let myKattLens = new KattLens(7.0, 0.98, 50, 45, 0, 16.5);
  //   console.log(myKattLens.guesstimateSLZPointSag(1));
  // }

  return (
    <KattLensProvider>
      <Container maxWidth="lg" sx={{ width: '100%', padding: 0 }}>
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
          >
            Renés Lens Design Thing
          </Typography>
          <div>
            <h2>Lens Plots</h2>
            <KattLensPlot scale={scale} plotWidth={800} />
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
              {/* <Button variant="contained" onClick={() => handleTest()}>
              Test
            </Button> */}
            </Box>
          </div>
          <div>
            <KattUI lensKey={'lens1'} />
          </div>
          <div
            style={{
              marginTop: '1rem',
            }}
          >
            <KattUI lensKey={'lens2'} />
          </div>
        </Box>
      </Container>
    </KattLensProvider>
  );
}

export default App;
