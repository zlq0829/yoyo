import React from 'react';
import { Layout } from 'antd';
import SiderNav from './components/SiderNav'
import ContentMain from './components/ContentMain'
import './index.less';

class _Layout extends React.Component {
  render() {
    return (
      <div className="flex-1">
        <Layout className='layout'>
          <Layout.Sider
            collapsible
            breakpoint='xs'
          >
            <SiderNav />
          </Layout.Sider>
          <Layout>
            <ContentMain />
          </Layout>
        </Layout>
      </div>
    );
  }
};
export default _Layout;
