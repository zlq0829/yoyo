import React, { useState, useEffect } from 'react';
import { Select, Empty } from 'antd';
import API from '@/services';
import './index.less';

const AutoPlay = () => {
  const [options, setOptions] = useState([]); // 播放列表
  const [goodsList, setGoodsList] = useState([]); // 商品列表
  const [reverse, setReverse] = useState(true); // 横竖屏
  const [loading, setLoading] = useState(false); // 下拉框loading
  const [defaultValue, setDfaultValue] = useState(''); // 下拉框默认选中第一条

  // Select组件value值改变
  const handleChange = (value) => {
    const goods = this.state.options.find((good) => value === good.id);
    setDfaultValue(goods.label);
  };

  //横竖屏切换
  const handleReverse = (value) => {
    setReverse((reverse) => !reverse);
  };

  // 改变直播商品
  const handleChangeGoods = (item) => {};

  // 请求商品列表
  const getGoodsList = async (params) => {
    let response = null;
    const data = {
      play_list_id: params,
      size: (params && params.size) || 999,
    };
    setLoading(true);
    try {
      response = await API.autoPlayApi.getGoodsList(data);
    } catch (error) {
      setLoading(false);
      return false;
    }
    if (response && response.code === 200) {
      setGoodsList((response) => response.data);
    }
  };

  // 请求播放列表
  const getPlaylist = async () => {
    let response = null;
    try {
      response = await API.autoPlayApi.getPlaylist();
    } catch (error) {
      return false;
    }
    if (response && response.code === 200) {
      response.data.content.forEach((option) => {
        option.label = option.name;
        option.value = option.id;
      });
      console.log(response)
      setOptions(response.data.content);
      if(response.data?.content.length > 0) {
        setDfaultValue((response) => response.data.content[0].label);
        getGoodsList(response.data.content[0].id);
      }

    }
  };


  useEffect(()=>{
    getPlaylist()
  },[])

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
            onChange={handleChange}
          />
          {/* <div className='h_w_32 box-border rounded-full flex-none flex justify-center items-center bg-FF8462 m_l_5 cursor-pointer'>
            <AppstoreAddOutlined />
          </div> */}
        </div>
        <div className='goods relative box-border pr-4 goods_h'>
          {goodsList.length > 0 ? (
            <div className='flex flex-wrap'>
              {goodsList.map((good) => {
                return (
                  <div
                    className='flex flex-col goods_item  w_80 ml-4 mb-4 cursor-pointer rounded'
                    onClick={() => handleChangeGoods(good)}
                    key={good.id}
                  >
                    <img src={good.image[0]} alt='' className=' w_80 rounded' />
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
          {/* 横竖屏 */}
          {reverse ? (
            <div className='play_window h-full rounded' />
          ) : (
            <div className='play_window w-full h_268 rounded' />
          )}
          <div
            className='font_14 color_FF8462 bg-001529 w_50 text-center absolute right-0 top-2 rounded-l cursor-pointer'
            onClick={handleReverse}
          >
            {reverse ? '横屏' : '竖屏'}
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
};

// class AutoPlay extends React.Component {
//   state = {
//     options: [], // select组件options
//     goods: [], // 商品
//     reverse: true, // 横竖切换, 默认是竖屏 true
//     defaultValue: '', // 下拉框默认选中第一条
//     loading: false, // 下拉框loading
//   };

//   // Select组件value值改变
//   handleChange = (value) => {
//     let good = this.state.options.find((good) => value === good.id);
//     this.setState({ defaultValue: good.label });
//     this.getGoodsList(value);
//   };

//   // 横竖屏切换
//   handleReverse = () => {
//     this.setState({
//       reverse: !this.state.reverse,
//     });
//   };

//   // 改变商品
//   handleChangeGoods = (item) => {};

//   // 请求商品列表
//   getGoodsList = async (params) => {
//     let response = null;
//     let data = {
//       play_list_id: params,
//       size: (params.size && params.size) || 999,
//     };

//     this.setState({ loading: true });
//     try {
//       response = await API.autoPlayApi.getGoodsList(data);
//       this.setState({ loading: false });
//     } catch (error) {
//       this.setState({ loading: false });
//       return false;
//     }

//     if (response && response.code === 200) {
//       this.setState({
//         goods: response.data,
//       });
//     }
//   };

//   // 请求播放列表，在根据播放列表的第一条数据请求商品列表
//   async componentDidMount() {
//     let response = null;
//     try {
//       response = await API.autoPlayApi.getPlaylist();
//     } catch (error) {
//       return false;
//     }

//     if (response && response.data.content.length > 0) {
//       response.data.content.forEach((option) => {
//         option.label = option.name;
//         option.value = option.id;
//       });
//       this.setState({
//         options: response.data.content,
//         defaultValue: response.data.content[0].label,
//       });
//       this.getGoodsList(response.data.content[0].id);
//     }
//   }

//   render() {
//     return (
//       <div className='auto_play flex justify-between h-full overflow-hidden'>
//         {/* 左 */}
//         <div className='flex-1 rounded bg-white h-full'>
//           <div className='border-b text-center mb-3 h_45 line_height_45'>
//             直播列表
//           </div>
//           <div className='mb-3 flex justify-between px-3 w_210_'>
//             <Select
//               defaultActiveFirstOption
//               value={this.state.defaultValue}
//               className='rounded-full flex-1 site-select'
//               loading={this.state.loading}
//               placeholder='请选择'
//               options={this.state.options}
//               onChange={this.handleChange}
//             />
//             {/* <div className='h_w_32 box-border rounded-full flex-none flex justify-center items-center bg-FF8462 m_l_5 cursor-pointer'>
//               <AppstoreAddOutlined />
//             </div> */}
//           </div>
//           <div className='goods relative box-border pr-4 goods_h'>
//             {this.state.goods.length > 0 ? (
//               <div className='flex flex-wrap'>
//                 {this.state.goods.map((good) => {
//                   return (
//                     <div
//                       className='flex flex-col goods_item  w_80 ml-4 mb-4 cursor-pointer rounded'
//                       onClick={() => this.handleChangeGoods(good)}
//                       key={good.id}
//                     >
//                       <img
//                         src={good.image[0]}
//                         alt=''
//                         className=' w_80 rounded'
//                       />
//                       <div className='text-overflow font_12 mt-1 px-1'>
//                         {good.name}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div>
//                 <div className='absolute empty_icon'>
//                   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 中 */}
//         <div
//           className='m_l_r_24 w_300 flex-1  box-border flex flex-col'
//           style={{
//             maxWidth: !this.state.reverse ? '600px' : '500px',
//             width: !this.state.reverse ? '400px' : '300px',
//             minWidth: !this.state.reverse ? '400px' : '300px',
//           }}
//         >
//           <div
//             className={[
//               !this.state.reverse && 'flex items-center',
//               'rounded relative flex-1 bg-white',
//             ].join(' ')}
//           >
//             {/* 横竖屏切换 */}
//             {this.state.reverse ? (
//               <div className='play_window h-full rounded' />
//             ) : (
//               <div className='play_window w-full h_268 rounded' />
//             )}
//             <div
//               className='font_14 color_FF8462 bg-001529 w_50 text-center absolute right-0 top-2 rounded-l cursor-pointer'
//               onClick={this.handleReverse}
//             >
//               {this.state.reverse ? '横屏' : '竖屏'}
//             </div>
//           </div>
//           <div className='play_contron h_80 rounded bg-white mt-4 flex justify-center items-center'>
//             <button className='bg-FF8462 px-6 py-2 rounded-full text-white'>
//               开始直播
//             </button>
//           </div>
//         </div>

//         {/* 右 */}
//         <div className='flex-1 rounded bg-white'>
//           <div className='border-b text-center mb-3 h_45 line_height_45'>
//             直播间互动
//           </div>
//           <div className='interactive_area_h relative'>
//             <div className='absolute empty_icon'>
//               <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

export default AutoPlay;
