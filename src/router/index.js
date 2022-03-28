
import playIcon from '@/assets/ui/sidernav/icon-play.png'
import goodsIcon from '@/assets/ui/sidernav/icon-goods.png'
import systemIcon from '@/assets/ui/sidernav/icon-system.png'
const routes = [
  {
    title: '自动播放',
    image: playIcon,
    key: '/autoplay'
  },
  {
    title: '商品管理',
    image: goodsIcon,
    key: '/goodsmanage',
  },
  {
    title: '个人中心',
    image: systemIcon,
    key: '/profile',
  },
];
export default routes;
