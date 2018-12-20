import React, { Component } from 'react';
import { VictoryChart, VictoryAxis,  VictoryLabel, VictoryBar } from 'victory';



// Convert this to a stateless (function-based) component. Move componentDidMount call to app and pass down as props.
export default class Bar extends Component {
  constructor(props) {
    super(props);
  }


  
  render() {
    console.log('Bar component re-rendered!');
    let label_text;
    // let {top_countries} = this.state;
    let {country, country_data, sex_id, top_countries, country_data_by_sex, sex_text} = this.props;

    

    country_data = country_data.filter(el=> el.year === 2017 && el.sex_id === sex_id)[0];

    top_countries = top_countries.filter(el => el.sex_id === sex_id).sort((a,b) => (parseFloat(a.val) > parseFloat(b.val)) ? 1 : ((parseFloat(b.val) > parseFloat(a.val)) ? -1 : 0)); 

    let top_countries_as_list = top_countries.filter(el => el.sex_id === sex_id).map(el => el.location_name).reverse();


    if(country && !top_countries_as_list.includes(country)){
      top_countries.push(country_data);
      label_text = `IN RELATION TO 2017 TOP 20 (${sex_text.toUpperCase()})`; 
    }
    else if (country){
      top_countries = top_countries.filter(el => el.location_name !== country);
      top_countries.push(country_data);
      label_text = `IN RELATION TO 2017 TOP 20 (${sex_text.toUpperCase()})`; 
    }

    console.log(top_countries);


    let num_countries = top_countries.length;

    if(num_countries && top_countries){
      return (
        <div className="bar-container">
          <VictoryChart  
            domain={{ x: [0, 21], y: [0.5, num_countries] }} 
            domainPadding={{ x: 0, y: 10 }} 
            padding={{left: 105, bottom:25, top:19, right:20}}
            width={600} height={400}
            style={{
              parent: {
                border: '1px solid #ccc',
                boxShadow: '0.7px 0.7px 0.7px 0.7px #cfcfcf',
              },
            }}
            animate={{ duration: 1500 }}
          >
            <VictoryLabel 
              text={label_text}
              dx={180}
              x={150} 
              y={0} 
              dy={-5}
              textAnchor="middle"
              style={{
                fontFamily:'\'Adamina\', sans-serif',
                fontSize:'14px',
                fill:'#08306b',
                letterSpacing:'1.5px',
              }}
            />
            <VictoryBar horizontal
              barRatio={0.6}
              data={top_countries.map((el, i)=>({x: i + 1, y: parseFloat(el.val), country: el.location_name}))}
              padding={{top: 50, left: 0}}
              style={{
                data: { 
                  fill: d => d.country === country ? '#4292c6' : '#08306b', opacity:'0.8',
                  fontFamily:'\'Mukta\', sans-serif', 
                  fontSize: '9px',
                  fontWeight: '600',
                  letterSpacing: '1.2px',
                },
                labels: {
                  fontFamily:'\'Mukta\', sans-serif', 
                  fontSize: '9px', 
                },
              }}
              animate={{ duration: 1500 }}
              labels={d => parseFloat(d.y).toFixed(2)}
            />
            <VictoryAxis dependentAxis
              tickValues={top_countries.map(el=>el.location_name)}
              style={{
                data: { fill: '#08306b' }, 
                axisLabel: {
                  fontFamily:'\'Mukta\', sans-serif', 
                  fontSize: '13px', 
                  fontWeight: '400',
                  padding: 30},
                tickLabels: {
                  fontFamily:'\'Mukta\', sans-serif', 
                  fontSize: '10px',
                  fontWeight: '400',
                },
              }}
            />  
            <VictoryAxis crossAxis
              label="Deaths per 100,000 (2017)"
              tickFormat={[null, 2, null, 4, null, 6, null, 8, null, 10, null, 12, null, 14, null, 16, null, 18, null, 20]}
              style={{
                axis: {stroke: '#756f6a'},
                axisLabel: {
                  fontFamily:'\'Mukta\', sans-serif', 
                  fontSize: 16, 
                  fontWeight: '400',
                  padding: 30},
                grid: {stroke: 'grey', opacity:0.4},
                ticks: {stroke: 'grey', size: 5},
                tickLabels: {
                  fontFamily:'\'Mukta\', sans-serif', 
                  fontSize: 14, 
                  fontWeight: '300',
                  padding: 5}, 
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
