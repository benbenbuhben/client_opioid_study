import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import data from '../assets/modified_data.json';
import Tooltip from './Tooltip';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const options = [{
  name: 'Opioid Death Rate',
  description: 'Deaths per 100,000',
  property: 'opioid_rate_both',
  stops: [
    [0, '#deebf7'],
    [0.25, '#c6dbef'],
    [0.5, '#9ecae1'],
    [1, '#6baed6'],
    [2, '#4292c6'],
    [4, '#2171b5'],
    [8, '#08519c'],
    [16, '#08306b'],
  ],
}];

export default class Map extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      active: options[0],
    };
  }

  setTooltip(features) {
    if (features.length && features[0].properties && features[0].properties.sovereignt) {
      ReactDOM.render(
        React.createElement(
          Tooltip, {
            features,
          }
        ),
        this.tooltipContainer
      );
      this.tooltipContainer.style.display = 'block';
    } else {
      ReactDOM.unmountComponentAtNode(this.tooltipContainer);
    }
  }

  componentDidMount() {
    // Listen and wait for component to mount
    // and for window to be ready before initializing map
    window.addEventListener('load', this.setup());
  }

  setup() {
    this.hoveredStateId =  null;
    this.tooltipContainer = document.createElement('div');

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [5, 34],
      zoom: 1.5,
    });

    this.map.on('load', () => {
      this.map.addSource('countries', {
        type: 'geojson',
        data,
      });

      this.map.addLayer({
        id: 'countries',
        type: 'fill',
        source: 'countries',
      });



      this.map.addLayer({
        'id': 'country-borders',
        'type': 'line',
        'source': 'countries',
        'layout': {},
        'paint': {
          'line-color': '#627BC1',
          'line-width': 1,
        },
      });

      this.setFill();
    });

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [-120, 0],
    }).setLngLat([0,0]).addTo(this.map);
    
    this.map.on('mousemove', e => {
      const features = this.map.queryRenderedFeatures(e.point);
      tooltip.setLngLat(e.lngLat);
      this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      this.setTooltip(features);
    });

    this.map.on('click', e => {
      const features = this.map.queryRenderedFeatures(e.point);
      this.props.fetchCountryData(features[0].properties.opioid_data_location_id);
    });
  }

  setFill() {
    const { property, stops } = this.state.active;
    this.map.setPaintProperty('countries', 'fill-color', {
      property,
      stops,
    });    
  }

  render() {
    const { name, description, stops, property } = this.state.active;
    const renderLegendKeys = (stop, i) => {
      return (
        <div key={i} className='txt-s'>
          <span className='mr6 round-full w12 h12 inline-block align-middle' style={{ backgroundColor: stop[1] }} />
          <span>{`${stop[0].toLocaleString()}`}</span>
        </div>
      );
    };

    const renderOptions = (option, i) => {
      return (
        <label key={i} className="toggle-container">
          <input onChange={() => this.setState({ active: options[i] })} checked={option.property === property} name="toggle" type="radio" />
          <div className="toggle txt-s py3 toggle--active-white">{option.name}</div>
        </label>
      );
    };

    return (
      <React.Fragment>
        <div className="map-header">
        <h2 className="map-header-text">Select a country to view its infographic.</h2>
        </div>
        <div ref={el => this.mapContainer = el} className="relative">

          <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
            <div className='mb6'>
              <h2 className="txt-bold txt-s block">{name}</h2>
              <p className='txt-s color-gray'>{description}</p>
            </div>
            {stops.map(renderLegendKeys)}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
