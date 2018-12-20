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
      sex_id: 3,
      top_countries: [],
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
        let top_countries = res.body;
        this.setState({top_countries});
      });
  }

  handleSexSelect(e) {
    const sex_id = parseInt(e.target.id);
    this.setState({sex_id});
  }

  render() {

    let {country, country_data, world_data} = this.props;
    let {sex_id, top_countries} = this.state;

    // console.log(this.props.country_data);

    const country_rank = country_data.length && country_data.filter(el=> el.year === 2017 && el.sex_id === sex_id)[0].rank;

    const country_data_by_sex = country_data.filter(el => el.sex_id === sex_id);

    const sex = country_data_by_sex.length ? country_data_by_sex[0]['sex_id'] : '';
    const sex_text = sex === 1 ? 'Men' : (sex === 2 ? 'Women' : 'Both Sexes');

    // console.log(country_data);

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
          <button className={this.state.sex_id === 1 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="1">Male</button>
          <button className={this.state.sex_id === 2 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="2">Female</button>
          <button className={this.state.sex_id === 3 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="3">Both</button>
        </div>
        <div className="chartContainer">
          <Bar 
            country_data={country_data}
            country={country}
            world_data={world_data}
            sex_id={sex_id}
            top_countries={top_countries}
            country_data_by_sex={country_data_by_sex}
            sex_text={sex_text}
          />
          <Line 
            country_data={country_data}
            country={country}
            world_data={world_data}
            sex_id={sex_id}
            country_data_by_sex={country_data_by_sex}
            sex_text={sex_text}
          />
          
        </div>
      </div>
      
    );
  }
}
