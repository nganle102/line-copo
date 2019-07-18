import * as React from 'react';

class Search extends React.Component {
    render() {
        return (
            <div className="search">
                <form className="search__container" action=".">
                    <div className="search__input-container">
                        <input className="search__input" placeholder="Enter searck key..." type="search" name="search" aria-label="Search" />
                        <button className="search__reset" type="reset"><span>&#215;</span></button>
                        <span className="search__search-icon"></span>
                    </div>
                </form>
            </div>
        );
    }
}

export default Search;