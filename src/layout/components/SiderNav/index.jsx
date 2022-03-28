import React from 'react'
import Menus from '../Menu'
import routes from '@/router'

class SiderNav extends React.Component {
  render() {
    return(
      <>
        <Menus menus={routes}/>
      </>
    )
  }
}
export default SiderNav
