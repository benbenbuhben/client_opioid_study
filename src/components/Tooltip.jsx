import React from 'react';
import propTypes from 'prop-types';

export default class Tooltip extends React.Component {

  static propTypes = {
    features: propTypes.array.isRequired,
  };


  render() {
    const { features, active } = this.props;
    const male = active.name === 'Male' ? <strong><em>Male: </em></strong> : 'Male: ';
    const female = active.name === 'Female' ? <strong><em>Female: </em></strong> : 'Female: ';
    const both = active.name === 'Both' ? <strong><em>Both: </em></strong> : 'Both: ';

    return (
      <div className="flex-parent-inline flex-parent--center-cross flex-parent--column absolute bottom">
        <div className="flex-child px12 py12 bg-gray-dark color-white shadow-darken10 round txt-s w140 clip txt-truncate">
          <strong style={{textDecoration:'underline'}}>{features[0].properties.name}</strong>
          <br/>
          {male} {parseFloat(features[0].properties.opioid_rate_male).toFixed(2)} 
          <br/>
          {female} {parseFloat(features[0].properties.opioid_rate_female).toFixed(2)}
          <br/>
          {both} {parseFloat(features[0].properties.opioid_rate_both).toFixed(2)}
        </div>
        <span className="flex-child color-gray-dark triangle triangle--d"></span>
      </div>
    );
  }
}
