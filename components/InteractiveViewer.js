import React from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';


const getWidth = () => {
  if (typeof document !== 'undefined') {
    return `${document.body.clientWidth - 100}px`
  }
  return '100%'
}

const getNodesAndEdges = (data, devMode = false, hideFields = false) => {
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
      x: x * 200,
      y: y * 200,
      group: linksCount > 0 ? y : 'nolinks'
    }
  })

  return { nodes, edges }

  // [
  //   { id: 1, label: 'This is a\nsingle-font label'},
  //   { id: 2, font: { multi: true }, label: '<b>This</b> is a\n<i>default</i> <b><i>multi-</i>font</b> <code>label</code>'},
  //   { id: 3, font: { multi: 'html', size: 20 }, label: '<b>This</b> is an\n<i>html</i> <b><i>multi-</i>font</b> <code>label</code>'},
  //   { id: 4, font: { multi: 'md', face: 'georgia' }, label: '*This* is a\n_markdown_ *_multi-_ font* `label`'},
  // ]
  // edges:
  // [
  //   {from: 1, to: 2, label: "single to default"},
  //   {from: 2, to: 3, font: { multi: true }, label: "default to <b>html</b>" },
  //   {from: 3, to: 4, font: { multi: "md" }, label: "*html* to _md_" }
  // ]
}

class InteractiveViewer extends React.Component {
  state = {
    visible: false
  };

  render() {
    const { models, devMode, hideFields } = this.props

    if (!models) {
      return null
    }

    const graph = getNodesAndEdges(models, devMode, hideFields)

    const options = {
      layout: {
        randomSeed: 50,
        improvedLayout: true,
        hierarchical: {
          enabled: false,
          direction: 'Up-Down',
          nodeSpacing: 300,
          treeSpacing: 300,
          levelSeparation: 300
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

    const events = {
      select: function (event) {
        const { nodes, edges } = event;
      }
    }

    return <div style={{ width: '100%' }}>
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