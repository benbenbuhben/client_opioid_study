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
        <div className="flex-child px12 py12 bg-gray-dark color-white shadow-darken10 round txt-s w240 clip txt-truncate">
          {features[0].properties.sovereignt}
        </div>
        <span className="flex-child color-gray-dark triangle triangle--d"></span>
      </div>
    );
  }
}
