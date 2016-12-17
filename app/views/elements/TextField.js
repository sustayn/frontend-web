import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { removeError } from 'actions/actions';

import FormField from 'grommet/components/FormField';

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({ removeError }, dispatch);
};

export const TextField = ({
    removeError,
    label,
    error,
    required,
    onChange,
    ...props,
}) => {
    return (
        <FormField label={label}>
            {required ?
                <span className='fs-14 lh-24 abs top-6 right-0 block grey-1 spec-text-field-req'>
                    Required
                </span> : null}
            <input onChange={onFieldChange} {...props} />
            {error ? <span className='fs-12 abs left-0 error spec-text-field-err'>{`${label} ${error}`}</span> : null}
        </FormField>
    );

    function onFieldChange(e) {
        if(error && props.name && removeError) removeError(props.name);
        if(onChange) onChange(e);
    }
};

export default connect(() => ({}), mapDispatchToProps)(TextField);