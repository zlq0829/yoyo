import React, { Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.less';
const Login = React.lazy(() => import('@/pages/Login'));
const Layout = React.lazy(() => import('@/layout'));
const TitleBar = React.lazy(()=>import('./TitleBar'))
const packager = require('../package.json') //需要取版本号

function App() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center' }}>加载中...</div>}>
      <HashRouter>
        <TitleBar />
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' component={Layout}/>
        </Switch>
      </HashRouter>
    </Suspense>
  );
}



export default App;
