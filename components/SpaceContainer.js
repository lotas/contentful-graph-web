import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import JSONTree from 'react-json-tree'

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


import ModelList from './ModelList'
import ImageViewer from './ImageViewer'
import InteractiveViewer from './InteractiveViewer'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  button: {
    float: 'right',
    margin: theme.spacing.unit / 2
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  }
});


function TabContainer({ children }) {
  return <div style={{ padding: 2 }}>{children}</div>;
}


class SpaceContainer extends React.Component {

  state = {
    value: 0,
    renderedSvg: null
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  renderDotGraph() {
    const { data } = this.props

    if (!data || !data.dot) {
      return null
    }

    return <Paper className={this.props.classes.root} elevation={4}>
      <Typography type="headline" component="h3">
        Graphviz dot representation
    </Typography>
      <TextField
        id="multiline-flexible"
        multiline
        rowsMax="100"
        value={data.dot}
        margin="normal"
        style={{ width: '100%' }}
      />
    </Paper>
  }

  renderModels() {
    const { data } = this.props
    return <Paper className={this.props.classes.root} elevation={4}>
      <ModelList models={data && data.modelsMap} />
    </Paper>
  }

  renderInteractive() {
    const { data, devMode, hideFields } = this.props
    return <Paper className={this.props.classes.root} elevation={4}>
      <InteractiveViewer models={data && data.modelsMap} devMode={devMode} hideFields={hideFields} />
    </Paper>
  }

  renderImage() {
    const { data, classes } = this.props
    if (!data || !data.rendered) {
      return <p>Not generated</p>
    }
    const { rendered } = data

    return <Paper className={classes.root} elevation={3}>
      <ImageViewer img={rendered.png} />
    </Paper>
  }

  renderRaw() {
    const { data } = this.props
    return <Paper className={this.props.classes.root} elevation={3}>
      <JSONTree
        data={data && data.modelsMap}
        hideRoot={true}
        theme={{
          base00: '#272822',
          base01: '#383830',
          base02: '#49483e',
          base03: '#75715e',
          base04: '#a59f85',
          base05: '#f8f8f2',
          base06: '#f5f4f1',
          base07: '#f9f8f5',
          base08: '#f92672',
          base09: '#fd971f',
          base0A: '#f4bf75',
          base0B: '#a6e22e',
          base0C: '#a1efe4',
          base0D: '#66d9ef',
          base0E: '#ae81ff',
          base0F: '#cc6633'
        }}
      />
    </Paper>
  }

  render() {
    const { value } = this.state
    const { classes, spaceId, data } = this.props

    const renderBadge = () => {
      if (!data || !data.modelsMap) {
        return "Models"
      }
      const length = Object.keys(data.modelsMap).length

      return `Models (${length})`
    }

    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography type="headline" component="h3" style={{ lineHeight: 2 }}>
                SpaceId: <u>{spaceId}</u>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {data && data.rendered && <div>
                <Button className={classes.button} component="a" download href={data.rendered.png}>
                  <DownloadIcon /> PNG
              </Button>
                <Button className={classes.button} component="a" download href={data.rendered.svg}>
                  <DownloadIcon /> SVG
              </Button>
                <Button className={classes.button} component="a" target="_blank" href={data.rendered.pdf}>
                  <PictureAsPdfIcon /> PDF
              </Button>
              </div>}
            </Grid>
          </Grid>
        </Paper>
        <Tabs value={value} onChange={this.handleChange}>
          <Tab label="Image" />
          <Tab label="Interactive" />
          <Tab label="Dot Graph" />
          <Tab label={renderBadge()} />
          <Tab label="Raw models" />
        </Tabs>
        <TabContainer>
        {value === 0 && this.renderImage()}
        {value === 1 && this.renderInteractive()}
        {value === 2 && this.renderDotGraph()}
        {value === 3 && this.renderModels()}
        {value === 4 && this.renderRaw()}
        </TabContainer>
      </div>
    );
  }
}

SpaceContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  spaceId: PropTypes.string,
  data: PropTypes.object,
  devMode: PropTypes.bool,
  hideFields: PropTypes.bool
};
export default withStyles(styles)(SpaceContainer);
