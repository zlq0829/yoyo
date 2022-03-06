import React from 'react';
import { Tabs, Empty, Modal, Input } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
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
      isModalVisible: false, // 弹窗
      title: '新增播放列表', // 弹窗标题
    };
  }

  // 商品编辑
  handleGoodsEdit = () => {};

  // 商品删除
  handleGoodsDelete = () => {};

  // 播放列表编辑
  handlePlaysEdit = () => {};

  // 播放列表删除
  handlePlaysDelete = () => {};

  // Tabs切换
  handleTabChange = (activeKey) => {
    this.setState({ tabActive: activeKey });
  };

  // 新增商品
  handleAddGoods = () => {
    this.setState({
      isModalVisible: true,
      title: '新增商品',
    });
  };

  // 新增播放
  handleAddPlays = () => {
    this.setState({
      isModalVisible: true,
      title: '新增播放',
    });
  };

  // 刷新
  handleReLoad = () => {
    this.getGoodsAndPlaylist();
  };

  // 弹窗点击确定回调
  handleOk = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  // 弹窗点击遮罩层或右上角叉或取消按钮的回调
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
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
      this.setState({
        goodsList: response[0].data.content,
        playList: response[1].data.content,
      });
    }
  };

  // 生命周期
  componentDidMount() {
    // this.getGoodsAndPlaylist();
  }

  render() {
    return (
      <div className='box-border goodsmanage overflow-hidden'>
        <div className='pb-6 pt-4 pl-6 bg-white rounder relative goodsmanage_h_full'>
          <Tabs onChange={this.handleTabChange} defaultActiveKey='2'>
            <TabPane tab='所有商品' key='1'>
              <div
                className={[
                  'good_list_wrap_h_full',
                  this.state.goodsList.length && '-ml-12',
                ].join(' ')}
              >
                {this.state.goodsList.length > 0 ? (
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
                                <video
                                  src={goods.video_url}
                                  className='w-full, h-full _video rounded'
                                />
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
                          <div className='font_12 mt-3 px-1'>
                            {/* 测试测试测试测试测试测试测试 */}
                            <div className='text-overflow'>
                              测试测试测试测试测试测试测试
                            </div>
                            <div className='flex items-end overflow-hidden'>
                              <span>💰</span>
                              <span className='scale_8'>{goods.price}</span>
                            </div>
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
                  this.state.playList.length && '-ml-12',
                ].join(' ')}
              >
                {this.state.playList.length > 0 ? (
                  <div className='flex flex-wrap'>
                    {this.state.playList.map((play) => {
                      return (
                        <div
                          className='flex flex-col goods_item w_83 ml-12 mb-12 cursor-pointer rounded'
                          key={play.id}
                        >
                          <div className='relative goods_item__hover'>
                            <img
                              src={play.cover_image}
                              alt=''
                              className='w_83  rounded '
                            />
                            <div className='absolute hidden justify-between font_12 w-full bottom-0 text-white bg-FF8462 opacity-60 edit'>
                              <span
                                className='text-center flex-1'
                                onClick={this.handlePlaysEdit}
                              >
                                编辑
                              </span>
                              <span
                                className='text-center flex-1'
                                onClick={this.handlePlaysDelete}
                              >
                                删除
                              </span>
                            </div>
                          </div>
                          <div className='text-overflow font_12 mt-3 px-1'>
                            <div>{play.name}</div>
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
              <RedoOutlined />
            </div>
            {this.state.tabActive === '1' ? (
              <div
                className='border flex items-center py-0.5 px-4 rounded cursor-pointer ml-3'
                onClick={this.handleAddGoods}
              >
                新增
              </div>
            ) : (
              <div
                className='border flex items-center py-0.5 px-4 rounded cursor-pointer ml-3'
                onClick={this.handleAddPlays}
              >
                新增
              </div>
            )}
          </div>
        </div>
        <Modal
          title={this.state.title}
          visible={!this.state.isModalVisible}
          closable={false}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className='search_frame mb-3'>
            <label className='font_12'>名称：</label>
            <Input className='w__8 border_1' placeholder='请定义播放名称' />
          </div>
          <div className='goods_wrap overflow-hidden'>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            <p>1</p>
            {/* <div className='box-border'> */}

            {/* </div> */}
          </div>
        </Modal>
      </div>
    );
  }
}
export default GoodsManage;
