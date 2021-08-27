import React, { useState } from 'react';

import { Switch, Route, useHistory } from 'react-router-dom';
import { Button, Toolbar, AppBar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { useAuth } from './use-auth';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Account from './Account';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      cursor: 'pointer',
    },
  }),
);

function App() {

  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" onClick={() => history.push('/')} className={classes.title}>
            Flask is bad
          </Typography>
          {auth.authenticated ? (<div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); history.push('/account') }}>My Account</MenuItem>
              <MenuItem onClick={() => { handleClose(); auth.signout() }}>Logout</MenuItem>
            </Menu>
          </div>) : (<div>
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
          </div>)}
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
      </Switch>
    </>
  );
}

export default App;
