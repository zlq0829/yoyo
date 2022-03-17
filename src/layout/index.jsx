import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Redirect } from 'react-router-dom';
import './index.less';
const SiderNav = React.lazy(()=>import('./components/SiderNav'))
const ContentMain = React.lazy(()=>import('./components/ContentMain'))



function _Layout(props) {
  const { token, avatar } = props;

  if(!token) {
    return <Redirect to='/login'/>
  }
  return (
    <div className='flex-1'>
      <Layout className='layout'>
        <Layout.Sider defaultCollapsed={true} trigger={null}>
          <div className='w_74 h_60 mt-3'>
            <div className="w_60 h_60 ml_14 overflow-hidden rounded-full">
              <img src={avatar} alt='' className='w-full h-full'/>
            </div>
          </div>
          <SiderNav />
        </Layout.Sider>
        <Layout>
          <ContentMain />
        </Layout>
      </Layout>
    </div>
  );
}

const mapStateToProps = (state) => ({
  token: state.profile.token,
  avatar: state.profile.avatar
});
export default connect(mapStateToProps)(_Layout);
