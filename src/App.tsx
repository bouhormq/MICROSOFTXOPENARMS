import * as React from 'react';
import MarkersExample from './MarkersExample';

const App: React.FC = () => {
  return (
    <div>
      <MarkersExample />
    </div>
  );
};

export const wrapperStyles = {
  wrapper: {
    padding: '15px',
    marginTop: '15px',
  },
  buttonContainer: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: '10px',
    gridAutoColumns: 'max-content',
    padding: '10px 0',
  },
};
export default App;