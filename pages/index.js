/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';

import Typography from 'material-ui/Typography';
import withStyles from 'material-ui/styles/withStyles';
import withRoot from '../components/withRoot';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';

import MenuIcon from 'material-ui-icons/Menu';
import SettingsIcon from 'material-ui-icons/Settings';
import CloudDownloadIcon from 'material-ui-icons/CloudDownload';
import ImportExportIcon from 'material-ui-icons/ImportExport';
import RefreshIcon from 'material-ui-icons/Refresh';

import { Input, FormControl, FormGroup, FormControlLabel } from 'material-ui'
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Switch from 'material-ui/Switch';

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
    textIndent: 30
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

  spaceId: {
    marginLeft: 15
  },
  icon: {
    marginRight: 6
  },

  paper: {
    border: '1px solid red',
    padding: 16
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

    return <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
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
  }

  renderBlankScreen() {
    return <div>
      <Typography type="display1" gutterBottom>
        Contenful model graph
      </Typography>
      <Typography type="subheading" gutterBottom>

      </Typography>
      <Button raised color="accent" onClick={this.handleClick}>
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
      {this.hasCredentials && <Button color="contrast" aria-label="reload" className={classes.button} onClick={() => this.handleRender()}>
        <RefreshIcon /> Refresh
      </Button>}

      {<Button color="contrast" onClick={this.handleClick}>
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
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
