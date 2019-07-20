import * as React from 'react';
import { connect } from 'react-redux';

import { IActionType } from './IActionType';

interface IInstantSearchProps extends IActionType {
    placeholder ? : string;
    delay ? : number;
    minlength ? : number;
    autoFocus ? : boolean;
    dispatch ? : (arg: IActionType) => void;
    onSearch: (arg ? : string) => void;
}

interface IInstantSearchState {
    keyword: string;
    isSearching: boolean;
    statusCssClass: string;
}

export default connect((state) => state)(
    class Search extends React.Component < IInstantSearchProps, IInstantSearchState > {
        delayTimer: any;
        delay: number;
        minlength: number;

        constructor(props: IInstantSearchProps) {
            super(props);
            this.state = {
                keyword: "",
                isSearching: false,
                statusCssClass: ""
            }
            this.delay = props.delay === undefined ? 500 : props.delay;
            this.minlength = props.minlength === undefined ? 3 : props.minlength;
        }

        keywordChange(event: Event) {
            const self = this;
            const textBox = event.target as HTMLInputElement;

            self.setState({ keyword: textBox.value },

                () => {
                    clearTimeout(self.delayTimer);
                    self.delayTimer = setTimeout(() => {
                        var keyword = self.state.keyword.trim();

                        if (keyword.length >= self.minlength) {
                            self.getStatusCssClass();

                            this.props.onSearch(keyword);

                            const _msg: IActionType = { type: 'SEARCH_LOAD', keyword: keyword };
                            self.props.dispatch(_msg);
                        } else {
                            self.getStatusCssClass();

                            this.props.onSearch();

                            const _msg: IActionType = { type: 'SEARCH_CLEAR' };
                            self.props.dispatch(_msg);
                        }
                    }, self.delay);
                });
        }

        onKeyPress(event: KeyboardEvent) {
            if (event.which == 13 || event.keyCode == 13) {
                event.preventDefault();
            }
        }

        onReset(event) {
            this.setState({ keyword: "" });
            this.setState({ statusCssClass: "" });

            this.props.onSearch();

            const _msg: IActionType = { type: 'SEARCH_CLEAR' };
            this.props.dispatch(_msg);
        }

        getStatusCssClass() {
            let _status = "";

            if (this.state.keyword.length > 0) {
                _status += ' search--has-value';
            }
            if (this.state.isSearching) {
                _status += ' search--working';
            }
            this.setState({ statusCssClass: _status });
        }

        render() {

            return (
                <div className={`search ${this.state.statusCssClass}`}>
                    <form className="search__container" action=".">
                        <div className="search__input-container">
                            <input className="search__input" placeholder={this.props.placeholder} type="search" name="search"  aria-label="Search" value={this.state.keyword} autoFocus={this.props.autoFocus || false} onChange={this.keywordChange.bind(this)} onKeyPress={this.onKeyPress.bind(this)} />
                            <button className="search__reset" type="reset" onClick={this.onReset.bind(this)}><span>&#215;</span></button>
                            <span className="search__search-icon"></span>
                        </div>
                    </form>
                </div>
            );
        }
    }
);