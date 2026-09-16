export interface PromoBannerData {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonColor: string;
  buttonBg: string;
  image: string;
  iconName: string;
  iconColor: string;
  link: string;
}

export const PROMO_BANNERS: PromoBannerData[] = [
  {
    id: 'daily-reward',
    title: 'THỬ THÁCH MỖI NGÀY',
    subtitle: 'NHẬN QUÀ CỰC ĐÃ!',
    buttonText: 'Xem ngay',
    buttonColor: '#000000',
    buttonBg: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
    image: '/images/promos/daily-reward.svg',
    iconName: 'Trophy',
    iconColor: '#facc15',
    link: '#daily-challenge'
  },
  {
    id: 'multiplayer',
    title: 'CHƠI GAME CÙNG BẠN',
    subtitle: 'VUI GẤP ĐÔI!',
    buttonText: 'Mời bạn ngay',
    buttonColor: '#ffffff',
    buttonBg: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    image: '/images/promos/play-with-friends.svg',
    iconName: 'Gamepad2',
    iconColor: '#38bdf8',
    link: '#multiplayer-invite'
  },
  {
    id: 'leaderboard',
    title: 'BẢNG XẾP HẠNG',
    subtitle: 'GAME THỦ XUẤT SẮC',
    buttonText: 'Xem bảng xếp hạng',
    buttonColor: '#000000',
    buttonBg: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
    image: '/images/promos/leaderboard.svg',
    iconName: 'Crown',
    iconColor: '#facc15',
    link: '#leaderboard'
  }
];
