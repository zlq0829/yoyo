import React from 'react';
import { Tabs, Empty, Modal, Input, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
      checkedAll: false,// 全选
      goodsName: '',// 定义播放名称占位符
      goodsId: [], // 商品ID
      updataOrAdd: false, // 修改播放获新增播放，默认是false
      playId: '',       // 修改播放item的id
    };
  }

  // 商品编辑
  handleGoodsEdit = (goods) => {
    this.props.history.push({pathname: `/goods/${goods.id}`, query: {goods, isAdd: false} })
  };

  // 商品删除
  handleGoodsDelete = async (goods) => {
    let response = null
    try {
      response = await API.goodsManageApi.deleteGoods(goods.id)
    } catch (error) {
      return false
    }

    if(response && response.code ===200) {
      this.getGoodsAndPlaylist()
    }
  };

  // 播放列表编辑
  handlePlaysEdit = async (play) => {
    let response = null
    let data = {
      play_list_id: play.id,
      size: 9999
    }
    try {
      response = await API.goodsManageApi.getPlayGoodsList(data)
    } catch (error) {
      return false
    }

    if(response && response.data.length > 0) {
      response.data.forEach(e => {
        this.state.goodsId.push(e.id)
        this.state.goodsList.some(goods => {
          goods.checked = (goods.id === e.id)
          return (goods.id === e.id)
        })
      })

      this.setState({
        goodsList: this.state.goodsList,
        isModalVisible: true,
        updataOrAdd: true,
        checkedAll:  response.data.length ===  this.state.goodsList.length,
        goodsName: play.name,
        playId: play.id
      })
    }
  };

  // 播放列表删除
  handlePlaysDelete = async (play) => {
    let response = null
    try {
      response = await API.goodsManageApi.deletePlay(play.id)
      console.log( response )
    } catch (error) {
      return false
    }
    if(response && response.code ===200) {
      this.getGoodsAndPlaylist()
    }
  };

  // 全选回调
  handleCheckAll = () => {
    let goodsList,
      { checkedAll, goodsId } = this.state;
    this.setState({checkedAll: !checkedAll}, ()=>{
      goodsList = this.state.goodsList.filter(goods => {
        goods.checked = this.state.checkedAll
        if(!this.state.goodsId.includes(goods.id)) {
          goodsId.push(goods.id)
        }
        return goods
      })

      // 清空全选，选中的ID一起清空
      // if(!this.state.checkedAll) {
      //   this.state.goodsId = []
      // }
      this.setState({
        goodsList: this.state.checkedAll? []: goodsList
      })
    })
  }

  // 单选回调
  handleSingleCheck = (index) => {
    let { goodsList, goodsId } = this.state
    goodsList[index].checked = !goodsList[index].checked

    if(goodsList[index].checked) {
      goodsId.push(goodsList[index].id)
    } else {
      let indexOf = goodsId.indexOf(goodsList[index].id)
      if(indexOf !== -1) {
        goodsId.splice(indexOf, 1)
      }
    }

    let checkedAll = true
    goodsList.some(goods => {
      if(!goods.checked) {
        checkedAll = false
        return true
      }
    })
    this.setState({ checkedAll, goodsList: this.state.goodsList })
  }

  // Tabs切换
  handleTabChange = (activeKey) => {
    this.setState({ tabActive: activeKey });
  };

  // 新增商品
  handleAddGoods = () => {
    this.props.history.push({pathname: '/goods', query:{isAdd: true}})
  };

  // 新增播放
  handleAddPlays = () => {
    this.setState({
      updataOrAdd: false,
      isModalVisible: true,
      title: '新增播放',
    });
  };

  // 刷新
  handleReLoad = () => {
    this.getGoodsAndPlaylist();
  };

  // 弹窗点击确定回调
  handleOk = async () => {
    let { goodsId, goodsName, updataOrAdd } = this.state
    if(!goodsName) {
      message.warning('请定义播放名称！')
      return false
    }

    if(!goodsId.length) {
      message.warning('请选择要直播的商品！')
      return false
    }

    let response = null
    let data = {
      commodity_list: goodsId,
      name: goodsName,
    }

    try {
      if(updataOrAdd) {
        response = await API.goodsManageApi.updataPlayGoods(data, this.state.playId)
      } else {
        data.user = this.props.userInfo.profile.id
        response = await API.goodsManageApi.addPlay(data)
      }
    } catch (error) {
      message.error((error && error.message) || (updataOrAdd? '修改失败！' : '增加失败！'))
      return false
    }


    if(response && response.code===200){
      this.handleCancel()
      this.getGoodsAndPlaylist()
    }

  };

  // 弹窗点击遮罩层或右上角叉或取消按钮的回调
  handleCancel = () => {
    let goodsList = this.state.goodsList.filter(goods => {
      goods.checked = false
      return goods
    })

    this.setState({
      isModalVisible: false,
      checkedAll: false,
      goodsList,
      goodsName: '',
      goodsId: [],
      updataOrAdd: false,
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

    response[0].data.content.forEach(goods => {
      goods.checked = false
    })
    if (response && response.length > 0) {
      this.setState({
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
    return (
      <div className='box-border goodsmanage overflow-hidden'>
        <div className='pb-6 pt-4 pl-6 pr-6 bg-white rounder relative goodsmanage_h_full box-border'>
          <Tabs onChange={this.handleTabChange} defaultActiveKey='1'>
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
                          className='flex flex-col goods_item w_80 ml-12 mb-12 cursor-pointer rounded'
                          key={goods.id}
                        >
                          <div className='relative goods_item__hover'>
                            {goods.image ? (
                              <img
                                src={goods.image[0]}
                                alt=''
                                className='w_80 h_80 rounded'
                              />
                            ) : (
                              <div className='w_80 h_80 '>
                                <video
                                  src={goods.video_url}
                                  className='w-full, h-full _video rounded'
                                />
                              </div>
                            )}
                            <div className='absolute hidden justify-between font_12 w-full bottom-0 text-white bg-FF8462 opacity-60 edit'>
                              <span
                                className='text-center flex-1 h-full'
                                onClick={e => this.handleGoodsEdit(goods)}
                              >
                                编辑
                              </span>
                              <span
                                className='text-center flex-1 h-full'
                                onClick={e => this.handleGoodsDelete(goods)}
                              >
                                删除
                              </span>
                            </div>
                          </div>
                          <div className='font_12 mt-3 px-1'>
                            {/* 测试测试测试测试测试测试测试 */}
                            <div className='text-overflow'>{goods.name}</div>
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
                          className='flex flex-col goods_item w_80 ml-12 mb-12 cursor-pointer rounded'
                          key={play.id}
                        >
                          <div className='relative goods_item__hover'>
                            <img
                              src={play.cover_image}
                              alt=''
                              className='w_80 h_80 rounded '
                            />
                            <div className='absolute hidden justify-between font_12 w-full bottom-0 text-white bg-FF8462 opacity-60 edit'>
                              <span
                                className='text-center flex-1'
                                onClick={e =>this.handlePlaysEdit(play)}
                              >
                                编辑
                              </span>
                              <span
                                className='text-center flex-1'
                                onClick={e =>this.handlePlaysDelete(play)}
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
          visible={this.state.isModalVisible}
          closable={false}
          footer={<div>
            <button className='border border_r_3 font_12 py_2 px_10 mr_8' onClick={this.handleCancel}>取 消</button>
            <button className='border_r_3 font_12 py_2 px_10 bg-FF8462 text-white' onClick={this.handleOk}>确 认</button>
          </div>}
        >
          <div className='search_frame mb-3'>
            <label className='font_12'>名称：</label>
            <Input
              className='w__6_5 border_1'
              placeholder='请定义播放名称'
              value={this.state.goodsName}
              onChange={e => {this.setState({goodsName: e.target.value})}}
            />
          </div>
          <div className='goods_wrap overflow-hidden font_12'>
            <div className='goods_wrap_head flex items-center justify-between mb-1'>
              <div className='goods_image flex items-center w-2/5'>
                <input type='checkbox' id='goods' checked={this.state.checkedAll} onChange={this.handleCheckAll}/>
                <label htmlFor='goods' className='ml-1'>商品</label>
              </div>
              <div className='goods_name w_135 mx-4'>名称</div>
              <div className='goods_price flex-1 '>价格</div>
            </div>
            <div className='goods_item_h'>
              {
                this.state.goodsList.map((goods, index) => {
                  return(
                    <div className='flex items-center justify-between mt-2' key={goods.id}>
                      <div className='flex items-center w-2/5'>
                        <input type='checkbox' id='goods' onChange={e => {this.handleSingleCheck(index)}} checked={goods.checked} />
                        {
                          goods.image? (
                            <img className='w_h_30 rounded ml-1 overflow-hidden' alt='' src={goods.image[0]}/>
                          ):(
                            <video className='w_h_30 rounded ml-1 overflow-hidden' src={goods.video_url}/>
                          )
                        }
                      </div>
                      <div className='w_135 flex-none mx-4 text-overflow'>{goods.name}</div>
                      <div className='flex-1'>{goods.price}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({});
const mapStateToProps = (state) => ({
  userInfo: state,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoodsManage));
