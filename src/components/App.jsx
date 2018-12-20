import React, {Component} from 'react';
import '../styles/App.css';
import superagent from 'superagent';
import Map from './Map';
import Infographic from './Infographic';
import HamburgerMenu from 'react-hamburger-menu';
import { ClipLoader } from 'react-spinners';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countryData: [],
      worldData: [],
      loading: true,
    };

    this.fetchCountryData = this.fetchCountryData.bind(this);
  }

  componentDidMount() {
    const baseURL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : 'http://ihme-env.22u24hwmvk.us-west-2.elasticbeanstalk.com';

    superagent.get(`${baseURL}/api/v1/world`)
      .then(res => {
        const worldData = res.body;
        this.setState({worldData});
        this.setState({loading:false});
      });
  }

  fetchCountryData(country_id){
    const baseURL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : 'http://ihme-env.22u24hwmvk.us-west-2.elasticbeanstalk.com';
    
    superagent.get(`${baseURL}/api/v1/country/${country_id}`)
      .then(res => {
        const countryData = res.body;
        this.setState({countryData});
      });
  }

  render() {
    const {countryData, worldData} = this.state;
    const country = countryData.length ? countryData[0]['location_name'] : '';

    if(this.state.loading){
      return(
        <div  className="spinner">
          <ClipLoader
            sizeUnit={'px'}
            size={150}
            color={'#08306b'}
            loading={this.state.loading}
          />
        </div>
      );
    }
    else{
      return ( 
        <div className="body">
          <header className="header">
            <div className="header-tab">IHME</div>
            <div className="hamburger-menu">
              <HamburgerMenu 
                width={39}
                height={20}
                strokeWidth={3}
                rotate={0}
                color='black'
                borderRadius={0}
                animationDuration={0.5}
              />
            </div>
            <h1 className="page-title">Opioid Deaths in the World</h1>
            <h2 className="subtitle">FINDINGS FROM THE GLOBAL BURDEN OF DISEASE STUDY</h2>
          </header>
          <section id="page1">
            <Map fetchCountryData={this.fetchCountryData}/>
          </section>
          <section id="page2" style={{display: countryData.length ? 'block' : 'none' }}>
            <Infographic
              countryData={countryData}
              country={country}
              worldData={worldData}
            />
          </section>        
        </div>
      );
    }
  }
}
