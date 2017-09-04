import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Badge from 'material-ui/Badge';

import DownloadIcon from 'material-ui-icons/FileDownload';
import PictureAsPdfIcon from 'material-ui-icons/PictureAsPdf';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Tabs, { Tab } from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
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
  }
});

class ModelList extends React.Component {
  state = {};

  handleClick = (model) => {
    this.setState({ [model]: !this.state[model] });
  };

  render() {
    const { classes, models } = this.props;
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

    return (
      <List>
        {Object.keys(models).map(model => [
          <ListItem key={model} onClick={() => this.handleClick(model)}>
            <ListItemIcon>
              {getLinks(models[model]) ? <LinkIcon className={classes.iconBlue} /> : <NoLinkIcon className={classes.iconGrey} /> }
            </ListItemIcon>
            <ListItemText primary={model} secondary={getLinks(models[model])}></ListItemText>
            {this.state[model] ? <ExpandMore /> : <ExpandLess />}
          </ListItem>,
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
          </Collapse>,
          <Divider />
        ])}
      </List>
    );
  }
}

export default withStyles(styles)(ModelList)