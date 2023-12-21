import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import KattUI from '../components/KattUI';
import { KattLensProvider } from '../hooks/KattLensContext.jsx';
import CompareSags from '../components/CompareSags.jsx';
import Grid from '@mui/material/Grid';
import KattChartContainer from '../components/layout/KattChartContainer.jsx';
import KattCopyLenses from '../components/KattCopyLenses.jsx';

function KattDesigner() {
  return (
    <KattLensProvider>
      <Container
        maxWidth="lg"
        sx={{
          width: '100%',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            width: '100%',
            padding: 0,
          }}
        >
          <Grid item sm={12} md={10}>
            <Box>
              <KattUI lensKey={'lens1'} />
              <KattUI lensKey={'lens2'} sx={{ marginTop: '0.25rem' }} />
            </Box>
          </Grid>
          <Grid item sm={12} md={2}>
            <KattCopyLenses />
          </Grid>
        </Grid>
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
          {/* Green Divider */}
          <Box sx={{ height: '0.15rem', backgroundColor: '#2ecc71' }} />
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              fontSize: { xs: '0.8rem', sm: '1rem' },
              color: '#2ecc71',
              textAlign: 'left',
              marginLeft: 1,
            }}
          >
            Sag difference between the two lenses at various distances from the
            centre of the lens:
          </Typography>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="between"
            marginX={1}
          >
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags halfChordIndex="0" />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags halfChordIndex="1" />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags halfChordIndex="2" />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <CompareSags halfChordIndex="3" />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <KattChartContainer />
        </Box>
      </Container>
    </KattLensProvider>
  );
}

export default KattDesigner;
