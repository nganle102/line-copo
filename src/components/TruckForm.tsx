import * as React from 'react';
import * as $ from 'jquery';

import FormField from './Formfield';
import Alert from './Alert';


// var FormData = require('form-data');

class TruckForm extends React.Component < any, any > {
    constructor(props: any) {
        super(props);
        this.state = {
            truckId: 0,
            truck: {},
            fieldset: {
                main: [],
                additional: []
            },
            drivers: [],
            cargoTypes: [],
            statusTypes: [],
            truckTypes: [],
            message: {
                type: '',
                title: '',
                text: '',
                show: false
            }
        }
    }

    componentDidMount() {
        const self = this;

        const MainFields = [{ name: 'plate', hasLabel: true, label: 'Truck plate', hasDescription: true, description: 'Plate must be correct format. Example: 30A-12345', placeholder: 'Enter truck plate', required: true, type: 'text', pattern: '[0-9]{2}[A-Za-z]-[0-9]{5}' },
            { name: 'cargoTypeIds', hasLabel: true, label: 'Cargo type(s)', placeholder: 'Select cargo type (s)', required: true, type: 'select', multiple: true, autocomplete: true, max: 10 },
            { name: 'driverId', hasLabel: true, label: 'Driver', placeholder: 'Select driver', type: 'select', autocomplete: true },
            { name: 'truckTypeId', hasLabel: true, label: 'Truck type', placeholder: 'Select truck type', type: 'select' },
            { name: 'price', hasLabel: true, label: 'Price', placeholder: '0', required: true, type: 'number', isInputGroup: true, prependLabel: 'VND', min: 0, max: 1000000000000 }
        ];

        const AdditionalFields = [{ name: 'dimension', hasLabel: true, label: 'Dimension', placeholder: 'Enter dimension', type: 'text' },
            { name: 'address', hasLabel: true, label: 'Parking address', placeholder: 'Enter address', required: true, type: 'textarea', maxLength: 500 },
            { name: 'productionYear', hasLabel: true, label: 'Production year', placeholder: 'Select production year', type: 'select' },
            { name: 'statusTypeId', hasLabel: true, label: 'Status', placeholder: '', required: true, type: 'radio' },
            { name: 'description', hasLabel: true, label: 'Description', placeholder: '', type: 'textarea', maxLength: 200 }
        ];

        fetch('http://localhost:3002/cargoTypes')
            .then(response => response.json())
            .then(data => {
                self.mapRefData(MainFields, data, 'cargoTypeIds');
                self.setState({ cargoTypes: data });
            });

        fetch('http://localhost:3002/drivers')
            .then(response => response.json())
            .then(data => {
                self.mapRefData(MainFields, data, 'driverId');
                self.setState({ drivers: data });
            });

        fetch('http://localhost:3002/truckTypes')
            .then(response => response.json())
            .then(data => {
                self.mapRefData(MainFields, data, 'truckTypeId');
                self.setState({ truckTypes: data });
            });

        fetch('http://localhost:3002/statusTypes')
            .then(response => response.json())
            .then(data => {
                self.mapRefData(AdditionalFields, data, 'statusTypeId');
                self.setState({ statusTypes: data });
            });

        self.mapProductionYear(AdditionalFields);

        self.getTruck(MainFields, AdditionalFields);

        self.setState({
            fieldset: {
                main: MainFields,
                additional: AdditionalFields
            }
        });
    }

    mapProductionYear(fieldset) {
        let years = [];
        const currentYear = new Date().getFullYear();

        for (var i = 1980; i <= currentYear; ++i) {
            years.push({
                value: i,
                name: i,
                selected: false
            });
        }

        let index = fieldset.findIndex(item => item.name == 'productionYear');

        Object.assign(fieldset[index], { options: years, defaultValue: currentYear - 5 });
    }

    mapRefData(fieldset, data, fieldName) {
        let index = fieldset.findIndex(item => item.name == fieldName);

        // map options to each input field
        var opts = data.map(item => {
            return {
                value: item.id,
                name: item.name,
                selected: item.seleted
            };
        });

        if (!fieldset[index].required) {
            opts.unshift({
                value: '0',
                name: fieldset[index].placeholder,
                selected: true
            })
        };

        Object.assign(fieldset[index], {
            options: opts
        });
    }

    getTruck(fmain, fadditional) {
        const urlParams = new URLSearchParams(window.location.search);
        let _truckId = 0;
        if (urlParams.has('id')) {
            _truckId = parseInt(urlParams.get('id'));

            this.setState({ truckId: _truckId });

            fetch('http://localhost:3002/trucks/' + _truckId)
                .then(response => response.json())
                .then(data => {
                    this.mapTruckData(data, fmain, fadditional);
                    this.setState({ truck: data });
                });
        }
    }

    mapTruckData(data, fmain, fadditional) {
        const self = this;
        fmain.map(item => {
            item.value = data[item.name];

            if (/driverId|truckTypeId|statusTypeId|productionYear/.test(item.name)) {
                item.options.map(i => i.selected = i.value == item.value);
            }

            if (/cargoTypeIds/.test(item.name)) {
                item.options.map(i => i.selected = item.value.indexOf(i.value) > -1);
            }
        });

        fadditional.map(item => {
            item.value = data[item.name];

            if (/driverId|truckTypeId|statusTypeId|productionYear/.test(item.name)) {
                item.options.map(i => i.selected = i.value == item.value);
            }

            if (/cargoTypeIds/.test(item.name)) {
                item.options.map(i => i.selected = item.value.indexOf(i.value) > -1);
            }
        });
    }

    serializeFormJSON(orgArr) {
        var o = {};
        $.each(orgArr, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

    saveData(jsonData, isAddnew) {
        const self = this;

        var url = 'http://localhost:3002/trucks';
        if (!isAddnew) {
            url += '/' + self.state.truckId;
        }

        fetch(url, {
                method: isAddnew ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(function (resp) { return resp.json(); })
            .then(function () {
                self.setState({
                    message: {
                        type: 'success',
                        title: 'Sucess!',
                        text: 'New item is added to database.',
                        show: true
                    }
                })
            });
    }

    displayError() {
        this.setState({
            message: {
                type: 'danger',
                title: 'Error!',
                text: 'This truck plate is existent in database.',
                show: true
            }
        })
    }

    onSubmitForm(event) {
        const self = this;
        var form = event.target;

        event.preventDefault();

        if (!form.checkValidity()) {
            event.stopPropagation();
        } else {

            var formData = $(form).serializeArray();

            var data = formData;

            $.each(data, function (i, field) {
                if (/cargoTypeIds|driverId|truckTypeId|statusTypeId|productionYear|price/.test(field.name)) {
                    field.value = parseInt(field.value);
                }
            });

            const jsonData = this.serializeFormJSON(data);

            // validate if the truck plate is existent
            fetch('http://localhost:3002/trucks?plate=' + jsonData['plate'].toLowerCase())
                .then(response => response.json())
                .then(data => {
                    if (data.length == 0) {
                        fetch('http://localhost:3002/trucks?plate=' + jsonData['plate'].toUpperCase())
                            .then(response => response.json())
                            .then(data => {
                                if (data.length == 0 || (data.length == 1 && data[0].id == self.state.truckId)) {
                                    self.saveData(jsonData, data.length == 0);
                                } else {
                                    self.displayError();
                                }
                            });
                    } else {
                        self.displayError();
                    }
                });

            // FormData does not work
            // const data = new FormData(form);
        }

        form.classList.add('was-validated');
    }

    render() {
        const self = this;

        function renderFormFields(fieldset) {
            return fieldset.map((item) => {
                return (
                    <FormField key={item.name} name={item.name}
                        hasLabel={item.hasLabel} label={item.label}
                        hasDescription={item.hasDescription} description={item.description}
                        placeholder={item.placeholder} required={item.required}
                        type={item.type} isInputGroup={item.isInputGroup}
                        multiple={item.multiple} autocomplete={item.autocomplete}
                        min={item.min} max={item.max}
                        minLength={item.minLength} maxLength={item.maxLength}
                        options={item.options} value={item.value} multipleValue={item.value}
                        pattern={item.pattern} />
                );
            })
        }

        return (
            <div className={`truckform ${this.state.truckId > 0 ? 'truckform--edit' : 'truckform--addnew'}`}>
                <Alert type={this.state.message.type}  title={this.state.message.title}  text={this.state.message.text} show={this.state.message.show} />
                <form className="truckform__form form truck" onSubmit={this.onSubmitForm.bind(this)}>
                    <div className="form__fieldsets">
                        <fieldset>
                            <legend>Main infomation</legend>

                            {renderFormFields(this.state.fieldset.main)}
                        </fieldset>

                        <fieldset>
                            <legend>Additional infomation</legend>

                           {renderFormFields(this.state.fieldset.additional)}
                        </fieldset>
                    </div>

                    <div className="form__actions">
                        <a href="/" className="btn btn-light btn-cancel">Cancel</a>
                        <button type="reset" className="btn btn-secondary btn-reset">Reset</button>
                        <button type="submit" className="btn btn-primary btn-submit">Update</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default TruckForm;