import React from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';

import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

const getWidth = () => {
  if (typeof document !== 'undefined') {
    return `${document.body.clientWidth - 100}px`
  }
  return '100%'
}

const getNodesAndEdges = (data, devMode = false, hideFields = false, auto = false) => {
  const models = Object.keys(data)
  const len = models.length
  const cols = Math.ceil(Math.sqrt(len))

  let x = 0, y = 0

  const edges = []
  const nodes = models.map(model => {
    const rels = data[model].relations

    x++
    if (x > cols) {
      y++
      x = 0
    }

    let linksCount = 0

    if (rels._hasAssets) {
      edges.push({ from: model, to: 'Assets' })
      linksCount++
    }

    Object.keys(rels.one).forEach(srcField => {
      rels.one[srcField].forEach(link => {
        edges.push({ from: model, to: link, label: `${srcField} 1:1` })
        linksCount++
      })
    })

    Object.keys(rels.many).forEach(srcField => {
      rels.many[srcField].forEach(link => {
        edges.push({ from: model, to: link, label: `${srcField} 1:many` })
        linksCount++
      })
    })

    return {
      id: model,
      font: { multi: true },
      label: `<b>${model}</b>\n${!hideFields && data[model].fields.map(f => devMode ? f.id : f.name).join('\n')}`,
      fixed: {
        x: false,
        y: false
      },
      x: auto ? null : x * 200,
      y: auto ? null : y * 200,
      group: linksCount > 0 ? y : 'nolinks'
    }
  })

  return { nodes, edges }
}

class InteractiveViewer extends React.Component {
  state = {
    visible: false,
    auto: false
  };

  render() {
    const { models, devMode, hideFields } = this.props
    const { auto } = this.state

    if (!models) {
      return null
    }

    const graph = getNodesAndEdges(models, devMode, hideFields, auto)

    const options = {
      layout: {
        randomSeed: 50,
        improvedLayout: auto,
        hierarchical: {
          enabled: auto,
          direction: 'Up-Down'
        }
      },
      edges: {
        color: "#000000"
      },
      nodes: {
        shape: 'box'
      },
      physics: {
        enabled: false
      },
      width: getWidth()
    };

    if (auto === false) {
      options.layout.hierarchical.nodeSpacing = 300
      options.layout.hierarchical.treeSpacing = 300
      options.layout.hierarchical.levelSeparation = 300
    }

    const events = {
      select: function (event) {
        const { nodes, edges } = event;
      }
    }

    return <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Switch
            checked={this.state.auto}
            onChange={(event, checked) => this.setState({ auto: checked })}
          />
        }
        label="Auto layout"
          />
      <Graph graph={graph} options={options} events={events} />
    </div>

  }
}

InteractiveViewer.PropTypes = {
  models: PropTypes.object,
  devMode: PropTypes.bool,
  hideFields: PropTypes.bool
}

export default InteractiveViewer