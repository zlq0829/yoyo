import React from 'react';
import { Input } from 'antd';
import './index.less';

class PlayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <div className='h-full overflow-hidden play-info'>
        <div className='bg-white plays_h_full py-4 px-6 relative'>
          <span className='text-black font-semibold font_20'>直播列表/新增播放</span>
          <div className='goods-wrap mt-6'>
            <div className='goods-name flex items-center'>
              <span className='w-100px'>列表名称：</span>
              <div>
                <Input style={{ borderWidth: '1px', height: '30px', borderColor: 'rgb(204,204,204)'}}/>
              </div>
            </div>
            <div className='goods-list mt-6'>
              <div>已有商品：</div>
              {/* <div className='flex flex-wrap'></div> */}
            </div>
            <div className='pagination mt-6'></div>
          </div>
          <div className='chosen-goods'></div>
          <div className='footer fixed bottom_15px z-10 left_95px w flex items-center justify-center bg-white py-2'>
            <button className='mr-6 border px-6 py-1 rounded'>取消</button>
            <button className='px-6 py-1 rounded bg-gray-300'>保存</button>
          </div>
        </div>
      </div>
    );
  }
}
export default PlayInfo;
