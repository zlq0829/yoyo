import React from 'react';
import { Tabs, Empty, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  RedoOutlined,
  AudioTwoTone,
  CheckCircleTwoTone,
  SyncOutlined
} from '@ant-design/icons';
import Modal from '@/components/Modal'
import API from '@/services';
import './index.less';

const { TabPane } = Tabs;

class GoodsManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsList: [], // 商品列表
      playList: [], // 播放列表
      tabActive: '1', // 激活的卡片
      modelTitle: '',// Model标题
      modelVisible: false,// Model显示状态
      modelWidth: '400px', // Model宽度
      bodyStyle: {height: 'auto', textAlign: 'center', padding: '10px' },// Model的中间内容样式
      goodsId: '',//商品ID
      reLoad: false,// 刷新
    };
  }

  // 编辑商品
  handleGoodsEdit = (goods) => {
    if(goods.status === 'f') {
      message.info('语音合成中，无法进行操作！');
      return
    }

    this.props.history.push({
      pathname: `/goods/${goods.id}`,
      query: { goods, isAdd: false },
    });
  };

  // 删除商品
  handleGoodsDelete = async (goods) => {
    if(goods.status === 'f') {
      message.info('语音合成中，无法进行操作！');
      return
    } else {
      this.setState({modelVisible: true, goodsId: goods.id})
    }
  };

  // 编辑播放列表
  handlePlaysEdit = async (play) => {
    // let response = null;
    // let data = {
    //   play_list_id: play.id,
    //   size: 9999,
    // };
    // try {
    //   response = await API.goodsManageApi.getPlayGoodsList(data);
    // } catch (error) {
    //   return false;
    // }

    // if (response && response.data.length > 0) {
    //   response.data.forEach((e) => {
    //     this.state.goodsId.push(e.id);
    //     this.state.goodsList.some((goods) => {
    //       goods.checked = goods.id === e.id;
    //       return goods.id === e.id;
    //     });
    //   });

    //   this.setState({
    //     goodsList: this.state.goodsList,
    //     isModalVisible: true,
    //     updataOrAdd: true,
    //     checkedAll: response.data.length === this.state.goodsList.length,
    //     goodsName: play.name,
    //     playId: play.id,
    //   });
    // }
  };

  // 播放列表删除
  handlePlaysDelete = async (play) => {
    let response = null;
    try {
      response = await API.goodsManageApi.deletePlay(play.id);
      console.log(response);
    } catch (error) {
      return false;
    }
    if (response && response.code === 200) {
      this.getGoodsAndPlaylist();
    }
  };

  // Tabs切换
  handleTabChange = (activeKey) => {
    this.setState({ tabActive: activeKey });
  };

  // 新增播放
  handleAddPlays = () => {
    console.log('增加播放页')
  };

  // 刷新
  handleReLoad = () => {
    this.setState({reLoad: true})
    this.getGoodsAndPlaylist();
  };

  // 弹窗点击确定回调
  handleOk = async () => {
    let response = null
    try {
      response = await API.goodsManageApi.deleteGoods(this.state.goodsId)
    } catch (error) {
      message.error('删除失败！')
      return false
    }

    if(response && response.code === 200) {
      this.getGoodsAndPlaylist();
      this.setState({modelVisible: false})
    }
  };

  // 商品 && 播放列表请求
  getGoodsAndPlaylist = async () => {
    let response = null;
    try {
      response = await Promise.all([
        API.goodsManageApi.getGoodsList(),
        API.goodsManageApi.getPlaylist(),
      ]);
    } catch (error) {
      return false;
    }

    if (response && response.length > 0) {
      // 商品列表在其他页面还用到，所以存放到redux中，播放列表还是放在当前页面
      this.setState({
        reLoad: false,
        goodsList: response[0].data.content,
        playList: response[1].data.content,
      });
    }
  };

  // 生命周期
  componentDidMount() {
    this.getGoodsAndPlaylist();
  }

  render() {
    const { bodyStyle, modelWidth, modelTitle, modelVisible, reLoad, playList, goodsList } = this.state
    const { history } = this.props
    return (
      <div className='box-border goodsmanage overflow-hidden'>
        <div className='pb-6 pt-4 pl-6 pr-6 bg-white rounder relative goodsmanage_h_full box-border'>
          <Tabs onChange={this.handleTabChange} defaultActiveKey='1'>
            <TabPane tab='所有商品' key='1'>
              <div
                className={[
                  'good_list_wrap_h_full',
                  goodsList.length && '-ml-12',
                ].join(' ')}
              >
                {goodsList.length > 0 ? (
                  <div className='flex flex-wrap'>
                    {goodsList.map((goods) => {
                      return (
                        <div
                          className='flex flex-col goods_item w_100 ml-12 mb-12 cursor-pointer rounded'
                          key={goods.id}
                        >
                          {/* 图片或者视频 */}
                          <div className='relative goods_item__hover w_100 h_100 overflow-hidden border box-border rounded'>
                            {goods.image ? (
                              <img
                                src={goods.image[0]}
                                alt=''
                              />
                            ) : (
                              <div className='w_100 h_100 rounded overflow-hidden  border box-border'>
                                <video
                                  src={goods.video_url}
                                  className='w-full h-full object-fit'
                                />
                              </div>
                            )}

                            {/* 语音合成中或合成成功状态 */}
                            <div className='absolute left-0 top-0 z-10'>
                              {goods.status === 'f' ? (
                                <div className=' flex items-center ml_3 mt-1'>
                                  <AudioTwoTone twoToneColor='#ff8462' />
                                  <span className='font_12 color-ee6843'>
                                    语音合成中....
                                  </span>
                                </div>
                              ) : (
                                <div className=' flex items-center ml_3 mt-1'>
                                  <CheckCircleTwoTone twoToneColor='#ff8462' />
                                </div>
                              )}
                            </div>

                            {/* 删除 和 编辑 */}
                            <div className='absolute hidden justify-between font_12 w-full bottom-0 text-white bg-FF8462 opacity-60 edit'>
                              <span
                                className='text-center flex-1 h-full'
                                onClick={(e) => this.handleGoodsEdit(goods)}
                              >
                                编辑
                              </span>
                              <span
                                className='text-center flex-1 h-full'
                                onClick={(e) => this.handleGoodsDelete(goods)}
                              >
                                删除
                              </span>
                            </div>
                          </div>
                          <div className='font_12 mt-3 px-1'>
                            <div className='text-overflow text-center'>{goods.name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='mt-20'>
                    <Empty />
                  </div>
                )}
              </div>
            </TabPane>
            <TabPane tab='播放列表' key='2'>
              <div
                className={[
                  'good_list_wrap_h_full',
                  playList.length && '-ml-12',
                ].join(' ')}
              >
                {playList.length > 0 ? (
                  <div className='flex flex-wrap'>
                    {playList.map((play) => {
                      return (
                        <div
                          className='flex flex-col goods_item w_100 ml-12 mb-12 cursor-pointer rounded'
                          key={play.id}
                        >
                          <div className='relative goods_item__hover w_100 h_100 overflow-hidden border box-border rounded'>
                            <img
                              src={play.cover_image}
                              alt=''
                            />
                            <div className='absolute hidden justify-between font_12 w-full bottom-0 text-white bg-FF8462 opacity-60 edit'>
                              <span
                                className='text-center flex-1'
                                onClick={(e) => this.handlePlaysEdit(play)}
                              >
                                编辑
                              </span>
                              <span
                                className='text-center flex-1'
                                onClick={(e) => this.handlePlaysDelete(play)}
                              >
                                删除
                              </span>
                            </div>
                          </div>
                          <div className='font_12 mt-3 px-1'>
                            <div className='text-overflow text-center'>{play.name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='mt-20'>
                    <Empty />
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>

          <div className='absolute z-10 _top right-6 flex'>
            <div
              className='border flex items-center py-0.5 px-4 rounded cursor-pointer reload'
              onClick={this.handleReLoad}
            >
              {
                !reLoad? (<RedoOutlined />) : (<SyncOutlined spin />)
              }
            </div>
            {this.state.tabActive === '1' ? (
              <div
                className='border flex items-center py-0.5 px-4 rounded cursor-pointer ml-3'
                onClick={()=>history.push({ pathname: '/goods', query: { isAdd: true } })}
              >
                新增
              </div>
            ) : (
              <div
                className='border flex items-center py-0.5 px-4 rounded cursor-pointer ml-3'
                onClick={()=>history.push({pathname: '/plays'})}
              >
                新增
              </div>
            )}
          </div>
        </div>
        <Modal
          title={modelTitle}
          visible={modelVisible}
          width={modelWidth}
          bodyStyle={bodyStyle}
          onCancel={()=>this.setState({modelVisible: false})}
          onOk={this.handleOk}
        >
          <div>确定删除该商品！</div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GoodsManage)
);
