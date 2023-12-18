import './App.css';
import { useRef, useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import KattUI from './components/KattUI';
// import Button from '@mui/material/Button';
import KattLensPlot from './components/graphs/KattLensPlot';
import { KattLensProvider } from './hooks/KattLensContext.jsx';
import CompareSags from './components/CompareSags.jsx';
import Grid from '@mui/material/Grid';
function App() {
  // used to measure the width of the box containing the graph of the lenses
  const boxRef = useRef(null);
  const [plotWidth, setPlotWidth] = useState(800);
  useEffect(() => {
    if (boxRef.current) {
      setPlotWidth(boxRef.current.offsetWidth);
    }
  }, []);
  return (
    <KattLensProvider>
      <Container maxWidth="lg" sx={{ width: '100%', padding: 0, margin: 0 }}>
        <Box sx={{ my: 1, mx: 0 }}>
          <Typography
            variant="h4"
            component="h4"
            gutterBottom
            sx={{ fontSize: { xs: '1.0rem', sm: '1.5rem' }, color: '#0062B1' }}
          >
            KATT Lens Comparison
          </Typography>

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mx: 'auto',
            width: '100%',
            marginTop: 1,
          }}
        >
          <div
            style={{
              height: '0.15rem',
              width: '100%',
              backgroundColor: '#0062B1',
            }}
          />
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, color: '#0062B1' }}
          >
            Sag difference at various distances from the centre of the lens
          </Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags initialWidth={0} />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags initialWidth={3} />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags initialWidth={5} />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags initialWidth={6} />
            </Grid>
            <Grid item xs={6} sm={6} md={3}></Grid>
          </Grid>
          <div
            style={{
              height: '0.15rem',
              width: '100%',
              backgroundColor: '#0062B1',
            }}
          />
        </Box>
        <Box
          ref={boxRef}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            mx: 'auto',
            width: 'fit-content',
            marginTop: 1,
          }}
        >
          <KattLensPlot plotWidth={plotWidth * 0.9} />
        </Box>
      </Container>
    </KattLensProvider>
  );
}

export default App;
