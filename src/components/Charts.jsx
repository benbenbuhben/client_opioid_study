import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Line from './Charts/Line';
import Bar from './Charts/Bar';
import scrollToComponent from 'react-scroll-to-component';
import ScrollUpButton from 'react-scroll-up-button';

export default class Charts extends Component {

  componentDidUpdate() {
    // if(this.props.country_data.length){
    let resultHeadingScroll = ReactDOM.findDOMNode(this); // eslint-disable-line
    console.log('should be scrolling' + this.props.country_data.length);
    
    scrollToComponent(resultHeadingScroll, { offset: -10, align: 'top', duration: 900});
    // }
  }

  render() {

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
        <Line 
          country_data={this.props.country_data}
          country={this.props.country}
          world_data={this.props.world_data}
        />
        <Bar 
          country_data={this.props.country_data}
          country={this.props.country}
          world_data={this.props.world_data}
        />
        
      </div>
      
    );
  }
}
