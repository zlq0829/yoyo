import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import profile from '@/reducers/profile';
import play from '@/reducers/play';

const rootReducer = combineReducers({
  profile,
  play
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)

store.subscribe(()=> {})
export default store
