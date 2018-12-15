import React, { Component } from 'react';
import '../../styles/App.css';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryLegend, VictoryLabel, VictoryArea } from 'victory';

export default class Line extends Component {
  constructor(props){
    super(props);

    // this.state = {
    //   sex_id: 3,
    // };

    // this.handleSexSelect = this.handleSexSelect.bind(this);
  }

  // handleSexSelect(e) {
  //   const sex_id = parseInt(e.target.id);
  //   this.setState({sex_id});
  // }

  render() {
    const {country_data, world_data, country} = this.props;
    const country_data_by_sex = country_data.filter(el => el.sex_id === this.props.sex_id);
    const world_data_by_sex = world_data.filter(el => el.sex_id === this.props.sex_id);
    const sex = country_data_by_sex.length ? country_data_by_sex[0]['sex_id'] : '';
    const sex_text = sex === 1 ? 'Men' : (sex === 2 ? 'Women' : 'Both Men & Women');

    const country_name = country_data_by_sex.length ? country_data_by_sex[0]['location_name'].concat(' Opioid Deaths (1990-2017)\n' + '\n for ').concat(sex_text).toUpperCase() : '';

    const max_domain_country = Math.max.apply(Math, country_data.filter(el => el.sex_id === 1).map(el=>el.upper));
    const max_domain_world = Math.max.apply(Math, world_data.filter(el => el.sex_id === 1).map(el=>el.upper));
    const max_domain = Math.max(max_domain_country, max_domain_world);

    return (
      <div className="line-container">
        <VictoryChart 
          className="line" 
          width={500} 
          height={350} 
          maxDomain={{y: max_domain }} 
          scale={{ x: 'time' }}
          animate={{ duration: 2000 }}
        >
          <VictoryLabel 
            text={'Opioid Deaths (1990-2017) for '.concat(sex_text).toUpperCase() } 
            x={240} 
            y={30} 
            dy={-10}
            textAnchor="middle"
            style={{
              fontFamily:'\'Adamina\', sans-serif',
              fontSize:'10px',
              fill:'#08306b',
              letterSpacing:'1.5px',
            }}
          />
          <VictoryAxis crossAxis 
            label="Year" 
            style={{
              axisLabel: {fontFamily:'\'Mukta\', sans-serif', fontSize: 10, padding: 30},
              grid: {stroke: 'grey', opacity:0.3},
              ticks: {stroke: 'grey', size: 5},
              tickLabels: {fontFamily:'\'Mukta\', sans-serif', fontSize: 10, padding: 5}, 
            }}
          />
          <VictoryAxis dependentAxis 
            label="Deaths per 100,000"
            style={{
              axisLabel: {fontFamily:'\'Mukta\', sans-serif', fontSize: 10, padding: 30},
              grid: {stroke: 'grey', opacity:0.3},
              ticks: {stroke: 'grey', size: 5},
              tickLabels: {fontFamily:'\'Mukta\', sans-serif', fontSize: 10, padding: 5}, 
            }}
            
          />
          <VictoryLegend x={75} y={60}
            orientation="vertical"
            gutter={20}
            style={{ border: { stroke: 'black' }, title: {fontFamily:'\'Mukta\', sans-serif', fontSize: 15 } }}
            data={[
              { name: country_data_by_sex.length ? country_data_by_sex[0]['location_name'] : '', symbol: { fill: '#4292c6', type: 'minus' } },
              { name: 'World', symbol: { fill: 'black', type: 'minus' } },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: '#4292c6' },
              parent: { border: '1px solid #4292c6'},
            }}
            data={country_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.val}))}
          />
          <VictoryArea
            data={country_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.upper, y0: +el.lower}))}
            style={{ data: { fill: '#4292c6', opacity:0.2 } }}
          />
          <VictoryLine
            style={{
              data: { stroke: '#08306b' },
              parent: { border: '1px solid gray'},
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
