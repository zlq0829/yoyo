/**
 * @description 登陆页面容器
 */
import { connect } from 'react-redux';
import Login from '@/pages/Login'
import ACTIONS from '@/actions'

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    handleAddProfile(profile) {
      // dispatch(ACTIONS.profileAction.addProfile(profile))
    }
  }
}

const LoginContainers = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default LoginContainers
