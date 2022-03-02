import React from 'react';
import { Select, Empty } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import API from '@/services';
import './index.less';

class AutoPlay extends React.Component {
  state = {
    // select组件options
    options: [
      {
        label: '西瓜',
        value: 'xigua',
      },
      {
        label: '苹果',
        value: 'pg',
      },
    ],

    // 商品
    goods: [],

    // 横竖切换, 默认是横屏 false
    reverse: true,
  };

  // Select组件value值改变
  handleChange = (value) => {
    console.log(value);
  };

  // 横竖屏切换
  handleReverse = () => {
    this.setState({
      reverse: !this.state.reverse,
    });
  };

  // 改变商品
  handleChangeGoods = (item) => {
    console.log(item)
  }

  // 请求商品列表
  getGoodsList = async (params) => {
    let response = null
    try {
      response = await API.autoPlayApi.getGoodsList()
    } catch (error) {
      return false
    }
  }

  // 请求播放列表，在根据播放列表的第一条数据请求商品列表
  async componentDidMount() {
    let response = null
    try {
      response = await API.autoPlayApi.getPlaylist()
      this.autoPlayApi(response)
    } catch (error) {
      return false
    }
  }


  render() {
    return (
      <div className='auto_play flex justify-between h-full overflow-hidden'>
        {/* 左 */}
        <div className='flex-1 rounded bg-white h-full'>
          <div className='border-b text-center mb-3 h_45 line_height_45'>直播列表</div>
          <div className='mb-3 flex justify-between px-3'>
            <Select
              defaultValue={this.state.options[0].label}
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
          <div className='goods relative box-border pr-4 goods_h'>
            {this.state.goods.length > 0 ? (
              <div className='flex flex-wrap'>
                {this.state.goods.map((goods) => {
                  return (
                    <div className='flex flex-col goods_item  w_83 ml-4 mb-4 cursor-pointer' onClick={this.handleChangeGoods}>
                      <img src={goods.url} alt='' className=' w_83 rounded' />
                      <div className='text-overflow font_12 mt-1 px-1'>
                        {goods.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className='absolute empty_icon'>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 中 */}
        <div className='m_l_r_24 w_300 flex-1 rounded  box-border flex flex-col'>
          <div className='play_window bg-white flex-1 rounded relative'>
            <div
              className='mt-3 font_14 color_FF8462 bg-001529 w_50 text-center absolute right_0 rounded-l cursor-pointer'
              onClick={this.handleReverse}
            >
              {this.state.reverse ? '横屏' : '竖屏'}
            </div>
          </div>
          <div className='play_contron h_80 rounded bg-white mt-4 flex justify-center items-center'>
            <button className='bg-FF8462 px-6 py-2 rounded-full text-white'>
              开始直播
            </button>
          </div>
        </div>

        {/* 右 */}
        <div className='flex-1 rounded bg-white'>
          <div className='border-b text-center mb-3 h_45 line_height_45'>
            直播间互动
          </div>
          <div className='interactive_area_h relative'>
            <div className='absolute empty_icon'>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AutoPlay;
