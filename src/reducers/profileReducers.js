import utils from '@/utils'
const { auth }  = utils

const profileReducers = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PROFILE':
      return {
        ...action.profile,
      };
    case 'MODIFY_PROFILE':
      return state;
    default:
      return auth.getLocal('userInfo')? JSON.parse(auth.getLocal('userInfo')) : state;
  }
};


export default profileReducers;
