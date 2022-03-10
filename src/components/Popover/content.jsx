import utils from '@/utils';
const { validate, type } = utils;

const content = (props) => {
  const { profile } = props;
  return (
    <div className='text-center'>
      <header className='py-2 cursor-default'>
        {validate.hidePhoneNum(
          type.toString(profile.profile.phone_num)
        )}
      </header>
      <footer
        className='py-1 border-t font_12 cursor-default'
        onClick={props.loginOut}
      >
        退 出
      </footer>
    </div>
  );
};
export default content;
