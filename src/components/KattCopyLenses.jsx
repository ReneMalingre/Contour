import { useKattLenses } from '../hooks/useKattLenses';
import Button from '@mui/material/Button';
import KattLens from '../utils/Classes/KattLens';
const KattCopyLenses = () => {
  const { kattLenses, updateLens } = useKattLenses();

  // get the KattLenses from the global context
  const lens1 = kattLenses['lens1'];
  const lens2 = kattLenses['lens2'];

  const handleCopy1to2 = () => {
    // get the properties of lens1 and copy them to lens2
    const updatedLens2 = new KattLens(
      lens1.baseCurve,
      lens1.eValue,
      lens1.t1,
      lens1.t2,
      lens1.slz,
      lens1.lensDiameter,
      'lens2',
      false,
    );

    // update the global context
    updateLens('lens2', updatedLens2);
  };

  const handleCopy2to1 = () => {
    // get the properties of lens2 and copy them to lens1
    const updatedLens1 = new KattLens(
      lens2.baseCurve,
      lens2.eValue,
      lens2.t1,
      lens2.t2,
      lens2.slz,
      lens2.lensDiameter,
      'lens1',
      false,
    );

    // update the global context
    updateLens('lens1', updatedLens1);
  };
  return (
    <>
      <Button
        onClick={handleCopy1to2}
        variant="contained"
        sx={{ width: 'auto' }}
      >
        Copy 1 to 2
      </Button>
      <Button
        onClick={handleCopy2to1}
        variant="contained"
        sx={{ width: 'auto', margin: '0.25rem' }}
      >
        Copy 2 to 1
      </Button>
    </>
  );
};

KattCopyLenses.propTypes = {};

export default KattCopyLenses;
