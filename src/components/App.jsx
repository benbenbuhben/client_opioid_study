import React, {Component} from 'react';
import '../styles/App.css';
import superagent from 'superagent';
import Line from './Line';
import Bar from './Bar';
import Map from './Map'
// import { VictoryChart, VictoryAxis, VictoryLine, VictoryLegend, VictoryLabel, VictoryArea } from 'victory';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      country_data: [],
      world_data: [],
      loading: false
    }

    this.fetchCountryData = this.fetchCountryData.bind(this);
  }

  // Bad to set state twice. Either chain get calls, or use async/await.
  // Also make call for top_countries here. Look into mobx.
  componentDidMount() {
    superagent.get('http://127.0.0.1:8000/api/v1/country/102')
      .then(res => {
        let country_data = res.body;
        // console.log(country_data);
        this.setState({
          country_data
        });
      })

    superagent.get('http://127.0.0.1:8000/api/v1/world')
      .then(res => {
        let world_data = res.body;
        this.setState({
          world_data
        });
      })
  }

  fetchCountryData(country_id){
    superagent.get(`http://127.0.0.1:8000/api/v1/country/${country_id}`)
      .then(res => {
        let country_data = res.body;
        // console.log(country_data);
        this.setState({
          country_data
        });
      })
  }

  render() {
    const {country_data, world_data} = this.state;
    const country = country_data.length ? country_data[0]['location_name'] : '';
    

    return ( 
      <div className="charts">
        <section id="page1">
          <Map fetchCountryData={this.fetchCountryData}/>
        </section>
        <section id="page2">
          <Line 
            country_data={country_data}
            country={country}
            world_data={world_data}
          />
          <Bar 
            country_data={country_data}
            country={country}
            world_data={world_data}
          />
        </section>
      </div>
    );
  }
}
