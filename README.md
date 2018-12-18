<a id="top"></a>

# Opioid Study Client

**Author**: Ben Hurst

**Version**: 0.1.0

**Live Site**: http://ihme-opioid-study.s3-website-us-west-2.amazonaws.com/

**Live Server**: http://ihme-env.22u24hwmvk.us-west-2.elasticbeanstalk.com/api/v1/world

**Back-end GitHub Repo:** https://github.com/benbenbuhben/opioid_study_api
___

## Table of contents

* [Overview](#overview)
* [Getting Started](#getting-started)
* [Change Log](#change-log)

___

<a id="overview"></a>
## Overview

Interactive and dynamic data visualization tool using Mapbox GL and D3 (VictoryJS) to help understand the world's opioid epidemic.

**Key Features:**

* React.js components configured to consume [opioid_study_api](https://github.com/benbenbuhben/opioid_study_api) endpoints. World and Country statistics are dynamically loaded with current data from API call.

* Interactive map rendered using [Mapbox GL](https://www.mapbox.com/mapbox-gl-js/api/) and a custom GeoJSON modification/generation script (assets/modify_geojson.py).

* Charts enabled by [VictoryJS](https://formidable.com/open-source/victory/).

___

<a id="getting-started"></a>

## Getting Started in Development (using yarn)

In a terminal instance:

1. ```git clone https://github.com/benbenbuhben/client_opioid_study.git```
2. ```cd client_opioid_study/```
3. ```yarn install``` to install required dependencies.
4. ```touch env``` and add your Mapbox access key as REACT_APP_MAPBOX_ACCESS_TOKEN.
5. ```yarn start```

<a id="change-log"></a> 

## Change Log

12-11-2018 4:00pm - Initial Scaffolding.

12-12-2018 11:31am - API endpoint integration functional. D3-based charts successfully rendering.

12-12-2018 5:45pm - Map successfully rendering with opioid stats data layer.

12-13-2018 09:31pm - Styling complete

12-13-2018 10:40pm - Deployed to AWS S3.

12-16-2018 08:01pm - Updated tooltip. Added toggle for Male, Female.

[Back to top](#top)
