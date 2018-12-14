import React, { Component } from 'react';
import { VictoryChart, VictoryAxis,  VictoryLabel, VictoryBar } from 'victory';
import superagent from 'superagent';

export default class Bar extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      top_countries: [],
    };

  }

  componentDidMount(){
    superagent.get('http://ihme-env.22u24hwmvk.us-west-2.elasticbeanstalk.com/api/v1/top_countries')
      .then(res => {
        let top_countries = res.body;
        this.setState({top_countries});
      });
  }
  
  render() {
    let {top_countries} = this.state;
    
    top_countries = top_countries.filter(el => el.sex_id === 3).sort((a,b) => (parseFloat(a.val) > parseFloat(b.val)) ? 1 : ((parseFloat(b.val) > parseFloat(a.val)) ? -1 : 0)); 
    console.log(top_countries.filter(el=>el.sex_id === 3).map(el=>el.location_name).reverse());

    if(top_countries.length){
      return (
        <div className="bar-container">
          <VictoryChart  
            domain={{ x: [0, 15], y: [0.5, 25] }} 
            domainPadding={{ x: 0, y: 10 }} 
            padding={{left: 100, bottom:50, top:50}}
            width={600} height={400}
            style={{
              border:'1px solid black',
            }}
          >
            <VictoryLabel 
              text="DEATHS FROM OPIOID USE WORLDWIDE  (TOP 25)" 
              dx={180}
              x={150} 
              y={30} 
              textAnchor="middle"
              style={{
                fontFamily:"'Adamina', sans-serif",
                fontSize:'12px',
                fill:'#08306b',
                letterSpacing:'1.5px',
              }}
            />
            <VictoryBar horizontal
              barRatio={0.6}
              data={top_countries.map((el, i)=>({x: i + 1, y: parseFloat(el.val)}))}
              padding={{top: 50}}
              style={{
                data: { fill: '#08306b', opacity:'0.8' },
              }}
            />
            <VictoryAxis dependentAxis
              tickValues={top_countries.map(el=>el.location_name)}
              style={{
                data: { fill: '#08306b' }, tickLabels: {fontFamily:"'Mukta', sans-serif", fontSize: '8px'},
              }}
            />  
            <VictoryAxis crossAxis
              label="Deaths per 100,000 (2017)"
              tickFormat={[null, 2, null, 4, null, 6, null, 8, null, 10, null, 12, null, 14]}
              style={{
                axis: {stroke: '#756f6a'},
                axisLabel: {fontFamily:"'Mukta', sans-serif", fontSize: 10, padding: 30},
                grid: {stroke: 'grey', opacity:0.4},
                ticks: {stroke: 'grey', size: 5},
                tickLabels: {fontFamily:"'Mukta', sans-serif", fontSize: 10, padding: 5}, 
              }}
            />  
          </VictoryChart>
        </div>
      );
    }
    else{
      return <div></div>;
    }
  }
}
