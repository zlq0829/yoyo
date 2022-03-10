import React, { useState, useEffect, useCallback } from 'react';
import { Select, Empty } from 'antd';
import API from '@/services';
import './index.less';

// const AutoPlay = () => {
//   const [options, setOptions] = useState([]);                     // 播放列表
//   const [goodsList, setGoodsList] = useState([]);                 // 商品列表
//   const [reverse, setReverse] = useState(true);                   // 横竖屏
//   const [loading, setLoading] = useState(false);                  // 下拉框loading
//   const [defaultValue, setDfaultValue] = useState();              // 下拉框默认选中第一条
//   const [isPlay, setIsPlay] = useState(false);                    // 播放状态
//   const localServerUrl = process.env.REACT_APP_LOCAL_SERVER_URL;  // ws

//   // 选中新的的播放商品 && 根据选中的id获取新的商品
//   const handleChange = (id) => {
//     const goods = this.state.options.find((good) => id === good.id);
//     setDfaultValue(goods.label);
//     getGoodsList(id);
//   };

//   //横竖屏切换
//   const handleReverse = () => {
//     setReverse((reverse) => !reverse);
//   };

//   // 改变直播商品
//   const handleChangeGoods = (item) => {};

//   // 直播 || 关闭
//   const handleVideoProcess = () => {
//     setIsPlay((isPlay) => !isPlay)

//   }
//   // 请求商品列表
//   const getGoodsList = async (id) => {
//     let response = null;
//     const data = {
//       play_list_id: id,
//       size: 999,
//     };
//     setLoading(true);
//     try {
//       response = await API.autoPlayApi.getGoodsList(data);
//     } catch (error) {
//       setLoading(false);
//       return false;
//     }
//     if (response && response.code === 200) {
//       setGoodsList((response) => response.data);
//     }
//   };

//   // 请求播放列表
//   const getPlaylist = async () => {
//     let response = null;
//     try {
//       response = await API.autoPlayApi.getPlaylist();
//     } catch (error) {
//       return false;
//     }
//     if (response && response.code === 200) {
//       response.data.content.forEach((option) => {
//         option.label = option.name;
//         option.value = option.id;
//       });

//       if(response.data?.content.length > 0) {
//         setOptions(response.data.content);
//         setDfaultValue((response) => response.data.content[0].label);
//         getGoodsList(response.data.content[0].id);
//       }
//     }
//   };

//   // 通过 ws 连接视频处理服务器
//   const connectVideoProcess = useCallback(()=>{
//     console.log('连接视频')
//   },[])

//   // 断开视频处理服务器
//   const disConnectVideoProcess = useCallback(()=>{
//     console.log('断开视频')
//   }, [])

//   // 根据播放状态判定播放 || 关闭
//   useEffect(()=>{
//     if(isPlay) {
//       connectVideoProcess()
//     } else {
//       disConnectVideoProcess()
//     }
//   },[isPlay, connectVideoProcess, disConnectVideoProcess])

//   useEffect(()=>{
//     getPlaylist()
//   })

//   return (
//     <div className='auto_play flex justify-between h-full overflow-hidden'>
//       {/* 左 */}
//       <div className='flex-1 rounded bg-white h-full'>
//         <div className='border-b text-center mb-3 h_45 line_height_45'>
//           直播列表
//         </div>
//         <div className='mb-3 flex justify-between px-3 w_210_'>
//           <Select
//             defaultActiveFirstOption
//             value={defaultValue}
//             className='rounded-full flex-1 site-select'
//             loading={loading}
//             placeholder='请选择'
//             options={options}
//             onChange={handleChange}
//           />
//           {/* <div className='h_w_32 box-border rounded-full flex-none flex justify-center items-center bg-FF8462 m_l_5 cursor-pointer'>
//             <AppstoreAddOutlined />
//           </div> */}
//         </div>
//         <div className='goods relative box-border pr-4 goods_h'>
//           {goodsList.length > 0 ? (
//             <div className='flex flex-wrap'>
//               {goodsList.map((good) => {
//                 return (
//                   <div
//                     className='flex flex-col goods_item  w_80 ml-4 mb-4 cursor-pointer rounded'
//                     onClick={() => handleChangeGoods(good)}
//                     key={good.id}
//                   >
//                     <img src={good.image[0]} alt='' className=' w_80 rounded' />
//                     <div className='text-overflow font_12 mt-1 px-1'>
//                       {good.name}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div>
//               <div className='absolute empty_icon'>
//                 <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 中 */}
//       <div
//         className='m_l_r_24 w_300 flex-1  box-border flex flex-col'
//         style={{
//           maxWidth: !reverse ? '600px' : '500px',
//           width: !reverse ? '400px' : '300px',
//           minWidth: !reverse ? '400px' : '300px',
//         }}
//       >
//         <div
//           className={[
//             !reverse && 'flex items-center',
//             'rounded relative flex-1 bg-white',
//           ].join(' ')}
//         >
//           {/* 横竖屏 */}
//           {reverse ? (
//             <div className='play_window h-full rounded' />
//           ) : (
//             <div className='play_window w-full h_268 rounded' />
//           )}
//           <div
//             className='font_14 color_FF8462 bg-001529 w_50 text-center absolute right-0 top-2 rounded-l cursor-pointer'
//             onClick={handleReverse}
//           >
//             {reverse ? '横屏' : '竖屏'}
//           </div>
//         </div>
//         <div className='play_contron h_80 rounded bg-white mt-4 flex justify-center items-center'>
//           <button className='bg-FF8462 px-6 py-2 rounded-full text-white' onClick={handleVideoProcess}>
//             {/* 开始直播 */}
//             {
//               isPlay? (<span>开始直播</span>):(<span>关闭直播</span>)
//             }
//           </button>
//         </div>
//       </div>

//       {/* 右 */}
//       <div className='flex-1 rounded bg-white'>
//         <div className='border-b text-center mb-3 h_45 line_height_45'>
//           直播间互动
//         </div>
//         <div className='interactive_area_h relative'>
//           <div className='absolute empty_icon'>
//             <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

class AutoPlay extends React.Component {
  state = {
    // select组件options
    options: [],
    // 商品
    goods: [],
    // 横竖切换, 默认是竖屏 true
    reverse: true,
    // 下拉框默认选中第一条
    defaultValue: '',
    // 下拉框loading
    loading: false,
    // 播放状态
    isPlay: false,
  };

  // 选中新的的播放商品 && 根据选中的id获取新的商品
  handleChange = (value) => {
    let good = this.state.options.find((good) => value === good.id);
    this.setState({ defaultValue: good.label });
    this.getGoodsList(value);
  };

  // 横竖屏切换
  handleReverse = () => {
    this.setState({ reverse: !this.state.reverse });
  };

  // 直播 || 关闭
  handleVideoProcess = async () => {
    await this.setState({ isPlay: !this.state.isPlay });
    const { isPlay } = this.state
    if(isPlay) {
      console.log('开始播放')
    } else {
      console.log('关闭播放')
    }
  }

  // 选中商品
  handleChangeGoods = (item) => {};

  // 获取商品列表
  getGoodsList = async (id) => {
    let response = null;
    let data = {
      play_list_id: id,
      size: 999,
    };

    this.setState({ loading: true });
    try {
      response = await API.autoPlayApi.getGoodsList(data);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      return false;
    }

    if (response && response.code === 200) {
      this.setState({
        goods: response.data,
      });
    }
  };

  // 通过 ws 连接视频处理服务器
  connectVideoProcess = () => {
    console.log('链接')
  }

  // 断开视频处理服务器
  disConnectVideoProcess = () => {
    const { localServerWsClient: client } = window
    if(client) {
      client.send('stop->{}')
    }
  }

  async componentDidMount() {
    let response = null;
    try {
      response = await API.autoPlayApi.getPlaylist();
    } catch (error) {
      return false;
    }

    if (response && response.data.content.length > 0) {
      response.data.content.forEach((option) => {
        option.label = option.name;
        option.value = option.id;
      });
      this.setState({
        options: response.data.content,
        defaultValue: response.data.content[0].label,
      });
      this.getGoodsList(response.data.content[0].id);
    }
  }

  render() {
    const { options, goods, reverse, defaultValue, loading, isPlay } = this.state
    return (
      <div className='auto_play flex justify-between h-full overflow-hidden'>
        {/* 左 */}
        <div className='flex-1 rounded bg-white h-full'>
          <div className='border-b text-center mb-3 h_45 line_height_45'>
            直播列表
          </div>
          <div className='mb-3 flex justify-between px-3 w_210_'>
            <Select
              defaultActiveFirstOption
              value={defaultValue}
              className='rounded-full flex-1 site-select'
              loading={loading}
              placeholder='请选择'
              options={options}
              onChange={this.handleChange}
            />
            {/* <div className='h_w_32 box-border rounded-full flex-none flex justify-center items-center bg-FF8462 m_l_5 cursor-pointer'>
              <AppstoreAddOutlined />
            </div> */}
          </div>
          <div className='goods relative box-border pr-4 goods_h'>
            {goods.length > 0 ? (
              <div className='flex flex-wrap'>
                {goods.map((good) => {
                  return (
                    <div
                      className='flex flex-col goods_item  w_80 ml-4 mb-4 cursor-pointer rounded'
                      onClick={() => this.handleChangeGoods(good)}
                      key={good.id}
                    >
                      <img
                        src={good.image[0]}
                        alt=''
                        className=' w_80 rounded'
                      />
                      <div className='text-overflow font_12 mt-1 px-1'>
                        {good.name}
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
        <div
          className='m_l_r_24 w_300 flex-1  box-border flex flex-col'
          style={{
            maxWidth: !reverse ? '600px' : '500px',
            width: !reverse ? '400px' : '300px',
            minWidth: !reverse ? '400px' : '300px',
          }}
        >
          <div
            className={[
              !reverse && 'flex items-center',
              'rounded relative flex-1 bg-white',
            ].join(' ')}
          >
            {/* 横竖屏切换 */}
            {reverse ? (
              <div className='play_window h-full rounded' />
            ) : (
              <div className='play_window w-full h_268 rounded' />
            )}
            <div
              className='font_14 color_FF8462 bg-001529 w_50 text-center absolute right-0 top-2 rounded-l cursor-pointer'
              onClick={this.handleReverse}
            >
              {reverse ? '横屏' : '竖屏'}
            </div>
          </div>
          <div className='play_contron h_80 rounded bg-white mt-4 flex justify-center items-center'>
            <button className='bg-FF8462 px-6 py-2 rounded-full text-white' onClick={this.handleVideoProcess}>
              {
                !isPlay? (<span>开始直播</span>):(<span>关闭直播</span>)
              }
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
