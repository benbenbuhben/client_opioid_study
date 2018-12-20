import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Line from './Charts/Line';
import Bar from './Charts/Bar';
import scrollToComponent from 'react-scroll-to-component';
import ScrollUpButton from 'react-scroll-up-button';
import '../styles/Infographic.css';
import superagent from 'superagent';

export default class Infographic extends Component {
  constructor(props){
    super(props);

    this.state = {
      sexID: 3,
      topCountries: [],
    };

    this.handleSexSelect = this.handleSexSelect.bind(this);
  }

  componentDidUpdate() {
    let resultHeadingScroll = ReactDOM.findDOMNode(this); // eslint-disable-line
    scrollToComponent(resultHeadingScroll, { offset: -10, align: 'top', duration: 900});
  }

  componentDidMount(){
    const baseURL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : 'http://ihme-env.22u24hwmvk.us-west-2.elasticbeanstalk.com';
    
    superagent.get(`${baseURL}/api/v1/top_countries`)
      .then(res => {
        let topCountries = res.body;
        this.setState({topCountries});
      });
  }

  handleSexSelect(e) {
    const sexID = parseInt(e.target.id);
    this.setState({sexID});
  }

  render() {

    let {country, countryData, worldData} = this.props;
    let {sexID, topCountries} = this.state;

    // console.log(this.props.countryData);

    const country_rank = countryData.length && countryData.filter(el=> el.year === 2017 && el.sex_id === sexID)[0].rank;

    const countryDataBySex = countryData.filter(el => el.sex_id === sexID);

    const sex = countryDataBySex.length ? countryDataBySex[0]['sex_id'] : '';
    const sexText = sex === 1 ? 'Men' : (sex === 2 ? 'Women' : 'Both Sexes');

    // console.log(countryData);

    const scrollButtonStyle = {
      display: 'block',
      position: 'relative',
      right: '0',
      bottom: '0',
      width: '50px',
      margin: 'auto',
      transition: 'opacity 0.5s ease-in-out 0s',
      opacity: '0.4',
      fill: 'black',
      backgroundColor: 'transparent',
      zIndex: '1',  
    };

    let arrow = <ScrollUpButton style={scrollButtonStyle} ToggledStyle={{right: 0, opacity: 0.5}} ContainerClassName="scroll-up-button"/>;

    return (
      <div>
        {arrow}
        <h2 className="country-title">{this.props.country}</h2>
        <h3 className="rank">#{country_rank} OF 177 COUNTRIES <br/><em>(ranked by highest rates)</em></h3>
        
        <div className="button-container">
          <button className={this.state.sexID === 1 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="1">Male</button>
          <button className={this.state.sexID === 2 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="2">Female</button>
          <button className={this.state.sexID === 3 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="3">Both</button>
        </div>
        <div className="chartContainer">
          <Bar 
            countryData={countryData}
            country={country}
            worldData={worldData}
            sexID={sexID}
            topCountries={topCountries}
            countryDataBySex={countryDataBySex}
            sexText={sexText}
          />
          <Line 
            countryData={countryData}
            country={country}
            worldData={worldData}
            sexID={sexID}
            countryDataBySex={countryDataBySex}
            sexText={sexText}
          />
          
        </div>
      </div>
      
    );
  }
}
