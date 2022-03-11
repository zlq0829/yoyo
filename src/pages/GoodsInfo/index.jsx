import React from 'react';
import { Radio, Upload, Input, Table, Select, message } from 'antd';
import {
  SyncOutlined,
  PlusOutlined,
  UploadOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import API from '@/services';
import './index.less';

class GoodsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 图片
      images: [],
      // tabel数据头
      columns: [
        {
          title: '序号',
          dataIndex: 'order',
        },
        {
          title: '介绍文案',
          dataIndex: 'introduce',
          render: (text) => {
            return (
              <div className='w-40 text-overflow-3 text-left m-auto'>
                {text}
              </div>
            );
          },
        },
        {
          title: '动作标签',
          dataIndex: 'label',
          render: (defaultLabel) => {
            return (
              <div className='w-full'>
                <Select
                  value={defaultLabel}
                  options={[
                    { label: '开场', value: '开场' },
                    { label: '自然', value: '自然' },
                    { label: '赞美', value: '赞美' },
                  ]}
                ></Select>
              </div>
            );
          },
        },
        {
          title: '生成语音',
          dataIndex: 'voice',
          render: (src) => {
            return (
              <div className='w-full'>
                <audio controls src={src} className='m-auto'>
                  您的浏览器不支持 audio 标签。
                </audio>
              </div>
            );
          },
        },
        {
          title: '语音调节',
          dataIndex: 'speed',
          render: (defaultSpeed) => {
            return (
              <div className='w-full'>
                <Select
                  value={defaultSpeed}
                  options={[
                    { label: '0.5倍数', value: '0.5' },
                    { label: '0.75倍数', value: '0.75' },
                    { label: '1倍数', value: '1' },
                    { label: '1.25倍数', value: '1.25' },
                    { label: '1.5倍数', value: '1.5' },
                    { label: '1.75倍数', value: '1.75' },
                    { label: '2倍数', value: '2' },
                  ]}
                ></Select>
              </div>
            );
          },
        },
        {
          title: '语音替换',
          dataIndex: 'other',
          render: () => {
            return (
              <div className='w-full flex items-center justify-center'>
                <button
                  className='py-1 px-2 border rounded flex items-center mr-4'
                  onClick={(e) => this.handleUploadVioce()}
                >
                  <UploadOutlined />
                  <span>上传</span>
                </button>
                <button
                  className='py-1 px-2 border rounded flex items-center'
                  onClick={(e) => this.handleVioceRecover()}
                >
                  <UndoOutlined />
                  <span>复原</span>
                </button>
              </div>
            );
          },
        },
      ],
      // tabel数据
      dataSource: [],
      // 商品名称
      goodsName: '',
      // 商品价格
      goodsPrice: '',
      // 商品介绍
      introduce: '',
      // 路由参数
      routerProps: {},
    };
  }

  // Upload回调
  handleChange = ({ fileList }) => {
    const { images } = this.state;
    fileList.forEach((e) => {
      if (e?.response && e.response && !images.includes(e.response.data)) {
        this.state.images.push(e.response.data);
      }
    });
    this.setState({ images: this.state.images });
  };

  // 添加商品
  handleAddGoods = async () => {
    const { images, introduce, goodsName, goodsPrice } = this.state;
    if (images.length === 0 || !introduce || !goodsName || !goodsPrice) {
      message.warning('请添加完整的商品信息！');
      return false;
    }

    let response = null;
    const data = {
      image: images,
      introduce,
      name: goodsName,
      price: goodsPrice,
    };
    try {
      response = await API.goodsManageApi.addGoods(data);
    } catch (error) {
      message.error('添加失败');
      return false;
    }
    if (response && response.code === 200 && response.data) {
      message.success('添加成功，等待语音生成');
      let timeOut = setTimeout(() => {
        this.props.history.goBack();
        clearTimeout(timeOut);
      }, 2000);
      //
    }
  };

  //  参数
  data = (file) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    return {
      suffix: suffix,
      preffix: 'goodsImg',
    };
  };

  // 音频上传
  handleUploadVioce = (e) => {};

  // 音频复原
  handleVioceRecover = (e) => {};

  async componentDidMount() {
    if(this.props.location.query) {
      const { word_list: introduce, action_tag_list: label, wav_url_list: wavs, speed_list: speeds } = this.props.location.query
      const dataSource = []
      label.forEach((e, i) => {
        dataSource.push({
          key: i,
          order: i,
          introduce: introduce[i],
          label: label[i],
          voice: wavs[i],
          speed: speeds[i] + '倍数'
        })
      })
      this.setState({dataSource})
    }
  }

  render() {
    const {
      images,
      columns,
      dataSource,
      goodsName,
      goodsPrice,
      introduce,
    } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    return (
      <div className='h-full overflow-hidden goodsinfo'>
        <div className='flex-1 bg-white goods_h-full p-6'>
          <div className='flex head items-center mb-4'>
            <div className='font_20 flex items-center text-black font-semibold w_140'>
              <span className='ml-3'>编辑商品</span>
            </div>
            {/* <div className='ml-8'>语音合成完成的标记</div> */}
          </div>
          <div className='content'>
            <div className='content_upload flex'>
              <span className='w_140 text-right mr-4'>商品展示</span>
              <div className='upload-area'>
                <div className='upload_type mb-2'>
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>上传图片</Radio>
                    {/* <Radio value={2}>上传视频</Radio> */}
                  </Radio.Group>
                </div>
                <div className='upload'>
                  <Upload
                    action={`${process.env.REACT_APP_API}/api/common/upload`}
                    listType='picture-card'
                    multiple={true}
                    onChange={this.handleChange}
                  >
                    {images.length >= 8 ? null : uploadButton}
                  </Upload>
                </div>
              </div>
            </div>
            <div className='content_info mt-4'>
              <div className='goods_name flex items-center'>
                <span className='w_140 text-right mr-4'>商品名称</span>
                <Input
                  style={{ width: '50%' }}
                  placeholder='请输入商品名称'
                  value={goodsName}
                  onChange={(e) => this.setState({ goodsName: e.target.value })}
                />
              </div>
              <div className='goods_price flex mb-6 mt-6'>
                <span className='w_140 text-right mr-4'>商品价格</span>
                <Input
                  style={{ width: '50%' }}
                  placeholder='请输入商品价格'
                  value={goodsPrice}
                  onChange={(e) =>
                    this.setState({ goodsPrice: e.target.value })
                  }
                />
              </div>
              <div className='goods_introduce flex'>
                <span className='w_140 text-right mr-4'>商品介绍</span>
                <div className='w-2/4 h_200 relative'>
                  <Input.TextArea
                    style={{ height: '100%', resize: 'none' }}
                    placeholder='请输入商品介绍'
                    value={introduce}
                    onChange={(e) =>
                      this.setState({ introduce: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='ml_156 font_12'>介绍文案以句号为段落结束</div>
            </div>
          </div>
          <div className='tabel_voice mt-12 ml-3'>
            {
              <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                className='text-center'
              />
            }
          </div>
          <div className='footer flex justify-center mt-20'>
            <button
              className='cancal_btn foonter_btn py-1 px-8 border rounded-full mr-8'
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              取消
            </button>
            <button
              className='save_btn foonter_btn py-1 px-8 border rounded-full bg-FF8462 border-color text-white'
              onClick={this.handleAddGoods}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default GoodsInfo;
