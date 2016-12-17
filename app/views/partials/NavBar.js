import React, { Component } from 'react';
import Link from 'react-router/lib/Link';

import {
    UserIsAuthenticated,
    UserIsNotAuthenticated,
} from 'services/Authorization';
import { SignOut } from 'services/authentication';

import Header from 'grommet/components/Header';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';

const SignInLink = UserIsNotAuthenticated(<Link to='/auth/signin' className='navbar_link spec-signin'>Sign In</Link>, { FailureComponent: null });
const SignOutComponent = UserIsAuthenticated(<SignOut />, { FailureComponent: null });

const NavBar = () => {
    return (
        <Header
            className='navbar'
            fixed
            justify='between'
            colorIndex='brand'
        >
            <Box pad={({ horizontal: 'small' })}>
                Aveera
            </Box>

            MAGIC
            TOOLBAR
            !!!

            <Menu direction='row' inline responsive={false} label='Routes'>
                <SignInLink className='lh-navbar px12 pointer' />
                <SignOutComponent className='lh-navbar px12 pointer' />
            </Menu>
        </Header>
    );
};

export default NavBar;