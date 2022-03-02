import React from 'react';
import { Select, Carousel } from 'antd'
import { AppstoreAddOutlined } from '@ant-design/icons';

import './index.less'

class AutoPlay extends React.Component {
  state = {
    // Select组件options
    options: [
      {
        label: '西瓜',
        value: 'xigua'
      },
      {
        label: '苹果',
        value: 'pg'
      }
    ],
    // 商品
    goods: [

    ]
  }

  // Select组件value值改变
  handleChange = (value) => {
    console.log(value)
  }

  render(){
    const contentStyle = {
      height: '160px',
      width: 'auto',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };
    return(
      <div className='auto_play flex justify-between h-full'>
        <div className='flex-1 rounded bg-white flex flex-col overflow-hidden'>
          <div className='border-b text-center py-3 mb-3'>直播列表</div>
          <div className='mb-3 flex justify-between px-3'>
            <Select
              className='rounded-full flex-1 site-select'
              loading={false}
              placeholder='请选择'
              options={this.state.options}
              onChange={this.handleChange}
            />
            <div className='h_w_32 box-border rounded-full flex-none flex justify-center items-center bg-FF8462 m_l_5 cursor-pointer'>
              <AppstoreAddOutlined />
            </div>
          </div>
          <div className='px-3 goods relative flex-1'>
            <div>内容</div>
            <div className='absolute bottom_20 z-10 left-0 px-3 flex justify-center w-full '>
              <div className='w_h_10 rounded-full anchor anchor_active'></div>
              <div className='w_h_10 rounded-full anchor'></div>
              {/* <div className='w_h_10 rounded-full anchor'></div> */}
            </div>
          </div>
        </div>
        <div className='m_l_r_24 w_300 flex-1 rounded bg-white box-border'>2</div>
        <div className='flex-1 rounded bg-white'>3</div>
      </div>
    )
  }
}
export default AutoPlay;
