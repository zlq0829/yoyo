import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.less';
const Login = React.lazy(() => import('@/pages/Login'));
const Layout = React.lazy(() => import('@/layout'));

function App(props) {
  const { token } = props;

  return (
    <Suspense fallback={<div style={{ textAlign: 'center' }}>加载中...</div>}>
      <HashRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' component={Layout}/>
        </Switch>
      </HashRouter>
    </Suspense>
  );
}

const mapStateToProps = (state) => ({
  token: state.profile.token,
});

export default connect(mapStateToProps)(App);
