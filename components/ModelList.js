import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Badge from 'material-ui/Badge';
import Input from 'material-ui/Input/Input';

import DownloadIcon from 'material-ui-icons/FileDownload';
import PictureAsPdfIcon from 'material-ui-icons/PictureAsPdf';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Tabs, { Tab } from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import OneIcon from 'material-ui-icons/LooksOne';
import ManyIcon from 'material-ui-icons/AllInclusive';
import LinkIcon from 'material-ui-icons/Link';
import NoLinkIcon from 'material-ui-icons/Stop';

import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/blueGrey';


const styles = theme => ({
  icon: {
    margin: theme.spacing.unit,
  },
  iconBlue: {
    fill: blue[500],
  },

  iconGrey: {
    fill: grey[200],
  },

  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },

  textField: {
    width: 200
  }
});

class ModelList extends React.Component {
  state = {
    _linksOnly: false,
    _expandAll: false,
    _filter: ''
  };

  handleClick = (model) => {
    this.setState({ [model]: !this.state[model] });
  };

  handleExpandAll = (checked) => {
    const newState = {
      _expandAll: checked
    }

    if (this.props.models) {
      Object.keys(this.props.models).forEach(model => newState[model] = checked)
    }

    this.setState(newState)
  }

  renderFilters() {
    return (<Grid container>
      <Grid item xs={12} sm={4}>
        <FormControlLabel
        control={
          <Switch
            checked={this.state._linksOnly}
            onChange={(event, checked) => this.setState({ _linksOnly: checked })}
          />
        }
        label="Only models with links"
          />
      </Grid>
      <Grid item xs={12} sm={4}>
      <FormControlLabel
      control={
        <Switch
          checked={this.state._expandAll}
          onChange={(event, checked) => this.handleExpandAll(checked) }
        />
      }
      label="Expand all"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
      <Input
          placeholder="Model filter"
          className={this.props.classes.input}
          value={this.state._filter}
          onChange={event => this.setState({ _filter: event.target.value })}
          margin="normal"
        />
      </Grid>
      <Divider />
    </Grid>)
  }

  render() {
    const { classes, models } = this.props;
    const { _linksOnly, _filter } = this.state;

    if (!models) {
      return null
    }

    const getLinks = ({ relations } = {}) => {
      if (!relations) {
        return null
      }

      const links = Array.prototype.concat( relations._hasAssets ? ['Assets'] : [], Object.values(relations.one), Object.values(relations.many))
      return links.length > 0 ? `Links: ${links.join(' , ')}` : ''
    }

    return (<div>
      {this.renderFilters()}
      <List>
        {Object.keys(models).map(model => {
          const links = getLinks(models[model])
          if (!links && _linksOnly) {
            return null
          }

          if (_filter && `${model.toLowerCase()}${links.toLowerCase()}`.indexOf(_filter.toLowerCase()) === -1) {
            return null
          }

          return [
            <ListItem key={model} onClick={() => this.handleClick(model)}>
              <ListItemIcon>
                {links ? <LinkIcon className={classes.iconBlue} /> : <NoLinkIcon className={classes.iconGrey} />}
              </ListItemIcon>
              <ListItemText primary={model} secondary={links}></ListItemText>
              {this.state[model] ? <ExpandMore /> : <ExpandLess />}
            </ListItem> ,
            <Collapse in={this.state[model]} transitionDuration="auto" unmountOnExit>
              {Object.keys(models[model].relations.one).map(fld => <ListItem key={fld} className={classes.nested}>
                <ListItemIcon>
                  <OneIcon />
                </ListItemIcon>
                <ListItemText primary={fld} secondary={models[model].relations.one[fld].join(',')}></ListItemText>
              </ListItem>)}
              {Object.keys(models[model].relations.many).map(fld => <ListItem key={fld} className={classes.nested}>
                <ListItemIcon>
                  <ManyIcon />
                </ListItemIcon>
                <ListItemText primary={fld} secondary={models[model].relations.many[fld].join(',')}></ListItemText>
              </ListItem>)}
            </Collapse> ,
            <Divider />
          ]
        })}
      </List>
    </div>);
  }
}

export default withStyles(styles)(ModelList)