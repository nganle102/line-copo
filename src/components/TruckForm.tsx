import * as React from 'react';

class TruckForm extends React.Component {
    render() {
        return (
            <div className="truckform">
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> New truck record has just been added.
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form className="needs-validation truckform__form form truck" noValidate>
                    <div className="form__fieldsets">
                        <fieldset>
                            <legend>Main infomation</legend>

                            <div className="form-group">
                                <div className="form-control-label">
                                    <label htmlFor="input-01">Truck plate</label>
                                </div>
                                <input type="text" className="form-control" id="input-01" aria-describedby="input-01-help" placeholder="Enter truck plate" required/>
                                <small id="input-01-help" className="form-text text-muted">Plate must be correct format.</small>
                            </div>

                        </fieldset>

                        <fieldset>
                            <legend>Additional infomation</legend>

                            <div className="form-group">
                                <div className="form-control-label">
                                    <label htmlFor="">Parking address</label>
                                </div>
                                <input type="text" className="form-control" id="" aria-describedby="" max-length="500"/>
                                <small id="" className="form-text text-muted">
                                    <span className="counter">
                                        <span className="counter__label">Total:</span>
                                        <span className="counter__value">0/500</span>
                                    </span>
                                </small>
                            </div>

                        </fieldset>
                    </div>

                    <div className="form__actions">
                        <button type="button" className="btn btn-light btn-cancel">Cancel</button>
                        <button type="reset" className="btn btn-secondary btn-reset">Reset</button>
                        <button type="submit" className="btn btn-primary btn-submit">Update</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default TruckForm;


