import React from 'react'
import Menus from '../Menu'
import routes from '@/router'

class SiderNav extends React.Component {
  render() {
    return(
      <div>
        <Menus menus={routes}/>
      </div>
    )
  }
}
export default SiderNav
