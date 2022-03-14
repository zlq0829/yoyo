import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
const AutoPlay = React.lazy(() => import('@/pages/AutoPlay'));
const GoodsManage = React.lazy(() => import('@/pages/GoodsManage'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const GoodsInfo = React.lazy(() => import('@/pages/GoodsInfo'));

function ContentMain(props) {
  const { token } = props;
  return (
    <div style={{ padding: '15px', position: 'relative', height: '100%' }}>
      <Switch>
        <Route path='/autoplay' component={AutoPlay} />
        <Route path='/goodsmanage' component={GoodsManage} />
        <Route path='/profil' component={Profile} />
        <Route path='/goods/:id?' component={GoodsInfo} />
        <Redirect from='/' to={ token? '/autoplay' : '/login'} />
        {
          !token && <Redirect to='/login'/>
        }
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => ({
  token: state.profile.token,
});
export default connect(mapStateToProps)(ContentMain);
