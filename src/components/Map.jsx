import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import data from '../assets/modified_data_2.json';
import Tooltip from './Tooltip';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const options = [{
  name: 'Opioid Deaths (2017)',
  description: 'per 100,000',
  property: 'opioid_rate_both',
  stops: [
    [0, '#f7fbff'],
    [0.25, '#deebf7'],
    [0.5, '#c6dbef'],
    [1, '#9ecae1'],
    [2, '#6baed6'],
    [4, '#4292c6'],
    [8, '#2171b5'],
    [16, '#08519c'],
  ],
}];

export default class Map extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      active: options[0],
      hoveredCountryId:  null,
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
    // this.hoveredCountryId =  null;
    this.tooltipContainer = document.createElement('div');

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [5, 34],
      zoom: 1,
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


      this.map.style.stylesheet.layers.forEach(layer => {
        if (layer['source-layer'] === 'place_label' || layer['source-layer'] === 'country_label') {
          this.map.removeLayer(layer.id);
        }
      });

      // The feature-state dependent fill-opacity expression will render the hover effect
      // when a feature's hover state is set to true.
      this.map.addLayer({
        'id': 'country-fills',
        'type': 'fill',
        'source': 'countries',
        'layout': {},
        'paint': {
          'fill-color': '#08306b',
          'fill-opacity': ['case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0,
          ],
        },
      });

      this.map.addLayer({
        'id': 'country-borders',
        'type': 'line',
        'source': 'countries',
        'layout': {},
        'paint': {
          'line-color': 'black',
          'line-width': 1.4,
          'line-opacity': ['case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.2,
          ],
        },
      });

      

      this.setFill();
    });

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [-50, 0],
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

    // When the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    this.map.on('mousemove', 'country-fills', e => {
      if (e.features.length > 0) {
        if (this.state.hoveredCountryId) {
          // console.log(this.state.hoveredCountryId);
          this.map.setFeatureState({source: 'countries', id: this.state.hoveredCountryId}, { hover: false});
        }
        // console.log(e);
        let hoveredCountryId = e.features[0].id;
        this.setState({hoveredCountryId});
        this.map.setFeatureState({source: 'countries', id: this.state.hoveredCountryId}, { hover: true});
      }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    this.map.on('mouseleave', 'country-fills', () => {
      if (this.state.hoveredCountryId) {
        this.map.setFeatureState({source: 'countries', id: this.state.hoveredCountryId}, { hover: false});
      }
      let hoveredCountryId = null;
      this.setState({hoveredCountryId});
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
          <h2 className="map-header-text">Click on a country to view its infographic.</h2>
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
