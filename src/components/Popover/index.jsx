import { Popover } from 'antd';
import content from './content.jsx';
const _Popover = (props) => {
  const { profile, loginOut } = props

  return (
    <>
      <Popover title={null} content={content({profile, loginOut})}>
        <img
          style={{ width: '32px', height: '32px', borderRadius: '100%' }}
          src={profile.avatar}
          alt=''
        />
      </Popover>
    </>
  );
};
export default _Popover
