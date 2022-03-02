import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import REDUCERS from '@/reducers';

const rootReducer = combineReducers({
  userInfo: REDUCERS.profileReducers
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)

store.subscribe(()=> {
  console.log(store.getState())
})
export default store
