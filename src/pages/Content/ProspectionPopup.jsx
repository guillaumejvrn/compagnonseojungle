import React from 'react';

const ProspectionPopup = ({ status }) => {
  // const [data, setData] = React.useState(null);

  if (status === 'PENDING') {
    return (
      <div>
        <div className="prospection-popup">Votre demande a bien été prise en compte</div>
      </div>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <div>
        <div className="prospection-popup">Une prospection est déjà en cours pour ce site.</div>
      </div>
    );
  }

  if (status === 'ERROR' || status === 'undefined' || status === null || status === 'null') {
    return (
      <div>
        <p>bug</p>
      </div>
    );
  };
  }


export default ProspectionPopup;