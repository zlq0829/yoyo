import React from 'react';
import './index.less';

class PlayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {

  }
  render() {
    return (
      <div className='h-full overflow-hidden play-info'>
        <div className='flex-1 bg-white play-h-full p-6'></div>
      </div>
    )
  }
}
export default PlayInfo
