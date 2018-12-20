import React from 'react';
import propTypes from 'prop-types';
import '../styles/Tooltip.css';

export default class Tooltip extends React.Component {

  static propTypes = {
    features: propTypes.array.isRequired,
  };


  render() {
    const { features, active } = this.props;
    
    return (
      <div className="flex-parent-inline flex-parent--center-cross flex-parent--column absolute bottom">
        <div className="flex-child color-white shadow-darken10 round txt-s w140 clip txt-truncate">
          <h4 className="tooltip-header">{features[0].properties.name}</h4>
          {/* <br/> */}
          <table>
            <tbody>
              <tr className={active.name === 'Male' ? 'row-active' : 'row-inactive'}>
                <td>Male</td>
                <td>{parseFloat(features[0].properties.opioid_rate_male).toFixed(2)}</td>
              </tr>
              <tr className={active.name === 'Female' ? 'row-active' : 'row-inactive'}>
                <td>Female</td>
                <td>{parseFloat(features[0].properties.opioid_rate_female).toFixed(2)}</td>
              </tr>
              <tr className={active.name === 'Both' ? 'row-active' : 'row-inactive'}>
                <td>Both</td>
                <td>{parseFloat(features[0].properties.opioid_rate_both).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <span className="flex-child color-white triangle triangle--d"></span>
      </div>
    );
  }
}
