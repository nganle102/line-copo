import * as React from 'react';

interface SelectOption {
    value: string;
    name: string;
    selected ? : boolean;
}

interface IFormFieldProps {
    name: string;
    hasLabel ? : boolean;
    hasDescription ? : boolean;
    min ? : number;
    max ? : number;
    maxLength ? : number;
    minLength ? : number;
    placeholder ? : string;
    label ? : string;
    description ? : string;
    required ? : boolean;
    type: string;
    multiple ? : boolean;
    autocomplete ? : boolean;
    isInputGroup ? : boolean;
    prependLabel ? : string;
    options ? : SelectOption[];
    defaultValue ? : any;
    multipleValue ? : number[];
    pattern ? : string;
}

interface IFormFieldState {
    isValid ? : boolean;
    currentLength ? : number;
    numberFormat ? : string;
    value ? : any;
    multipleValue ? : number[];
}

class FormField extends React.Component < IFormFieldProps, IFormFieldState > {
    constructor(props: IFormFieldProps) {
        super(props);
        this.state = {
            isValid: false,
            currentLength: 0,
            numberFormat: '',
            value: '',
            multipleValue: []
        }
    }

    componentDidMount() {
        this.setState({ value: this.props.defaultValue, multipleValue: this.props.multipleValue });
        this.setState({ numberFormat: parseInt(this.props.defaultValue == undefined || this.props.defaultValue == '' ? this.props.placeholder : this.props.defaultValue).toLocaleString() });
    }

    onChange(e) {
        if (this.props.type == 'select' && this.props.multiple) {
            const opts = e.target.selectedOptions;
            let multiValue = [];

            for (var i = 0, l = opts.length; i < l; i++) {
                multiValue.push(opts[i].value);
            }

            e.target.setCustomValidity(opts.length > this.props.max ? `You can add maximum ${this.props.max} options` : '');

            this.setState({ multipleValue: multiValue });

        } else {
            this.setState({ value: e.target.value, currentLength: e.target.value.length });
        }

        if (this.props.type == 'number') {
            this.setState({ numberFormat: parseInt(e.target.value).toLocaleString() });
        }
    }

    render() {
        const self = this;
        let ariaDescribedby = this.props.hasDescription ? this.props.name + '-help ' : '';
        ariaDescribedby += this.props.isInputGroup ? this.props.name + '-addon ' : '';

        let inputAttrs = this.props.hasDescription ? { 'aria-describedby': ariaDescribedby } : {};

        const INPUT_TYPE = /text|number|tel|email|password|search/;

        function renderInput() {
            return (
                <React.Fragment>
                <input type={self.props.type} className="form-control" id={self.props.name} name={self.props.name} {...inputAttrs}
                        placeholder={self.props.placeholder} required={self.props.required}
                        min={self.props.min} max={self.props.max}
                        minLength={self.props.minLength} maxLength={self.props.maxLength}
                        value={self.state.value} pattern={self.props.pattern}
                        onChange={self.onChange.bind(self)}/>

                { (/number/.test(self.props.type)) &&
                    <span className="number-markup">{self.state.numberFormat}</span>
                }
                </React.Fragment>
            )
        }

        return (
            <div className={`form-group form-group--${this.props.name}`}>
                { this.props.hasLabel &&
                    <div className="form-control-label">
                        <label htmlFor={`${this.props.name}`}>{this.props.label}</label>
                    </div>
                }

                { !this.props.isInputGroup && (INPUT_TYPE.test(this.props.type)) && !(/textarea/.test(this.props.type)) &&
                    renderInput()
                }

                { this.props.isInputGroup && (INPUT_TYPE.test(this.props.type)) && !(/textarea/.test(this.props.type)) &&
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id={`${this.props.name}-addon`}>VND</span>
                        </div>
                        {renderInput()}
                    </div>
                }

                { (/textarea/.test(this.props.type)) &&
                    <React.Fragment>
                    <textarea className="form-control" id={this.props.name} name={this.props.name} {...inputAttrs}
                            placeholder={this.props.placeholder} required={this.props.required}
                            minLength={this.props.minLength} maxLength={this.props.maxLength}
                            value={self.state.value} onChange={this.onChange.bind(this)}></textarea>

                    <small className="form-text text-muted">
                        <span className="counter">
                            <span className="counter__label">Total: </span>
                            <span className="counter__value">{this.state.currentLength} / {this.props.maxLength}</span>
                        </span>
                    </small>
                    </React.Fragment>
                }

                { (/select/.test(this.props.type)) &&
                    <select className={`form-control ${this.props.autocomplete ? 'input-autoComplete' : ''}`} id={this.props.name} name={this.props.name}
                        multiple={this.props.multiple} data-maximum-selection-length={this.props.max}
                        placeholder={this.props.placeholder} required={this.props.required}
                        value={this.props.multiple? this.state.multipleValue : this.state.value} data-allow-clear="true" onChange={this.onChange.bind(this)}>
                        { this.props.options && this.props.options.map(item => {
                            return <option key={item.value} value={item.value}>{item.name}</option>
                        })}
                    </select>
                }

                { (/radio/.test(this.props.type)) && this.props.options && this.props.options.map(item => {
                        return (
                            <div className="custom-control custom-radio custom-control-inline" key={item.value}>
                                <input className="custom-control-input" type="radio" id={`${this.props.name}-${item.value}`} name={this.props.name} required={this.props.required} value={item.value} defaultChecked={item.selected} onChange={this.onChange.bind(this)} />
                                <label className="custom-control-label" htmlFor={`${this.props.name}-${item.value}`} >{item.name}</label>
                            </div>
                        )
                    })
                }

                { this.props.hasDescription &&
                    <small id={`${this.props.name}-help`} className="form-text text-muted">{this.props.description}</small>
                }

            </div>
        );
    }
}

export default FormField;