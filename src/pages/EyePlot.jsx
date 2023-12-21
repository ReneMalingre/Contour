import { Height } from '@mui/icons-material';
import My3DScatterPlot from '../components/graphs/My3DScatterPlot';
import { readTestHeightData } from '../utils/readHeightData';
import MedmontImage from '../components/graphs/MedmontImage';
const EyePlot = () => {
  //   const dataPoints = readTestHeightData(false);

  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'auto' }}>
      <MedmontImage />
      {/* <h5>Corneal Data Visualization</h5> */}
      {/* <My3DScatterPlot dataPoints={dataPoints} /> */}
    </div>
  );
};

export default EyePlot;
