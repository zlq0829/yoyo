export const start = (function(state = false) {
  return {
    type: 'START_PLAY',
    state
  }
})
export const stop = (function(state = false) {
  return {
    type: 'STOP_PLAY',
    state
  }
})
