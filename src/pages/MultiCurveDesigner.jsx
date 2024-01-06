import RGPBandUI from '../components/common/RGPBandUI';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MultiCurveProvider } from '../hooks/MultiCurveContext.jsx';
import CompareSags from '../components/CompareSags.jsx';
import Grid from '@mui/material/Grid';
import MultiCurveChartContainer from '../components/layout/MultiCurveChartContainer.jsx';
import MultiCurveCopyLenses from '../components/MultiCurveCopyLenses.jsx';

const MultiCurveDesigner = () => {
  return (
    // wrap the entire page in the MultiCurveProvider to provide the context
    <MultiCurveProvider>
      {' '}
      <div>Multi-Curve RGP Lens Designer</div>;
      <RGPBandUI lensKey={'lens1'} bandIndex={0} />
    </MultiCurveProvider>
  );
};

export default MultiCurveDesigner;
