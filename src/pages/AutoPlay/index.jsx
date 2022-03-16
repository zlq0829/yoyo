import React from 'react';
import { connect } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Select, Empty, message } from 'antd';
import utils from '@/utils';
import API from '@/services';
import action from '@/actions';
import defaultBgImage from '@/assets/images/backgroundImg.jpg';
import yoyo from '@/assets/images/character_model_yoyo.png';
import './index.less';

const {type: { toString }} = utils
const { play: { stop, start} } = action
class AutoPlay extends React.Component {
  state = {
    // select组件options
    options: [],
    // 商品
    goodsList: [],
    // 横竖切换, 默认是竖屏 true
    reverse: true,
    // 下拉框默认选中第一条
    defaultValue: '',
    // 下拉框loading
    loading: false,
    // 播放状态
    isPlay: localStorage.getItem('playStatus') || false,
    // ws
    localServerUrl: process.env.REACT_APP_LOCAL_SERVER_URL
  }

  // 选中新的的播放商品 && 根据选中的id获取新的商品
  handleChange = (value) => {
    let good = this.state.options.find((good) => value === good.id);
    this.setState({ defaultValue: good.label });
    this.getGoodsList(value);
  }

  // 横竖屏切换
  handleReverse = () => {
    this.setState({ reverse: !this.state.reverse });
  }

  // 直播 || 关闭
  handleVideoProcess = async () => {
    // 阻止在没有选中商品的情况下播放
    if( this.state.goodsList === 0 ) {
      message.warning('请先选择商品！')
      return
    }

    if(this.props.playState) {
      this.disConnectVideoProcess()
      this.props.handlePlay(stop(false))
    } else {
      this.connectVideoProcess()
      this.props.handlePlay(start(true))
    }
  }

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
        goodsList: response.data,
      });
    }
  }

  // 通过 ws 连接视频处理服务器
  connectVideoProcess = () => {
    const { localServerWsClient: client } = window;
    const { localServerUrl, goodsList } = this.state
    const that = this

    let bg = `../build${defaultBgImage}`
    if(process.env.NODE_ENV !== 'development') {
      bg = `../app.asar.unpacked${defaultBgImage}`
    }

    // 背景图 和 清晰图
    const Initialize = 'start->' + toString(
      {
        bg,
        clarity: ' MEDIUM'
      }
    )

    if(client) {
      client.send(Initialize);
      this.sendGoodsToServe(client, goodsList)
    } else {
      const client = new W3CWebSocket(localServerUrl);

      // 用于指定连接失败后的回调函数
      client.onerror = (error)=>{
        message.info({
          icon: (<></>),
          top: 0,
          content: '服务连接失败，请检查网路！'
        })
      }

      // 用于指定连接成功后的回调函数y
      client.onopen = ()=>{
        message.success('连接本地视频服务成功');

        client.send(Initialize);
        this.sendGoodsToServe(client, goodsList)
        window.localServerWsClient = client;
      }

      // 用于指定连接关闭后的回调函数
      client.onclose = ()=>{
        that.setState({isPlay: false})
        window.localServerWsClient = null
      }
    }
  }

  // 断开视频处理服务器
  disConnectVideoProcess = () => {
    const { localServerWsClient: client } = window
    if(client) {
      client.send('stop->{}')
    }
  }

  // 连接要直播的内容和信息
  sendGoodsToServe = (client, goodsList) => {
    let data = goodsList.map((e)=>({
      action_tag_list: e.action_tag_list,
      word_list: e.word_list || null,
      video_url: e.video_url || null,
      speed_list: e.speed_list,
      wav_url_list: e.wav_url_list,
      image: e.image,
      is_landscape: false,
      resize: false
    }))
    client.send('sequence->' + toString(data))
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
    const { playState } = this.props
    const { options, goodsList, reverse, defaultValue, loading, isPlay } = this.state
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

          </div>
          <div className='goods relative box-border pr-4 goods_h'>
            {goodsList.length > 0 ? (
              <div className='flex flex-wrap'>
                {goodsList.map((good) => {
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
            <div className='absolute top_240 -left_40 w__7 overflow-hidden'>
              <img src={yoyo}/>
            </div>
            {/* <div
              className='font_14 color_FF8462 bg-001529 w_50 text-center absolute right-0 top-2 rounded-l cursor-pointer'
              onClick={this.handleReverse}
            >
              {reverse ? '横屏' : '竖屏'}
            </div> */}
          </div>
          <div className='play_contron h_80 rounded bg-white mt-4 flex justify-center items-center'>
            <button className='bg-FF8462 px-6 py-2 rounded-full text-white' onClick={this.handleVideoProcess}>
              {
                !playState? (<span>开始直播</span>):(<span>关闭直播</span>)
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

const mapStateToProps = (state) => ({
  playState: state.play
});
const mapDispatchToProps = (dispatch) => ({
  handlePlay: (actions)=>{
    dispatch(actions)
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoPlay);
