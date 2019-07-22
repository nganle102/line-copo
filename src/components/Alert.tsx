import * as React from 'react';


interface IAlert {
    type: string;
    title ? : string;
    text: string;
    show: boolean;
    onDismiss: (arg) => void;
}

class Alert extends React.Component < IAlert, any > {
    constructor(props: IAlert) {
        super(props);
    }

    render() {

        return (
            <React.Fragment>
                { this.props.show &&
                    <div className={`alert alert-${this.props.type} alert-dismissible fade show`} role="alert">
                        <strong>{this.props.title}</strong> {this.props.text}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.props.onDismiss}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                }
            </React.Fragment>
        );
    }
}

export default Alert;