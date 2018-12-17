import React, {Component} from 'react';
import '../styles/App.css';
import superagent from 'superagent';
import Map from './Map';
import Infographic from './Infographic';
import HamburgerMenu from 'react-hamburger-menu';
import { ClipLoader } from 'react-spinners';
import { CSSTransition } from 'react-transition-group';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      country_data: [],
      world_data: [],
      loading: true,
    };

    this.fetchCountryData = this.fetchCountryData.bind(this);
  }

  componentDidMount() {
    superagent.get('http://ihme-env.22u24hwmvk.us-west-2.elasticbeanstalk.com/api/v1/world')
      .then(res => {
        const world_data = res.body;
        this.setState({world_data});
        this.setState({loading: false});
      });
  }

  fetchCountryData(country_id){
    superagent.get(`http://ihme-env.22u24hwmvk.us-west-2.elasticbeanstalk.com/api/v1/country/${country_id}`)
      .then(res => {
        const country_data = res.body;
        this.setState({country_data});
      });
  }

  render() {
    const {country_data, world_data} = this.state;
    const country = country_data.length ? country_data[0]['location_name'] : '';

    if(this.state.loading){
      return(
        <div  className="spinner">
          <ClipLoader
            sizeUnit={'px'}
            size={150}
            color={'#123abc'}
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
            <CSSTransition
              classNames="results"
              in={true}
              appear={true}
              timeout={500}
            >
              <Map className="results" fetchCountryData={this.fetchCountryData}/>
            </CSSTransition>
          </section>
          <section id="page2">
            <Infographic
              country_data={country_data}
              country={country}
              world_data={world_data}
            />
          </section>        
        </div>
      );
    }
  }
}
