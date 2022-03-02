import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Switch } from 'react-router-dom';
import Login from '@/pages/Login';
import Layout from '@/layout';
import PrivateRoute from '@/components/PrivateRoute';
// import './App.less';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path='/login' component={Login} />
        <PrivateRoute path='/' component={Layout}/>
      </Switch>
    </QueryClientProvider>
  );
}

export default App;
