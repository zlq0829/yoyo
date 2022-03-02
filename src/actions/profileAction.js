/**
 *
 * @description this is a action to add and change profile
 */


const addProfile = (function(profile) {
  return {
    type: 'ADD_PROFILE',
    profile
  }
})

const profileAction = {
  addProfile
}

export default profileAction
