/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../components/withRoot';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import RefreshIcon from '@material-ui/icons/Refresh';

import { Input, FormControl, FormGroup, FormControlLabel } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import grey from '@material-ui/core/colors/blueGrey';


import { serializeToStorage, deserializeFromStorage, getData, setData } from '../src/storage'
import SpaceContainer from '../components/SpaceContainer'

const styles = {
  root: {
    marginTop: 0,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  appBar: {
    textIndent: 30,
    marginRight: 20,
    paddingRight: 20
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  content: {
    margin: 30
  },
  formGroup: {
    marginBottom: 16
  },

  button: {
    marginRight: 8,
  },

  spaceId: {
    marginLeft: 15
  },
  icon: {
    marginRight: 6
  },

  paper: {
    border: '1px solid red',
    padding: 16
  },

  footer: {
    margin: '50px 35px 10px 30px',
    color: grey[600],
    fontSize: 13,
    fontFamily: 'monospace',
    paddingTop: 10,
    borderTop: '1px solid #ccc'
  },

  a: {
    marginRight: 10
  }
};


class Index extends Component {

  constructor(props) {
    super(props)

    this.state = Object.assign({
        open: false,
        rendering: false,
        spaceId: '',
        mgmtToken: '',
        dlvrToken: '',
        devMode: false,
        hideFields: false,
        data: null
      },
      deserializeFromStorage(),
      { data: getData() }
    )
  }

  get hasCredentials() {
    const { spaceId, dlvrToken, mgmtToken } = this.state
    return spaceId && (dlvrToken || mgmtToken)
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    }, () => {
      serializeToStorage(this.state)

      if (this.state.data === null) {
        this.handleRender()
      }
    })
  }

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleRender = () => {
    this.setState({
      rendering: true
    })

    const { spaceId, dlvrToken, mgmtToken, devMode, hideFields } = this.state

    fetch('/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ spaceId, dlvrToken, mgmtToken, devMode, hideFields })
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          rendering: false,
          data
        })
        setData(data)
      })
      .catch(err => {
        this.setState({
          rendering: false,
          err
        })
      })
  }

  changeValue(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  handleChange = name => (event, checked) => {
    this.setState({ [name]: checked });
  };

  renderDialog() {
    const { classes } = this.props
    const { spaceId, dlvrToken, mgmtToken } = this.state

    return (
    <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
      <DialogTitle>Contentful auth tokens</DialogTitle>
        <DialogContent>
        <DialogContentText>
          <FormGroup className={classes.formGroup}>
            <TextField label="spaceId" margin="normal" placeholder="SpaceId" value={spaceId} onChange={(e) => this.changeValue('spaceId', e)} />
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <TextField label="Delivery token" margin="normal" placeholder="Delivery Token" value={dlvrToken} onChange={(e) => this.changeValue('dlvrToken', e)} />
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <TextField label="Management token" margin="normal" placeholder="Management Token" value={mgmtToken} onChange={(e) => this.changeValue('mgmtToken', e)} />
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <FormControlLabel
                control={<Switch
                  checked={this.state.devMode}
                  onChange={this.handleChange('devMode')}
                  aria-label="Dev-mode"
                />}
                label="Dev mode (ids)"/>
            <FormControlLabel
                control={<Switch
                  checked={this.state.hideFields}
                  onChange={this.handleChange('hideFields')}
                  aria-label="Hide-fields"
                />}
                label="Hide fields"/>
          </FormGroup>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={this.handleRequestClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
    )
  }

  renderBlankScreen() {
    return <div>
      <Typography type="display1" gutterBottom>
        Contenful model graph
      </Typography>
      <Typography type="subheading" gutterBottom>

      </Typography>
      <Button variant="contained" color="primary" onClick={this.handleClick}>
        Set contentful tokens
      </Button>
    </div>
  }

  renderAppBar() {
    const { classes } = this.props
    const { spaceId } = this.state

    return <AppBar position="static" className={classes.appBar}>
    <Toolbar disableGutters>
      <Typography type="title" color="inherit" className={classes.flex}>
        Contentful model graph
      </Typography>
      {this.hasCredentials && <Button color="secondary" variant="contained" aria-label="reload" className={classes.button} onClick={() => this.handleRender()}>
        <RefreshIcon /> Refresh
      </Button>}

      {<Button color="secondary" variant="contained" onClick={this.handleClick}>
        <SettingsIcon className={classes.icon} />
        Settings
      </Button>}
    </Toolbar>
  </AppBar>
  }

  render() {
    const { classes } = this.props
    const { rendering, data, spaceId, devMode, hideFields } = this.state

    return (
      <div className={classes.root}>
        {this.renderAppBar()}
        <div className={classes.content}>
          {this.renderDialog()}
          {!this.hasCredentials && this.renderBlankScreen()}
          {rendering && <LinearProgress />}
          {spaceId && <SpaceContainer spaceId={spaceId} data={data} devMode={devMode} hideFields={hideFields} />}
        </div>
        <div className={classes.footer}>
          <Grid container align="center" justify="space-between">
            <Grid item>
              Library: <a className={classes.a} href="https://github.com/lotas/contentful-graph">contentful-graph</a>
              Web version: <a className={classes.a} href="https://github.com/lotas/contentful-graph-web">contentful-graph-web</a>
            </Grid>
            <Grid item>
              By <a href="https://github.com/lotas">Yaraslau Kurmyza</a>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
