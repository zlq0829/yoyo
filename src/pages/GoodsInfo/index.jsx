import React from 'react';
import { Radio, Upload, Input, Table } from 'antd';
import {
  SyncOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  SoundOutlined,
  // CheckOutlined
} from '@ant-design/icons';
import './index.less';

class GoodsInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [], //  图片源
      columns: [
        {
          title: '序号',
          dataIndex: 'order',
        },
        {
          title: '介绍文案',
          dataIndex: 'introduce',
        },
        {
          title: '动作标签',
          dataIndex: 'actionLabel',
          render: ()=>(
            <>
            </>
          )
        },
        {
          title: '生成语音',
          dataIndex: 'voiceList',
        },
      ],
      data: [     // tabel数据
        {
          order: '1',
          introduce: 'John Brown',
          actionLabel: '',
          voiceList: 'New York No. 1 Lake Park',
        },
      ],
    };
  }


  // Upload回调
  handleChange = ({ fileList }) => this.setState({ fileList });

  data = (file) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    return {
      suffix: suffix,
      preffix: 'goodsImg',
    };
  };

  render() {
    // 上传按钮
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
              <ArrowLeftOutlined />
              <span className='ml-3'>编辑商品</span>
              <div className='font_16 mb-2 ml-1'>
                <SyncOutlined />
              </div>
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
                    fileList={this.state.fileList}
                    onChange={this.handleChange}
                  >
                    {this.state.fileList.length >= 10 ? null : uploadButton}
                  </Upload>
                </div>
              </div>
            </div>
            <div className='content_info mt-4'>
              <div className='goods_name flex items-center'>
                <span className='w_140 text-right mr-4'>商品名称</span>
                <Input style={{ width: '50%' }} placeholder='请输入商品名称' />
              </div>
              <div className='goods_price flex mt-4 mb-4'>
                <span className='w_140 text-right mr-4'>商品价格</span>
                <Input style={{ width: '50%' }} placeholder='请输入商品价格' />
              </div>
              <div className='goods_introduce flex'>
                <span className='w_140 text-right mr-4'>商品介绍</span>
                <div className='w-2/4 h_200 relative'>
                  <Input.TextArea style={{ height: '100%' }} placeholder='请输入商品介绍' />
                  <div className='absolute bottom-0 flex items-center py-1 px-2 border rounded-full _right_100 justify-center font_12 cursor-pointer'>
                    <SoundOutlined />
                    <span className=''>敏感词检测</span>
                  </div>
                </div>
              </div>
              <div className='ml_156 font_12'>介绍文案以句号为段落结束</div>
            </div>
          </div>
          <div className='tabel_voice mt-12'>
            < Table style={{ width: '80%'}} pagination={false} columns={this.state.columns} dataSource={this.state.data} className='text-center'/>
          </div>
          <div className='footer flex justify-center mt-20'>
            <button className='cancal_btn foonter_btn py-1 px-8 border rounded-full mr-8' >取消</button>
            <button className='save_btn foonter_btn py-1 px-8 border rounded-full bg-FF8462 border-color text-white'>保存</button>
          </div>
        </div>
      </div>
    );
  }
}
export default GoodsInfo;
