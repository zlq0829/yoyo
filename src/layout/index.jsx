import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Redirect } from 'react-router-dom';
import './index.less';
import cloudIcon from '@/assets/ui/sidernav/icon-cloud.png'
import logo from '@/assets/ui/sidernav/logo.png'
import decoration from '@/assets/ui/sidernav/image-trim.png'

const SiderNav = React.lazy(()=>import('./components/SiderNav'))
const ContentMain = React.lazy(()=>import('./components/ContentMain'))

function _Layout(props) {
  const { token } = props;

  if(!token) {
    return <Redirect to='/login'/>
  }
  return (
    <div className='flex-1'>
      <Layout className='layout'>
        <Layout.Sider  trigger={null} width='108px' breakpoint='xl'>
          <div className='avatar  mt_40px'>
            <div className='rounded-full h_w_66px box-border m-auto border_3px'></div>
            <div className='mt_10px text-center color-fff font_12'>
              <span>YoYo</span>
              <div className='h-auto w-full p_l_r_10px flex mt_5px mb_15px'>
                <p style={{ width: '5px', height: '5px',background: '#fff', opacity: '0.5', borderRadius: '50%',  marginRight: '5px' }}></p>
                <p style={{ width: '5px', height: '5px',background: '#fff', borderRadius: '50%', marginRight: '5px' }}></p>
                <p style={{ height: '5px',background: '#fff', flex: 1,  borderRadius: '999px' }}></p>
              </div>
            </div>
          </div>
          <SiderNav />
          <img src={cloudIcon} className='absolute top-0 left-0 z-20'/>
          <img src={logo} className='logo absolute bottom_25px left_25px'/>
          <img src={decoration} className='absolute bottom_85px left_10px'/>
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
});
export default connect(mapStateToProps)(_Layout);
