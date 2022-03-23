import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Select, Empty, message } from 'antd';
import utils from '@/utils';
import API from '@/services';
import action from '@/actions';
import defaultBgImage from '@/assets/images/backgroundImg.jpg';
import yoyo from '@/assets/images/character_model_yoyo.png';
import './index.less';

const {
  type: { toString },
} = utils;
const {
  play: { stop, start },
} = action;
const AutoPlay = (props) => {
  const [options, setOptions] = useState([]);
  const [goodsList, setGoodsList] = useState([]);
  const [reverse, setReverse] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [goodsUrl, setGoodsUrl] = useState('');
  const [goodsWav, setGoodsWav] = useState('');
  const localServerUrl = process.env.REACT_APP_LOCAL_SERVER_URL;
  const { playState, handlePlay } = props;

  // 获取商品列表
  const getGoodsList = async (id) => {
    let response = null;
    let data = {
      play_list_id: id,
      size: 999,
    };

    // 设loading加载效果
    setLoading(true);
    try {
      response = await API.autoPlayApi.getGoodsList(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return false;
    }

    if (response && response.code === 200 && response.data.length > 0) {
      console.log(response.data)
      setGoodsList(response.data);
    }
  };

  // 获取播放内容
  const getPlaylist = async () => {
    let response = null;
    try {
      response = await API.autoPlayApi.getPlaylist();
    } catch (error) {
      return false;
    }

    if (response && response.code === 200 && response.data.content.length > 0) {
      response.data.content.forEach((option) => {
        option.label = option.name;
        option.value = option.id;
      });
      setOptions(response.data.content);
      setValue(response.data.content[0].label);
      // 设定初始值
      getGoodsList(response.data.content[0].id);
    }
  };

  // 获取商品的位置
  const getGoodsPositions = () => {
    const o = document.getElementsByClassName('goods-img')[0];
    console.log(o.offsetLeft, o.offsetTop, o.offsetHeight, o.offsetWidth);
  };

  // 通过 ws 连接视频处理服务器
  const connectVideoProcess = () => {
    const { localServerWsClient: client } = window;

    // 背景图
    let bg = `../build${defaultBgImage}`;
    if (process.env.NODE_ENV !== 'development') {
      bg = `../app.asar.unpacked${defaultBgImage}`;
    }

    // 背景图 和 清晰图
    const Initialize = 'start->' + toString({ bg, clarity: ' MEDIUM' });

    if (client) {
      client.send(Initialize);
      sendGoodsToServe(client, goodsList);
    } else {
      const client = new W3CWebSocket(localServerUrl);

      // 用于指定连接失败后的回调函数
      client.onerror = (error) => {
        message.info({
          icon: <></>,
          top: 0,
          content: '服务连接失败，请检查网路！',
        });
      };

      // 用于指定连接成功后的回调函数y
      client.onopen = () => {
        client.send(Initialize);
        sendGoodsToServe(client, goodsList);
        window.localServerWsClient = client;
      };

      // 用于指定连接关闭后的回调函数
      client.onclose = () => {
        handlePlay(stop());
        window.localServerWsClient = null;
      };
    }
  };

  // 断开视频处理服务器
  const disConnectVideoProcess = () => {
    const { localServerWsClient: client } = window;
    if (client) {
      client.send('stop->{}');
    }
  };

  // 连接要直播的内容和信息
  const sendGoodsToServe = (client, goodsList) => {
    let data = goodsList.map((e) => ({
      action_tag_list: e.action_tag_list,
      word_list: e.word_list || null,
      video_url: e.video_url || null,
      speed_list: e.speed_list,
      wav_url_list: e.wav_url_list,
      image: e.image,
      is_landscape: reverse,
      resize: false,
    }));
    client.send('sequence->' + toString(data));
  };

  // 选中新的的播放商品 && 根据选中的id获取新的商品
  const handleChange = (value) => {
    let good = options.find((opt) => value === opt.id);
    setValue(good.label);
    getGoodsList(value);
  };

  // 直播 || 关闭
  const handleVideoProcess = async () => {
    if (playState) {
      // 销毁进程
      disConnectVideoProcess();
      handlePlay(stop());
    } else {
      getGoodsPositions();
      connectVideoProcess();
      handlePlay(start());
    }
  };

  // 商品拖动
  const handleDragStart = (e) => {
    // 避免拖动出现异常背影
    document.getElementsByTagName('body')[0].ondragstart = function () {
      window.event.returnValue = false;
      return false;
    };

    const c = document.getElementsByClassName('center')[0];
    const o = document.getElementsByClassName('goods-img')[0];
    // 计算
    const disX = e.clientX - o.offsetLeft;
    const disY = e.clientY - o.offsetTop;

    document.onmousemove = function (e) {
      // 计算移动对象在限定的范围内的位置
      let left = e.clientX - disX;
      let top = e.clientY - disY;

      // 左侧限制
      left <= 0 && (left = 0);
      top <= 0 && (top = 0);

      // 右侧限制
      left >= c.offsetWidth - o.offsetWidth &&
        (left = c.offsetWidth - o.offsetWidth);

      top >= c.offsetHeight - o.offsetHeight &&
        (top = c.offsetHeight - o.offsetHeight);

      o.style.left = left + 'px';
      o.style.top = top + 'px';
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmousedown = null;
    };
  };

  // 商品缩放
  const handleScale = () => {
    const o = document.getElementsByClassName('goods-img')[0];
    const c = document.getElementsByClassName('center')[0];
    let c_width = c.offsetWidth
    if(reverse) {
      c_width = c.offsetHeight
    }
    o.onmousewheel = function (e) {
      //获取图片的宽高
      const offsetWidth = o.offsetWidth;

      //获取图片距离body左侧和上面的距离
      const left = parseFloat(o.offsetLeft);
      const top = parseFloat(o.offsetTop);

      //获取定点的位置（鼠标在图片上的位置）
      const disX = e.clientX - e.offsetLeft;
      const disY = e.clientY - e.offsetTop;

      //wheelDelta的值为正（120.240...）则是鼠标向上；为负（-120，-240）则是向下
      if (e.wheelDelta > 0) {
        const width = offsetWidth + offsetWidth * 0.05;
        console.log()
        if(c_width - width <= 0) {
          o.style.width = c_width + 'px';
          o.style.height = c_width + 'px';
        } else {
          o.style.width = offsetWidth + offsetWidth * 0.05 + 'px';
          o.style.height = offsetWidth + offsetWidth * 0.05 + 'px';
          o.style.left = left + disX * 0.05 + 'px';
          o.style.top = top + disY * 0.05 + 'px';
        }

        //当商品的right 或者 left 不为 0时,放大到父盒子的边界即停止
        if(!reverse) {
          if (o.offsetLeft && width + o.offsetLeft >= c_width) {
            o.style.width = c_width - o.offsetLeft + 'px';
            o.style.height = c_width - o.offsetLeft + 'px';
          }
        } else {
          if(o.offsetTop && width + o.offsetTop >= c_width) {
            o.style.width = c_width - o.offsetTop + 'px';
            o.style.height = c_width - o.offsetTop + 'px';
          }
        }

      } else {
        o.style.width = offsetWidth - offsetWidth * 0.05 + 'px';
        o.style.height = offsetWidth - offsetWidth * 0.05 + 'px';
        o.style.left = left + disX * 0.05 + 'px';
        o.style.top = top + disY * 0.05 + 'px';

      }
    };
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  useEffect(() =>{
    handleScale();
  },[reverse])

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
            value={value}
            className='rounded-full flex-1 site-select'
            loading={loading}
            placeholder='请选择'
            options={options}
            onChange={handleChange}
          />
        </div>
        <div className='goods relative box-border pr-4 goods_h'>
          {goodsList.length > 0 ? (
            <div className='flex flex-wrap'>
              {goodsList.map((good) => {
                return (
                  <div
                    className='flex flex-col goods_item  w_80 ml-4 mb-4'
                    key={good.id}
                  >
                    {good.image?.length ? (
                      <div
                        className='h_80 cursor-pointer rounded overflow-hidden'
                        onClick={() => {
                          setGoodsUrl(good.image && good.image[0]);
                        }}
                      >
                        <img src={good.image && good.image[0]} alt='' className='rounded' />
                      </div>
                    ) : (
                      <div
                        className='h_80 cursor-pointer rounded overflow-hidden'
                        onClick={() => {
                          setGoodsWav(good.video_url);
                        }}
                      >
                        <video
                          src={good.video_url}
                          alt=''
                          className='rounded w-full h-full object-fit'
                        />
                      </div>
                    )}
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
      <div className='m_l_r_24 w_505 flex-1 box-border flex flex-col'>
        <div className={['rounded relative flex-1 bg-white'].join(' ')}>
          {!reverse ? (
            <div className='w-full h-full relative center'>
              <div className='play_window h-full rounded' />

              <div className='absolute bottom-0  w_33vh overflow-hidden'>
                <img src={yoyo} alt='' />
              </div>

              <div
                className='absolute w_20vh h_20vh overflow-hidden goods-img rounded left_505-20 top_20vh'
                onDragStart={handleDragStart}
              >
                {goodsUrl && (
                  <img src={goodsUrl} alt=''/>
                )}
              </div>
            </div>
          ) : (
            <div className='w-full h-full flex flex-col justify-center relative '>
              <div
                className='w-full h_284 play_window relative center'
                style={{ backgroundSize: '100%, 100%' }}
              >
                <div className='absolute bottom-0 left-10 w_100 overflow-hidden'>
                  <img src={yoyo} alt='' className='w-full h-full' />
                </div>

                <div
                  className='absolute rounded goods-img overflow-hidden right-36 top-4 h_13vh w_13vh bg-black'
                  onDragStart={handleDragStart}
                >
                  <img src={yoyo} alt='' className='w-full h-full' />
                </div>
              </div>
            </div>
          )}




          <div
            className='font_12 color_FF8462 px-1 bg-001529 absolute right-0 top-2 rounded-l cursor-pointer'
            onClick={() => { setReverse((reverse) => !reverse)}}
          >
            {reverse ? '横屏' : '竖屏'}
          </div>
        </div>
        <div className='play_contron h_80 rounded bg-white mt-4 flex items-center justify-center px-4 box-border'>
          <button
            className='bg-FF8462 px-6 py-2 rounded-full text-white'
            onClick={handleVideoProcess}
          >
            {!playState ? <span>开始直播</span> : <span>关闭直播</span>}
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

const mapStateToProps = (state) => ({
  playState: state.play,
});
const mapDispatchToProps = (dispatch) => ({
  handlePlay: (actions) => {
    dispatch(actions);
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(AutoPlay);
