import React from 'react';
import { Button } from '@methodzlabs/seo-jungle-components';


const PersoButton = ({status}) => {
  return (
    <div>
      <Button variant={'fill'} color={'secondary'} value={status} size={'little'}/>
    </div>
  );
};

export default PersoButton;