import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Line from './Charts/Line';
import Bar from './Charts/Bar';
import scrollToComponent from 'react-scroll-to-component';
import ScrollUpButton from 'react-scroll-up-button';

export default class Infographic extends Component {
  constructor(props){
    super(props);

    this.state = {
      sex_id: 3,
    };

    this.handleSexSelect = this.handleSexSelect.bind(this);
  }

  componentDidUpdate() {
    let resultHeadingScroll = ReactDOM.findDOMNode(this); // eslint-disable-line
    scrollToComponent(resultHeadingScroll, { offset: -10, align: 'top', duration: 900});
  }

  
  handleSexSelect(e) {
    const sex_id = parseInt(e.target.id);
    this.setState({sex_id});
  }

  render() {

    const {sex_id} = this.state.sex_id;

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
        <div className="button-container">
          <button className={this.state.sex_id === 1 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="1">Male</button>
          <button className={this.state.sex_id === 2 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="2">Female</button>
          <button className={this.state.sex_id === 3 ? 'sex-button-focused' : 'sex-button'} onClick={this.handleSexSelect} id="3">Both</button>
        </div>
        <Line 
          country_data={this.props.country_data}
          country={this.props.country}
          world_data={this.props.world_data}
          sex_id={this.state.sex_id}
        />
        <Bar 
          country_data={this.props.country_data}
          country={this.props.country}
          world_data={this.props.world_data}
          sex_id={this.state.sex_id}
        />
      </div>
      
    );
  }
}
