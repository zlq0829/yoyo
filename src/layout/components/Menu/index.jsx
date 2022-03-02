import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'

class _Menu extends React.Component {
  // 一级
  renderMenuItem = ({key, Icon, title, image}) => {
    return(
      <Menu.Item icon={image? <img src={image} style={{width: '14px', height: '14px'}} alt=''/> : <Icon />} key={key}>
        <Link to={key}>{title}</Link>
      </Menu.Item>
    )
  }

  // 多级嵌套
  renderSubMenu = ({key, Icon, title, subs}) => {
    return (
      <Menu.SubMenu key={key} title={title} icon={<Icon />}>
        {
          subs && subs.map(item => {
            return item.subs && item.subs.length > 0? this.renderSubMenu(item) : this.renderMenuItem(item)
          })
        }
      </Menu.SubMenu>
    )
  }
  render() {
    return (
      <Menu
        mode='inline'
        theme='dark'
      >
        {
          this.props.menus && this.props.menus.map(item => {
            return item.subs && item.subs.length > 0? this.renderSubMenu(item) : this.renderMenuItem(item)
          })
        }
      </Menu>
    )
  }
}
export default _Menu
