export const deserializeFromStorage = () => {
  if (typeof sessionStorage === 'undefined') {
    return {}
  }

  try {
    return JSON.parse(sessionStorage.getItem('state'))
  } catch (e) {
    console.log(e)
  }
}

export const serializeToStorage = ({ spaceId, mgmtToken, dlvrToken, devMode, hideFields }) => {
  try {
    sessionStorage.setItem('state', JSON.stringify({
      spaceId,
      mgmtToken,
      dlvrToken,
      devMode,
      hideFields
    }))
  } catch (e) {
    console.log(e)
  }
}