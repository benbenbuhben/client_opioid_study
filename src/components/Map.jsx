import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import data from '../assets/modified_data.json';
import Tooltip from './Tooltip';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const options = [{
  name: 'Opioid Death Rate',
  description: 'Deaths per 100,000',
  property: 'opioid_rate_both',
  stops: [
    // [0, '#f7fbff'],
    [0, '#deebf7'],
    [0.25, '#c6dbef'],
    [0.5, '#9ecae1'],
    [1, '#6baed6'],
    [2, '#4292c6'],
    [4, '#2171b5'],
    [8, '#08519c'],
    [16, '#08306b'],
  ],
}, {
  name: 'GDP',
  description: 'Estimate total GDP in millions of dollars',
  property: 'gdp_md_est',
  stops: [
    [0, '#f8d5cc'],
    [1000, '#f4bfb6'],
    [5000, '#f1a8a5'],
    [10000, '#ee8f9a'],
    [50000, '#ec739b'],
    [100000, '#dd5ca8'],
    [250000, '#c44cc0'],
    [5000000, '#9f43d7'],
    [10000000, '#6e40e6'],
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
      // this.tooltipContainer.innerHTML = '';
      // this.tooltipContainer.style.display = 'none';
      ReactDOM.unmountComponentAtNode(this.tooltipContainer);
    }
  }

  // componentDidUpdate() {
  //   this.setFill();
  // }

  componentDidMount() {
    // Listen and wait for component to mount
    // and for window to be ready before initializing map
    window.addEventListener('load', this.setup());
  }

  setup() {
    this.hoveredStateId =  null;
    // Load JS library with token and create JS instance
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
      }); // ID metches `mapbox/streets-v9`

      //   this.map.addLayer({
      //     "id": "country-fills",
      //     "type": "fill",
      //     "source": "countries",
      //     "layout": {},
      //     "paint": {
      //         "fill-color": "#627BC1",
      //         "fill-opacity": ["case",
      //             ["boolean", ["feature-state", "hover"], false],
      //             1,
      //             0.5
      //         ]
      //     }
      // });

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

      //   this.map.on("mousemove", "country-fills", function(e) {
      //     if (e.features.length > 0) {
      //         if (this.hoveredStateId) {
      //             this.map.setFeatureState({source: 'countries', id: this.hoveredStateId}, { hover: false});
      //         }
      //         this.hoveredStateId = e.features[0].id;
      //         this.map.setFeatureState({source: 'countries', id: this.hoveredStateId}, { hover: true});
      //     }
      // });

      // // When the mouse leaves the state-fill layer, update the feature state of the
      // // previously hovered feature.
      // this.map.on("mouseleave", "country-fills", function() {
      //     if (this.hoveredStateId) {
      //         this.map.setFeatureState({source: 'countries', id: this.hoveredStateId}, { hover: false});
      //     }
      //     this.hoveredStateId =  null;
      // });

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
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
          {options.map(renderOptions)}
        </div>
        <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
          <div className='mb6'>
            <h2 className="txt-bold txt-s block">{name}</h2>
            <p className='txt-s color-gray'>{description}</p>
          </div>
          {stops.map(renderLegendKeys)}
        </div>
      </div>
    );
  }
}
