import React, { Component } from 'react';
import Link from 'react-router/lib/Link';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { onLoad } from 'services/authentication/actions';
import { openNodeChannel } from 'actions/actions';

import NavBar from 'views/partials/NavBar';
import FlashMessage from 'services/flash/Components/FlashMessage';

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ onLoad, openNodeChannel }, dispatch);
};

export class App extends Component {
  componentDidMount() {
    this.props.onLoad();
    this.props.openNodeChannel(1);
  }

  render() {
    return (
      <div className='app'>
        <NavBar />
        <FlashMessage />

        <div className='px40 py55'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(App);