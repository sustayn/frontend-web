import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import { dismissFlash } from 'services/flash/actions';

// Do some logic in here for animating purposes (?)
const mapStateToProps = (state, ownProps) => {
	const flashObject = state.services.flash[0] || {};
	return { flashObject: flashObject };
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({ dismissFlash }, dispatch);
};

export class FlashMessage extends Component {
	render() {
		const { flashObject } = this.props;
		const flashMessageType = `is-${flashObject.type}`;
		const classes = classNames({
			'flash-message':      true,
			'spec-flash-wrapper': true,
			'is-inactive':        !flashObject.message,
			[flashMessageType]:   !!flashObject.type,
		});

		return (
			<div className={classes}>
				<div className='flash-message_message spec-flash-message'>{flashObject.message}</div>
				<div className='flash-message_dismiss spec-flash-dismiss' onClick={this.props.dismissFlash}>
					X
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);