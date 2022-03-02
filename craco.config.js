/**
 * @description 修改脚手架的默认配置项
 */
const path = require('path');
const CracoLessPlugin = require('craco-less')
module.exports = {
  style: {
    // postcss 插件，添加前缀和tailwindcss库的使用
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  babel: {
    // babel配置项目
    plugins: [
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'true' }, 'antd'],
    ],
  },
  webpack: {
    // webapck配置
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx',],
  },
  plugins: [
    // 预解析插件
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // 修改组件的颜色，注意babel.plugins的style设为true，请参考ant组件库文档
            modifyVars: {
              'primary-color': '#FF8462',           // 修改ant组件的全局色
              'link-color': '#FF8462',              // 修改ant组件的链接色
              'border-color-base': '#F7B9A3',       // 修改ant组件的线框色
              'text-color': '#666666',              // 修改ant组件字体颜色
              'border-width-base': '2px',           // 修改ant组件的线框宽
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
}
