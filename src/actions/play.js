export const start = (function(state = true) {
  return {
    type: 'START_PLAY',
    state
  }
})
export const stop = (function(state = true) {
  return {
    type: 'STOP_PLAY',
    state
  }
})
