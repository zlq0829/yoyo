import React from 'react';
import { Tabs, Empty } from 'antd';
import API from '@/services';
import goods from '@/assets/images/goos.jpg';
import './index.less';
const { TabPane } = Tabs;

class GoodsManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 商品列表
      goodsList: [],
    };
  }

  // 商品编辑
  handleGoodsEdit = () => {};

  // 商品删除
  handleGoodsDelete = () => {};

  // 生命周期, 默认卡片位置是在所有商品位置,所以第一次只请求所有商品的数据,后面再根据切换请求其他的数据
  async componentDidMount() {
    let response = null;
    try {
      response = await API.goodsManageApi.getGoodsList();
      console.log(response);
    } catch (error) {
      return false;
    }

    if (response && response.data.content.length > 0) {
      this.setState({
        goodsList: response.data.content,
      });
    }
  }

  render() {
    return (
      <div className='box-border goodsmanage overflow-hidden'>
        <div className='pb-6 pt-4 pl-6 bg-white rounder relative goodsmanage_h_full'>
          <Tabs>
            <TabPane tab='所有商品' key='1'>
              <div className='good_list_wrap_h_full -ml-12'>
                {!this.state.goodsList.length > 0 ? (
                  <div className='flex flex-wrap'>
                    {this.state.goodsList.map((goods) => {
                      return (
                        <div
                          className='flex flex-col goods_item w_83 ml-12 mb-12 cursor-pointer rounded'
                          key={goods.id}
                        >
                          <div className='relative goods_item__hover'>
                            {goods.image ? (
                              <img
                                src={goods.image[0]}
                                alt=''
                                className='w_83 rounded'
                              />
                            ) : (
                              <div className='w_83 h_83 '>
                                <video src={goods.video_url} className='w-full, h-full _video rounded'/>
                              </div>
                            )}
                            <div className='absolute hidden justify-between font_12 w-full bottom-0 text-white bg-FF8462 opacity-60 edit'>
                              <span
                                className='text-center flex-1'
                                onClick={this.handleGoodsEdit}
                              >
                                编辑
                              </span>
                              <span
                                className='text-center flex-1'
                                onClick={this.handleGoodsDelete}
                              >
                                删除
                              </span>
                            </div>
                          </div>
                          <div className='text-overflow font_12 mt-3 px-1'>
                            测试测试测试测试测试测试测试
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>1</div>
                )}
              </div>
            </TabPane>
            <TabPane tab='播放列表' key='2'></TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// const GoodsManage = () => {
//   // 商品列表
//   const [goodsList, setGoodList] = useState([]);

//   // 直播列表
//   const [playList, setPlayList] = useState([]);

//   // 所有商品当前页码
//   const [goodsCurrentPage, setGoodsCurrentPage] = useState(1);

//   // 所有商品页面总数
//   const [goodsTotalPage, setGoodsTotalPage] = useState();

//   // 播放列表当前页码
//   const [playCurrentPage, setPlayCurrentPage] = useState(1);

//   // 播放列表页面总数
//   const [playTotalPage, setPlayTotalPage] = useState();

//   // 切换卡片的激活码
//   const [activeKey, setActiveKey] = useState('1');

//   // 页码改变回调
//   const handlePageChange = (value) => {
//     switch (activeKey) {
//       case '1':
//         setGoodsCurrentPage(value);
//         break;
//       default:
//         setPlayCurrentPage(value);
//     }
//   };

//   // 语音合成状态
//   const speechState = (state) => {
//     const style = {
//       cursor: 'pointer',
//     };
//     switch (state) {
//       case 'f':
//         return <ClockCircleFilled style={{ color: '#f5222d', ...style }} />;
//       case 'd':
//         return <QuestionCircleFilled style={{ color: 'yellow', ...style }} />;
//       case 'u':
//         return <CheckCircleFilled style={{ color: '#87d068', ...style }} />;
//       default:
//         return <ClockCircleFilled style={{ color: '#f5222d', ...style }} />;
//     }
//   };

//   // Tabs组件切换
//   const handleTabSwitch = (key) => {
//     setActiveKey(key);
//   };

//   // 获取商品列表
//   const getGoodsList = (params) => {
//     const data = {};
//     Object.assign(data, params);
//     // 接受请求的商品列表
//     // setGoodList()
//     // 接受商品的总数量
//     // setTotalPage()
//     console.log('获取商品列表');
//   };

//   // 获取直播列表
//   const getPlayList = (params) => {
//     const data = {};
//     Object.assign(data, params);
//     console.log('获取直播列表');
//   };

//   useEffect(() => {
//     switch (activeKey) {
//       case '1':
//         getGoodsList();
//         break;
//       default:
//         getPlayList();
//     }
//   }, [activeKey]);

//   return (
//     <div className='h-full box-border'>
//       <div className='px-4 py-3 bg-white rounder h-full relative'>
//         <div className='h__90'>
//           <Tabs
//             defaultActiveKey={activeKey}
//             onChange={(key) => handleTabSwitch(key)}
//           >
//             <TabPane tab='所有商品' key='1'>
//               {goodsList.length > 0 ? (
//                 goodsList.map((goods) => {
//                   return (
//                     <Row gutter={[15, 15]}>
//                       <Col span={4}>
//                         <Badge count={speechState('u')} offset={[-4, 4]}>
//                           <div className='h-full w-full overflow-hidden rounded cursor-pointer relative'>
//                             <img src={goods.url} alt='' className='h-full' />
//                           </div>
//                         </Badge>
//                       </Col>
//                     </Row>
//                   );
//                 })
//               ) : (
//                 <div className='h-full flex justify-center items-center pt-40'>
//                   <Empty />
//                 </div>
//               )}
//             </TabPane>
//             <TabPane tab='播放列表' key='2'>
//               {playList.length > 0 ? (
//                 playList.map((item) => {
//                   return (
//                     <Row gutter={[15, 15]}>
//                       <Col span={4}>
//                         <Badge count={speechState('u')} offset={[-4, 4]}>
//                           <div className='h-full w-full overflow-hidden rounded cursor-pointer relative'>
//                             <img src={item.url} alt='' className='h-full' />
//                           </div>
//                         </Badge>
//                         <div className='w-full px-1 truncate'></div>
//                       </Col>
//                     </Row>
//                   );
//                 })
//               ) : (
//                 <div className='h-full flex justify-center items-center pt-40'>
//                   <Empty />
//                 </div>
//               )}
//             </TabPane>
//           </Tabs>
//         </div>
//         <div className='flex justify-center line_height_none'>
//           <Pagination
//             total={activeKey === '1' ? goodsTotalPage : playTotalPage}
//             current={activeKey === '1' ? goodsCurrentPage : playCurrentPage}
//             showTotal={(total) => `共 ${total} 条`}
//             pageSize={24}
//             pageSizeOptions={[24]}
//             defaultCurrent={1}
//             onChange={handlePageChange}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

export default GoodsManage;
