import React, { Component } from 'react';
import '../../styles/App.css';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryLegend, VictoryLabel, VictoryArea } from 'victory';

// Convert this to a stateless (function-based) component.
export default class Line extends Component {

  render() {
    const {country_data, world_data, sex_id, country_data_by_sex, sex_text} = this.props;

    const world_data_by_sex = world_data.filter(el => el.sex_id === sex_id);

    const max_domain_country = Math.max.apply(Math, country_data.filter(el => el.sex_id === 1).map(el => el.upper));
    const max_domain_world = Math.max.apply(Math, world_data.filter(el => el.sex_id === 1).map(el => el.upper));
    const max_domain = Math.max(max_domain_country, max_domain_world);

    return (
      <div className="line-container">
        <VictoryChart 
          className="line" 
          width={600} 
          height={449} 
          maxDomain={{y: max_domain }} 
          scale={{ x: 'time' }}
          animate={{ duration: 1500 }}
          style={{
            parent: {
              border: '1px solid #ccc',
              boxShadow: '0.7px 0.7px 0.7px 0.7px #cfcfcf',
            }, 
          }}
        >
          <VictoryLabel 
            text={'Opioid Deaths (1990-2017) for '.concat(sex_text).toUpperCase() } 
            x={250} 
            dx={65}
            y={30} 
            dy={-10}
            textAnchor="middle"
            style={{
              fontFamily:'\'Adamina\', sans-serif',
              fontSize:'16px',
              fill:'#08306b',
              letterSpacing:'1.5px',
              marginTop: '15px',
            }}
          />
          <VictoryAxis crossAxis 
            label="Year" 
            style={{
              axisLabel: {
                fontFamily:'\'Mukta\', sans-serif', 
                fontSize: 18, 
                fontWeight: '400',
                padding: 30,
              },
              grid: {stroke: 'grey', opacity:0.3},
              ticks: {stroke: 'grey', size: 5},
              tickLabels: {
                fontFamily:'\'Mukta\', sans-serif', 
                fontSize: 14, 
                fontWeight: '300',
                padding: 5,
              }, 
            }}
          />
          <VictoryAxis dependentAxis 
            label="Deaths per 100,000"
            style={{
              axisLabel: {
                fontFamily:'\'Mukta\', sans-serif', 
                fontSize: 16, 
                fontWeight: '400', 
                padding: 30,
                margin: 10,
              },
              grid: {stroke: 'grey', opacity:0.3},
              ticks: {stroke: 'grey', size: 5},
              tickLabels: {
                fontFamily:'\'Mukta\', sans-serif', 
                fontSize: 13,
                fontWeight: '300', 
                padding: 5,
              }, 
            }}
            
          />
          <VictoryLegend x={75} y={60}
            orientation="vertical"
            gutter={20}
            style={{ 
              border: { stroke: 'black' }, 
              title: {
                fontFamily:'\'Mukta\', sans-serif', 
                fontSize: '16px',
                fontWeight: '300',
              }, 
              labels: {
                fontFamily:'\'Mukta\', sans-serif', 
                fontSize: 17,
                fontWeight: '300',
                // letterSpacing: '1.5px',
              },
            }}
            data={[
              { name: country_data_by_sex.length ? country_data_by_sex[0]['location_name'] : '', symbol: { fill: '#4292c6', type: 'minus' } },
              { name: 'World', symbol: { fill: 'black', type: 'minus' } },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: '#4292c6' },
              parent: { 
                border: '1px solid #4292c6', 
                paddingTop: '10px',
              },
            }}
            data={country_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.val}))}
            animate={{ duration: 1500 }}
          />
          <VictoryArea
            data={country_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.upper, y0: +el.lower}))}
            style={{ data: { fill: '#4292c6', opacity:0.2 } }}
          />
          <VictoryLine
            style={{
              data: { stroke: '#08306b' },
              parent: { border: '1px solid #4292c6'},
            }}
            data={world_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.val}))}
          />
          <VictoryArea
            data={world_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.upper, y0: +el.lower}))}
            style={{ data: { fill: 'black', opacity:0.2 } }}
          />
        </VictoryChart>
        
      </div>
    );
  }
}
