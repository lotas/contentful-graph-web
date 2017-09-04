const { spawn } = require('child_process');
const fs = require('fs')
const path = require('path');
const convertApi = require('contentful-graph');

const outFile = (fileName, format) => path.join(__dirname, './../static/graphs/', `${fileName}.${format}`)

const renderHandler = async (req, res) => {
  const { spaceId, dlvrToken, mgmtToken, devMode = false, hideFields = false } = req.body

  if (!spaceId) {
    return res.json({ error: 'Missing spaceId' })
  }
  if (!dlvrToken && !mgmtToken) {
    return res.json({ error: 'Missing auth token' })
  }

  let contentTypes

  try {
    contentTypes = mgmtToken
      ? await convertApi.getContentTypesFromManagementApi(spaceId, mgmtToken)
      : await convertApi.getContentTypesFromDistributionApi(spaceId, dlvrToken)
  } catch (err) {
    return res.json({ error: err })
  }

  const modelsMap = convertApi.contentTypesToModelMap(contentTypes);
  const dotStr = convertApi.modelsMapToDot(modelsMap, {dev: devMode, hideEntityFields: hideFields});

  const fileName = `${spaceId}-${Date.now()}`

  if (dotStr && dotStr.length > 1) {
    await Promise.all([
      generateGraph(outFile(fileName, 'png'), dotStr, 'png'),
      generateGraph(outFile(fileName, 'svg'), dotStr, 'svg'),
      generateGraph(outFile(fileName, 'pdf'), dotStr, 'pdf')
    ])
  }

  res.json({
    modelsMap: modelsMap,
    dot: dotStr,
    rendered: {
      png: `/static/graphs/${fileName}.png`,
      svg: `/static/graphs/${fileName}.svg`,
      pdf: `/static/graphs/${fileName}.pdf`
    }
  })
}

function generateGraph(fileName, graphStr, format = 'png') {
  return new Promise((resolve, reject) => {
    console.log(`Generating ${fileName}`)

    const dot = spawn('dot', [`-T${format}`, `-o${fileName}`])

    dot.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })
    dot.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })
    dot.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      resolve(code)
    })
    dot.on('error', (err) => {
      console.log(`Child process error ${err}`)
      resolve(err)
    })

    dot.stdin.setDefaultEncoding('utf-8')
    dot.stdin.write(graphStr)
    dot.stdin.end()
  })
}

module.exports = renderHandler