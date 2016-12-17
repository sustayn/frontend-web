import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUserReq } from 'services/authentication/actions';

import Button from 'grommet/components/Button';

const mapStateToProps = (state, ownProps) => {
    return { currentUser: state.services.auth.currentUser };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ updateUserReq }, dispatch);
};

export class UserSettings extends Component {
    constructor(props) {
        super(props);

        const currentUser = this.props.currentUser || {};
        this.state = { name: currentUser.name, nickname: currentUser.nickname };
    }

    submit() {
        const { name, nickname } = this.state;
        this.props.updateUserReq({ name, nickname });
    }

    checkKeyPress(e) {
        if(e.key === 'Enter') this.submit();
    }

    render() {
        return (
            <div>
                <input
                    className='spec-name-field'
                    type='text'
                    placeholder='name'
                    value={this.state.name}
                    onChange={(e) => { this.setState({ name: e.target.value }); }}
                />
                <input
                    className='spec-nickname-field'
                    type='text'
                    placeholder='nickname'
                    value={this.state.nickname}
                    onKeyPress={this.checkKeyPress.bind(this)}
                    onChange={(e) => { this.setState({ nickname: e.target.value }); }}
                />
                <Button
                    className='spec-submit-button'
                    label='Update'
                    onClick={this.submit.bind(this)}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);