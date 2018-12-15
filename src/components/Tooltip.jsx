import React from 'react'
import propTypes from 'prop-types'

export default class Tooltip extends React.Component {

  static propTypes = {
    features: propTypes.array.isRequired,
  };

  render() {
    const { features } = this.props;

    return (
      <div className="flex-parent-inline flex-parent--center-cross flex-parent--column absolute bottom">
        <div className="flex-child px12 py12 bg-gray-dark color-white shadow-darken10 round txt-s w140 clip txt-truncate">
          <strong>{features[0].properties.name}</strong>
          <br/>
          Male: {parseFloat(features[0].properties.opioid_rate_male).toFixed(2)} 
          <br/>
          Female: {parseFloat(features[0].properties.opioid_rate_female).toFixed(2)}
          <br/>
          Both: {parseFloat(features[0].properties.opioid_rate_both).toFixed(2)}
        </div>
        <span className="flex-child color-gray-dark triangle triangle--d"></span>
      </div>
    );
  }
}
