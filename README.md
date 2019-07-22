# line-copo
Navigosearch Line Copo

**Usage**

Download folder. Open command window <br/>
Run command `$ npm install --save-dev webpack` <br/>
Run command `$ npm run build` <br/>
Run command `$ npm run start` (start run website) <br/>

Can change `pageSize` to test paging if less data: `<TruckList pageSize={2} />`

**Accomplished**:

1/ List
- Sort for some column
- Pagination
- Search: by truck plate for driver name; Clear sort on searching
- Delete item form search page, warning before delete, delete item in database

2/ Add new truck
- Validate form: required fields, truck plate format, maximum of cargoTypes (multiselect)
- Display counter for address and description

3/ Edit truck

4/ Additional
- Use webpack & NPM, buld to dist folder in production environment as request
- Use bootstrap framework (can refine to use partial from bootstrap but I'm lazy)
- Run well with json-server (mock database)

5/ Validation: 
- Validate truck plate is not yet existent
- Show alert message
- Scroll to alert on submit


**Remaining task**
- Implement autocomplete for dropdown: cargoType, driver

