const quality = (state = 'MEDIUM', action) => {
  switch(action.type) {
    case 'RADIO_CHANGE':
      return action.value
    default:
      return state
  }
}
export default quality;
