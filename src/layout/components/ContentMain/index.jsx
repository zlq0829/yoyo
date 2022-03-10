import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import PrivateRoute from '@/components/PrivateRoute'
import Login from '@/pages/Login'
import AutoPlay from '@/pages/AutoPlay'
import GoodsManage from '@/pages/GoodsManage'
import Profile from '@/pages/Profile'
import GoodsInfo from '@/pages/GoodsInfo'


class ContentMain extends React.Component {
  render() {
    return (
      <div style={{padding: '15px', position: 'relative' , height: '100%'}}>
        <Switch>
          <PrivateRoute exact path='/login' component={Login}/>

          <PrivateRoute exact path='/autoplay' component={AutoPlay}/>
          <PrivateRoute exact path='/goodsmanage' component={GoodsManage}/>
          <PrivateRoute exact path='/profile' component={Profile}/>
          <PrivateRoute exact path='/goods' component={GoodsInfo}/>

          <Redirect exact from='/' to='/autoplay' />
          <Redirect exact from='*' to='/404' />x
        </Switch>
      </div>
    )
  }
}

export default ContentMain
