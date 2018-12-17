import pandas as pd
import json
from pprint import pprint

with open('./data.json') as f:
    data = json.load(f)

csv_data = pd.read_csv(
    './IHME-GBD_2017_DATA-37d305ef-1.csv',
    error_bad_lines=False
)
df = pd.DataFrame(csv_data)

df_country = df[(df['location_name'] == 'Afghanistan') & (df['year'] == 2017)]

# The following block of code attempts every name possibility. There are 6 missing from our dataset. 
# There are 177 countries in the geojson file. So 171 will be painted in the map.
dataset = data['features']

for country in dataset:
    country_name_fields = ['name', 'admin', 'name_long', 'name_sort', 'sovereignt', 'subunit', 'geounit', 'brk_name']

    error = True
    name_index = 0

    while error:
        if name_index == len(country_name_fields):
            break
        
        try:
            country_name = country['properties'][country_name_fields[name_index]]
            df_country = df[(df['location_name'] == country_name) & (df['year'] == 2017)]
            opioid_rate_male = df_country[(df['sex_id'] == 1)].iloc[0]['val']
            opioid_rate_female = df_country[(df['sex_id'] == 2)].iloc[0]['val']
            opioid_rate_both = df_country[(df['sex_id'] == 3)].iloc[0]['val']
            opioid_data_location_id = df_country[(df['sex_id'] == 3)].iloc[0]['location_id']
            # Might need to convert from float/decimal
            country['properties']['opioid_rate_male'] = opioid_rate_male
            country['properties']['opioid_rate_female'] = opioid_rate_female
            country['properties']['opioid_rate_both'] = opioid_rate_both
            country['properties']['opioid_data_location_id'] = str(opioid_data_location_id)
            country['id'] = opioid_data_location_id = int(df_country[(df['sex_id'] == 3)].iloc[0]['location_id'])
            error = False

            del country['properties']['sov_a3']
            del country['properties']['adm0_dif']
            del country['properties']['adm0_a3']
            del country['properties']['gu_a3']
            del country['properties']['su_dif']
            del country['properties']['su_a3']
            del country['properties']['brk_a3']
            del country['properties']['brk_group']
            del country['properties']['name_alt']
            del country['properties']['pop_est']
            del country['properties']['gdp_md_est']
            del country['properties']['pop_year']
            del country['properties']['lastcensus']
            del country['properties']['gdp_year']
            del country['properties']['economy']
            del country['properties']['income_grp']
            del country['properties']['wikipedia']
            del country['properties']['fips_10']
            del country['properties']['iso_a2']
            del country['properties']['iso_a3']
            del country['properties']['iso_n3']
            del country['properties']['un_a3']
            del country['properties']['wb_a2']
            del country['properties']['wb_a3']
            del country['properties']['woe_id']
            del country['properties']['adm0_a3_is']
            del country['properties']['adm0_a3_us']
            del country['properties']['adm0_a3_un']
            del country['properties']['adm0_a3_wb']
            
        except IndexError:
            name_index += 1

data['features'] = dataset
with open('./modified_data_2.json', 'w') as outfile:
    json.dump(data, outfile)
    
