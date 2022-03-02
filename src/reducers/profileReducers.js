const initialState = {
  // 用户个人信息
  profile: {},
};

const handleProfile = (state = initialState.profile, action) => {
  switch (action.type) {
    case 'ADD_PROFILE':
      return {
        ...action.profile,
      };
    case 'MODIFY_PROFILE':
      return state;
    default:
      return state;
  }
};

const profileReducers = (state = initialState.profile, action) => {
  return {
    profile: handleProfile(initialState.profile, action),
  };
};

export default profileReducers;
