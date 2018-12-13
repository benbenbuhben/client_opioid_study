import React, { Component } from 'react';
import '../styles/App.css';
// import superagent from 'superagent';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryLegend, VictoryLabel, VictoryArea } from 'victory';

export default class Line extends Component {
  constructor(props){
    super(props)

    this.state = {
      sex_id: 3
    }

    this.handleSexChange = this.handleSexChange.bind(this);
  }

  handleSexChange(e) {
    const sex_id = parseInt(e.target.id);
    this.setState({sex_id})
  }

  render() {
    const {country_data, world_data, country} = this.props;
    // const {sex_id} = this.state;
    const country_data_by_sex = country_data.filter(el => el.sex_id === this.state.sex_id)
    const world_data_by_sex = world_data.filter(el => el.sex_id === this.state.sex_id)
    const sex = country_data_by_sex.length ? country_data_by_sex[0]['sex_id'] : '';
    const sex_text = sex === 1 ? 'Men' : (sex === 2 ? 'Women' : 'Men & Women');


    return (
      <div className="line-container">
        <VictoryChart title={country.concat(" Opioid Deaths (1990-2017)") } className="line" width={600} height={470} scale={{ x: "time" }}>
          <VictoryLabel 
            text={country_data_by_sex.length? country_data_by_sex[0]['location_name'].concat(" Opioid Deaths (1990-2017) for ").concat(sex_text):'' } 
            x={325} 
            y={30} 
            textAnchor="middle"
          />
          <VictoryAxis crossAxis label="Year"/>
          <VictoryAxis dependentAxis label="Deaths per 100,000"/>
          <VictoryLegend x={125} y={100}
            orientation="vertical"
            gutter={20}
            style={{ border: { stroke: "black" }, title: {fontSize: 15 } }}
            data={[
              { name: country_data_by_sex.length? country_data_by_sex[0]['location_name']:'', symbol: { fill: "red", type: "minus" } },
              { name: "World", symbol: { fill: "blue", type: "minus" } },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid red"}
            }}
            data={country_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.val}))}
          />
          <VictoryArea
              data={country_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.upper, y0: +el.lower}))}
              style={{ data: { fill: "#c43a31", opacity:0.2 } }}
          />
          <VictoryLine
              style={{
                data: { stroke: "blue" },
                parent: { border: "1px solid blue"}
              }}
              data={world_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.val}))}
          />
          <VictoryArea
            data={world_data_by_sex.map(el => ({x: new Date(el.year, 1, 1), y: +el.upper, y0: +el.lower}))}
            style={{ data: { fill: "blue", opacity:0.2 } }}
          />
        </VictoryChart>
        <div className="button-container">
          <button onClick={this.handleSexChange} id="1">Male</button>
          <button onClick={this.handleSexChange} id="2">Female</button>
          <button onClick={this.handleSexChange} id="3">Both</button>
        </div>
      </div>
    );
  }
}
