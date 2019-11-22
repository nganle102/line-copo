import * as React from 'react';
import { connect } from 'react-redux';

import { IActionType } from './IActionType';
import Search from './Search';

import { removeAccents } from '../helpers/helpers';

class TruckList extends React.Component < any, any > {
    constructor(props: any, Search) {
        super(props);
        this.state = {
            isSearching: false,
            sortBy: '',
            sortDirection: '',
            pages: 0,
            currentPage: 0,
            previousDisabled: false,
            nextDisabled: false,
            trucks: [],
            drivers: [],
            cargoTypes: [],
            statusTypes: [],
            truckTypes: []
        };
    }

    componentDidMount() {
        const self = this;

        fetch('http://localhost:3002/cargoTypes')
            .then(response => response.json())
            .then(data => self.setState({ cargoTypes: data }));

        fetch('http://localhost:3002/drivers')
            .then(response => response.json())
            .then(data => self.setState({ drivers: data }));

        fetch('http://localhost:3002/statusTypes')
            .then(response => response.json())
            .then(data => self.setState({ statusTypes: data }));

        fetch('http://localhost:3002/truckTypes')
            .then(response => response.json())
            .then(data => self.setState({ truckTypes: data }));

        // Can get data and paginate by query
        // http://localhost:3002/trucks?_page=2&_limit=2
        fetch('http://localhost:3002/trucks')
            .then(response => response.json())
            .then(data => {
                data.map((item) => {
                    item.driverName = self.getDriverName(item.driverId);
                    item.statusType = self.getStatusType(item.statusTypeId);
                    item.truckType = self.getTruckType(item.truckTypeId);
                    item.cargoTypes = self.getCargoTypes(item.cargoTypeIds);
                });

                self.setState({ previousDisabled: true, nextDisabled: false });

                self.setState({ trucks: data, pages: Math.ceil(data.length / self.props.pageSize) });
            });
    }

    // #region functions
    getDriverName(id) {
        var result = this.state.drivers.find((item) => { return item.id == id });
        return result == undefined ? 'N/A' : result.name;
    }

    getStatusType(id) {
        var result = this.state.statusTypes.find((item) => { return item.id == id });
        return result == undefined ? 'N/A' : result.name;
    }

    getTruckType(id) {
        var result = this.state.truckTypes.find((item) => { return item.id == id });
        return result == undefined ? 'N/A' : result.name;
    }

    getCargoTypes(types) {
        var result = this.state.cargoTypes.filter((item) => { return types.indexOf(item.id) > -1 });
        return result.length === 0 ? 'N/A' : result.map((el) => { return el.name }).join(', ');
    }

    compare(a, b, direction = 'asc') {
        const A = a.toUpperCase();
        const B = b.toUpperCase();

        let comparison = 0;

        if (direction == 'asc') {
            if (A > B) {
                comparison = 1;
            } else if (A < B) {
                comparison = -1;
            }
        } else {
            if (A < B) {
                comparison = 1;
            } else if (A > B) {
                comparison = -1;
            }
        }

        return comparison;
    }


    sortBy(field, e) {
        e.preventDefault();

        let _direction = '';

        if (this.compare(field, this.state.sortBy) == 0) {
            if (this.state.sortDirection == 'asc') {
                _direction = 'desc';
            } else {
                _direction = 'asc';
            }
        } else {
            // sort ASC by first click
            _direction = 'asc';
        }

        this.setState({ sortDirection: _direction });

        this.setState({ sortBy: field });

        switch (field) {
            case 'plate':
                this.setState({ trucks: this.state.trucks.sort((a, b) => this.compare(a.plate, b.plate, _direction)) });
                break;
            case 'driver':
                this.setState({ trucks: this.state.trucks.sort((a, b) => this.compare(a.driverName, b.driverName, _direction)) });
                break;
            case 'price':
                this.setState({ trucks: this.state.trucks.sort((a, b) => _direction == 'asc' ? (a.price - b.price) : (b.price - a.price)) });
                break;
            case 'year':
                this.setState({
                    trucks: this.state.trucks.sort((a, b) => _direction == 'asc' ? (a.productionYear - b.productionYear) : (b.productionYear - a.productionYear))
                });
                break;
            case 'status':
                this.setState({ trucks: this.state.trucks.sort((a, b) => this.compare(a.statusType, b.statusType, _direction)) });
                break;

            default:
                break;
        }
    }

    getSortDirectionOfColumn(colname) {
        return colname == this.state.sortBy ? this.state.sortDirection : 'none';
    }

    pageNavigate(pageId, e) {
        e.preventDefault();
        this.setState({ previousDisabled: pageId === 0, nextDisabled: pageId === this.state.pages - 1 });
        this.setState({ currentPage: pageId });
    }

    truckDelete(item, e) {
        const self = this;

        e.preventDefault();

        if (!window.confirm("Are you sure you wish to delete this truck?"))
            return;

        fetch('http://localhost:3002/trucks/' + item.id, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(success => {
                    fetch('http://localhost:3002/trucks')
                        .then(response => response.json())
                        .then(data => {
                            data.map((item) => {
                                item.driverName = self.getDriverName(item.driverId);
                                item.statusType = self.getStatusType(item.statusTypeId);
                                item.truckType = self.getTruckType(item.truckTypeId);
                                item.cargoTypes = self.getCargoTypes(item.cargoTypeIds);
                            });
                            self.setState({ trucks: data, pages: Math.ceil(data.length / self.props.pageSize) });

                            if (self.state.currentPage > self.state.pages - 1) {
                                self.setState({ currentPage: self.state.currentPage - 1 });
                            }

                            const _msg: IActionType = { message: `Delete successfully truck: ${item.id} / ${item.plate}`, type: 'DELETE_TRUCK' };
                            self.props.dispatch(_msg);
                        });
                },
                error => {
                    console.log('error:' + error);
                });
    }

    onSearch(keyword) {
        const self = this;

        this.setState({
            isSearching: true,
            sortBy: '',
            sortDirection: '',
            currentPage: 0,
            previousDisabled: false,
            nextDisabled: false,
        });

        // http://localhost:3002/trucks?q=30A-99...
        // not work for multi tables as separated drivers, statuses...

        fetch('http://localhost:3002/trucks')
            .then(response => response.json())
            .then(data => {
                data.map((item) => {
                    item.driverName = self.getDriverName(item.driverId);
                    item.statusType = self.getStatusType(item.statusTypeId);
                    item.truckType = self.getTruckType(item.truckTypeId);
                    item.cargoTypes = self.getCargoTypes(item.cargoTypeIds);
                });

                self.setState({ previousDisabled: true, nextDisabled: false });

                if (keyword != undefined && keyword.length > 0) {
                    // Search by truck plate for driver name
                    let result = data.filter(item => {
                        let _keyword = removeAccents(keyword).toLowerCase();
                        let _driverName = removeAccents(item.driverName).toLowerCase();

                        return item.plate.toLowerCase().indexOf(_keyword) > -1 || _driverName.indexOf(_keyword) > -1;
                    });

                    self.setState({ trucks: result, pages: Math.ceil(result.length / self.props.pageSize), isSearching: false });

                } else {
                    self.setState({ trucks: data, pages: Math.ceil(data.length / self.props.pageSize), isSearching: false });
                }

            });
    }

    // #endregion

    render() {
        const self = this;

        function getCurrentPageTrucks() {
            let lastIndex = (self.state.currentPage + 1) * self.props.pageSize;
            lastIndex = lastIndex < self.state.trucks.length ? lastIndex : self.state.trucks.length;

            let currentPageItems = self.state.trucks.slice(self.state.currentPage * self.props.pageSize, lastIndex);
            // console.log(self.state.currentPage);
            // console.log(lastIndex);

            return currentPageItems.map((item) => {
                return (
                    <tr className="item" key={item.id}>
                        <td className="col-action">
                            <div className="item__action">
                                <a href="#" className="item__delete" onClick={self.truckDelete.bind(self, item)}>Delete</a>
                            </div>
                        </td>
                        <td className="col-truck-plate"><a href={`/addnew.html?id=${item.id}`} className="item__plate">{item.plate}</a></td>
                        <td className="col-cargo">{item.cargoTypes}</td>
                        <td className="col-driver">{item.driverName}</td>
                        <td className="col-truck-type">{item.truckType}</td>
                        <td className="col-price">{item.price.toLocaleString()}</td>
                        <td className="col-dimension">{item.dimension}</td>
                        <td className="col-parking-address"><span className="content-wrapper">{item.address}</span></td>
                        <td className="col-year">{item.productionYear}</td>
                        <td className="col-status">{item.statusType}</td>
                        <td className="col-desc"><span className="content-wrapper">{item.description}</span></td>
                    </tr>
                );
            })
        }

        function pagination() {
            let pages = [];

            // solve react key problem
            for (let i = 0; i < self.state.pages; i++) {
                pages.push({ "id": i, "name": i + 1, "tabIndex": self.state.currentPage <= i ? -1 : 0, "cssClass": self.state.currentPage == i ? "page-item active" : "page-item" });
            }

            return pages.map((el) => {
                return (
                    <li className={el.cssClass} key={el.id}><a className="page-link" href="#" tabIndex={el.tabIndex} onClick={self.pageNavigate.bind(self, el.id)}>{el.name}</a></li>
                );
            })
        }

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12 col-md-7">
                        <a className="btn btn-primary btn-addnewtruck" href="/addnew.html">Add new truck</a>
                    </div>
                    <div className="col-12 col-md-5">
                        <Search autoFocus={true} onSearch={this.onSearch.bind(this)} isSearching={this.state.isSearching} placeholder="Search by plate or driver name" />
                    </div>
                </div>

                <div className="truck-list">
                    <div className="truck-list__table">
                        <table className="table">
                            <thead>
                                <tr className="item">
                                    <th className="col-action" scope="col"></th>
                                    <th className="col-truck-plate col-sortable" scope="col"><a href="#" onClick={this.sortBy.bind(this, 'plate')} className={this.getSortDirectionOfColumn('plate')}>Truck plate</a></th>
                                    <th className="col-cargo" scope="col">Cargo type</th>
                                    <th className="col-driver col-sortable" scope="col"><a href="#" onClick={this.sortBy.bind(this, 'driver')} className={this.getSortDirectionOfColumn('driver')}>Driver</a></th>
                                    <th className="col-truck-type col-sortable" scope="col">Truck type</th>
                                    <th className="col-price col-sortable" scope="col"><a href="#" onClick={this.sortBy.bind(this, 'price')} className={this.getSortDirectionOfColumn('price')}>Price</a></th>
                                    <th className="col-dimension" scope="col">Dimension (L-W-H)</th>
                                    <th className="col-parking-address" scope="col">Parking address</th>
                                    <th className="col-year col-sortable" scope="col"><a href="#" onClick={this.sortBy.bind(this, 'year')} className={this.getSortDirectionOfColumn('year')}>Production year</a></th>
                                    <th className="col-status col-sortable" scope="col"><a href="#" onClick={this.sortBy.bind(this, 'status')} className={this.getSortDirectionOfColumn('status')}>Status</a></th>
                                    <th className="col-desc" scope="col">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                { self.state.trucks.length > 0 &&
                                    getCurrentPageTrucks()
                                }

                                { self.state.trucks.length==0 &&
                                    <tr>
                                        <td colSpan={11}>
                                            <span className="noitems">There's no items.</span>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    { self.state.pages > 1 &&
                        <div className="truck-list__pagination">
                            <nav aria-label="Trucks page navigation">
                                <ul className="pagination justify-content-end">
                                    <li className={`page-item ${self.state.previousDisabled? 'disabled' :''}`}>
                                        <a className="page-link" href="#" onClick={self.pageNavigate.bind(self, self.state.currentPage - 1)} tabIndex={self.state.previousDisabled? -1 :0} aria-disabled={self.state.previousDisabled}>Prev</a>
                                    </li>

                                    {pagination()}

                                    <li className={`page-item ${self.state.nextDisabled? 'disabled' :''}`}>
                                        <a className="page-link" href="#" onClick={self.pageNavigate.bind(self, self.state.currentPage + 1)} tabIndex={self.state.nextDisabled? -1 :0}  aria-disabled={self.state.nextDisabled}>Next</a>
                                    </li>
                                </ul>

                            </nav>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default connect()(TruckList);