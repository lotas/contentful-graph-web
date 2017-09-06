const STATE_KEY = 'state'
const DATA_KEY = 'data'

export const deserializeFromStorage = () => _getItem(STATE_KEY)
export const serializeToStorage = ({ spaceId, mgmtToken, dlvrToken, devMode, hideFields }) => {
  _setItem(STATE_KEY, {
    spaceId,
    mgmtToken,
    dlvrToken,
    devMode,
    hideFields
  })
}

export const setData = (data) => _setItem(DATA_KEY, data)
export const getData = (data) => _getItem(DATA_KEY)


function _setItem(key, value) {
  if (typeof localStorage === 'undefined') {
    return {}
  }

  try {
    return localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.log(e)
  }
}

function _getItem(key) {
  if (typeof localStorage === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    console.log(e)
  }
}