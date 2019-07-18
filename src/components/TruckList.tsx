import * as React from 'react';

class TruckList extends React.Component {
    render() {
        return (
            <div className="truck-list">
                <div className="truck-list__table">
                    <table className="table">
                        <thead>
                            <tr className="item">
                                <th className="col-action" scope="col"></th>
                                <th className="col-truck-plate" scope="col">Truck plate</th>
                                <th className="col-cargo" scope="col">Cargo type</th>
                                <th className="col-driver" scope="col">Driver</th>
                                <th className="col-truck-type" scope="col">Truck type</th>
                                <th className="col-price" scope="col">Price</th>
                                <th className="col-dimension" scope="col">Dimension (L-W-H)</th>
                                <th className="col-parking-address" scope="col">Parking address</th>
                                <th className="col-year" scope="col">Production year</th>
                                <th className="col-status" scope="col">Status</th>
                                <th className="col-desc" scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="item">
                                <td className="col-action">
                                    <div className="item__action">
                                        <a href="#" className="item__edit">Edit</a>
                                        <a href="#" className="item__delete">Delete</a>
                                    </div>
                                </td>
                                <td className="col-truck-plate">30A-50493</td>
                                <td className="col-cargo">Computer, Electronic</td>
                                <td className="col-driver">Nguyễn Văn A</td>
                                <td className="col-truck-type">5 ton</td>
                                <td className="col-price">1,000,000,000</td>
                                <td className="col-dimension">10-2-1.5</td>
                                <td className="col-parking-address"><span className="content-wrapper">No. 128, Hoàn Kiếm street, Hà Nội</span></td>
                                <td className="col-year">2010</td>
                                <td className="col-status">In-use</td>
                                <td className="col-desc"></td>
                            </tr>
                            <tr className="item">
                                <td className="col-action">
                                    <div className="item__action">
                                        <a href="#" className="item__edit">Edit</a>
                                        <a href="#" className="item__delete">Delete</a>
                                    </div>
                                </td>
                                <td className="col-truck-plate">30A-12345</td>
                                <td className="col-cargo">Computer, Electronic</td>
                                <td className="col-driver">Nguyễn Văn B</td>
                                <td className="col-truck-type">10 ton</td>
                                <td className="col-price">1,000,000,000</td>
                                <td className="col-dimension">9.8-1.8-1.8</td>
                                <td className="col-parking-address"><span className="content-wrapper">No. 128, Hoàn Kiếm street, Hà Nội</span></td>
                                <td className="col-year">2010</td>
                                <td className="col-status">New</td>
                                <td className="col-desc"></td>
                            </tr>
                            <tr className="item">
                                <td className="col-action">
                                    <div className="item__action">
                                        <a href="#" className="item__edit">Edit</a>
                                        <a href="#" className="item__delete">Delete</a>
                                    </div>
                                </td>
                                <td className="col-truck-plate">30A-99999</td>
                                <td className="col-cargo">Kid toys, Computer</td>
                                <td className="col-driver">Nguyễn Văn C</td>
                                <td className="col-truck-type">20 ton</td>
                                <td className="col-price">1,000,000,000</td>
                                <td className="col-dimension">10-2-1.5</td>
                                <td className="col-parking-address"><span className="content-wrapper">No. 128, Hoàn Kiếm street, Hà Nội</span></td>
                                <td className="col-year">2010</td>
                                <td className="col-status">Stopped</td>
                                <td className="col-desc"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="truck-list__pagination">
                    <nav aria-label="Trucks page navigation">
                        <ul className="pagination justify-content-end">
                            <li className="page-item disabled">
                                <a className="page-link" href="#" aria-disabled="true">Previous</a>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default TruckList;