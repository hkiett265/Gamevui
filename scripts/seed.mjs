import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { id: 'all', name: 'Tất cả game', iconName: 'Gamepad2', sortOrder: 1 },
  { id: 'action', name: 'Hành động', iconName: 'Swords', sortOrder: 2 },
  { id: 'shooter', name: 'Bắn súng', iconName: 'Crosshair', sortOrder: 3 },
  { id: 'adventure', name: 'Phiêu lưu', iconName: 'Compass', sortOrder: 4 },
  { id: 'racing', name: 'Đua xe', iconName: 'Car', sortOrder: 5 },
  { id: 'sports', name: 'Thể thao', iconName: 'Trophy', sortOrder: 6 },
  { id: 'puzzle', name: 'Giải đố', iconName: 'Puzzle', sortOrder: 7 },
  { id: 'strategy', name: 'Chiến thuật', iconName: 'Shield', sortOrder: 8 },
  { id: 'fashion', name: 'Thời trang', iconName: 'Sparkles', sortOrder: 9 },
  { id: 'multiplayer', name: '2 người chơi', iconName: 'Users', sortOrder: 10 },
  { id: 'hot', name: 'Game hot', iconName: 'Flame', sortOrder: 11 },
  { id: 'new', name: 'Game mới', iconName: 'Sparkle', sortOrder: 12 }
];

const QUICK_CATEGORIES = [
  {
    id: 'hot',
    label: 'Game hot',
    iconName: 'Flame',
    color: '#ef4444',
    bgGlow: 'rgba(239, 68, 68, 0.2)',
    actionType: 'filter',
    filterValue: 'hot',
    sortOrder: 1
  },
  {
    id: 'new',
    label: 'Mới nhất',
    iconName: 'Sparkles',
    color: '#06b6d4',
    bgGlow: 'rgba(6, 182, 212, 0.2)',
    actionType: 'filter',
    filterValue: 'new',
    sortOrder: 2
  },
  {
    id: 'popular',
    label: 'Được yêu thích',
    iconName: 'Trophy',
    color: '#f59e0b',
    bgGlow: 'rgba(245, 158, 11, 0.2)',
    actionType: 'tag',
    filterValue: 'top',
    sortOrder: 3
  },
  {
    id: 'multiplayer',
    label: '2 người chơi',
    iconName: 'Users',
    color: '#a855f7',
    bgGlow: 'rgba(168, 85, 247, 0.2)',
    actionType: 'filter',
    filterValue: 'multiplayer',
    sortOrder: 4
  },
  {
    id: 'mobile',
    label: 'Chơi trên mobile',
    iconName: 'Smartphone',
    color: '#0ea5e9',
    bgGlow: 'rgba(14, 165, 233, 0.2)',
    actionType: 'tag',
    filterValue: 'mobile',
    sortOrder: 5
  },
  {
    id: '3d',
    label: 'Game 3D',
    iconName: 'Gem',
    color: '#3b82f6',
    bgGlow: 'rgba(59, 130, 246, 0.2)',
    actionType: 'tag',
    filterValue: '3d',
    sortOrder: 6
  },
  {
    id: 'vietnam',
    label: 'Game Việt',
    iconName: 'Star',
    color: '#eab308',
    bgGlow: 'rgba(234, 179, 8, 0.2)',
    actionType: 'tag',
    filterValue: 'vietnam',
    sortOrder: 7
  },
  {
    id: 'random',
    label: 'Game ngẫu nhiên',
    iconName: 'Dices',
    color: '#ec4899',
    bgGlow: 'rgba(236, 72, 153, 0.2)',
    actionType: 'random',
    filterValue: null,
    sortOrder: 8
  }
];

const HERO_SLIDES = [
  {
    id: 'chicken-mayhem-3d',
    gameSlug: 'ban-ga-3d',
    title: 'BẮN GÀ 3D',
    subtitle: 'CHICKEN MAYHEM',
    tagline: 'Ngắm chuẩn - Bắn đã tay - Thử ngay!',
    badge: 'GAME HOT NHẤT',
    image: '/images/banners/ban-ga-3d-hero.jpg',
    ctaText: 'Chơi ngay',
    secondaryCtaText: 'Xem chi tiết',
    woodenSignLines: JSON.stringify([
      'GÀ CHẠY',
      'GÀ BAY',
      'GÀ SIÊU QUẬY',
      'BẠN DÁM THỬ?'
    ]),
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'nitro-velocity-racing',
    gameSlug: 'dua-xe-sieu-toc',
    title: 'ĐUA XE SIÊU TỐC',
    subtitle: 'NITRO VELOCITY',
    tagline: 'Bứt phá giới hạn - Chinh phục mọi khúc cua!',
    badge: 'TỐC ĐỘ CỰC ĐỈNH',
    image: '/images/games/dua-xe-sieu-toc.jpg',
    ctaText: 'Chơi ngay',
    secondaryCtaText: 'Xem chi tiết',
    woodenSignLines: JSON.stringify([
      'NITRO BOOST',
      'DRIFT ĐỈNH CAO',
      'ĐUA TOP 1',
      'SẴN SÀNG CHƯA?'
    ]),
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'zombie-blast-survival',
    gameSlug: 'zombies-survival',
    title: 'ZOMBIES SURVIVAL',
    subtitle: 'APOCALYPSE NIGHT',
    tagline: 'Sinh tồn giữa vòng vây - Bắn hạ thây ma!',
    badge: 'HÀNH ĐỘNG KỊCH TÍNH',
    image: '/images/games/zombies-survival.jpg',
    ctaText: 'Chơi ngay',
    secondaryCtaText: 'Xem chi tiết',
    woodenSignLines: JSON.stringify([
      'SÚNG HẠNG NẶNG',
      'THÂY MA ĐÔNG ĐÚC',
      'SINH TỒN 60S',
      'CHIẾN ĐẾN CÙNG!'
    ]),
    sortOrder: 3,
    isActive: true
  }
];

const PROMO_BANNERS = [
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
    link: '#daily-challenge',
    sortOrder: 1
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
    link: '#multiplayer-invite',
    sortOrder: 2
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
    link: '#leaderboard',
    sortOrder: 3
  }
];

const GAMES = [
  {
    id: 'chicken-mayhem',
    slug: 'ban-ga-3d',
    title: 'Bắn Gà 3D',
    subtitle: 'Chicken Mayhem 3D',
    description: 'Trò chơi bắn gà 3D phong cách hoạt hình cực vui nhộn! Bạn sẽ vào vai tay săn cự phách tại nông trại vui vẻ, ngắm bắn chuẩn xác những chú gà siêu quậy đang chạy nhảy, bay lượn và né tránh đạn.',
    instructions: 'Sử dụng chuột để ngắm, bấm chuột trái để bắn. Bấm R để nạp đạn nhanh. Đạt chuỗi Combo để nhân điểm số và kích hoạt chế độ Cơn Bão Lông Vũ!',
    thumbnail: '/images/games/ban-ga-3d.jpg',
    banner: '/images/banners/ban-ga-3d-hero.jpg',
    categoryName: 'Hành động',
    categoryId: 'action',
    tags: JSON.stringify(['3D', 'Bắn súng', 'Hành động', 'Hot', 'Vui nhộn', 'vietnam']),
    badge: 'HOT',
    isHot: true,
    isNew: false,
    isFeatured: true,
    available: true,
    gameUrl: '/play/ban-ga-3d',
    rating: 4.9,
    playCount: '152.4K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'super-speed-racing',
    slug: 'dua-xe-sieu-toc',
    title: 'Đua Xe Siêu Tốc',
    subtitle: 'Nitro Velocity Arcade',
    description: 'Trải nghiệm cảm giác lái những siêu xe triệu đô phóng như bay trên xa lộ ánh đèn neon rực rỡ. Kích hoạt bình Nitro cực đại để bứt tốc vượt mặt mọi đối thủ.',
    instructions: 'Dùng phím mũi tên hoặc WASD để đánh lái và tăng tốc. Bấm Space để drift qua khúc cua hẹp.',
    thumbnail: '/images/games/dua-xe-sieu-toc.jpg',
    categoryName: 'Đua xe',
    categoryId: 'racing',
    tags: JSON.stringify(['Đua xe', 'Tốc độ', '3D', 'Hot', 'mobile']),
    badge: 'HOT',
    isHot: true,
    isNew: false,
    isFeatured: true,
    available: true,
    gameUrl: '/play/dua-xe-sieu-toc',
    rating: 4.8,
    playCount: '98.2K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'stickman-battle',
    slug: 'stickman-dai-chien',
    title: 'Stickman Đại Chiến',
    subtitle: 'Stickman Shadow Combat',
    description: 'Cuộc chạm trán nảy lửa giữa các võ sư người que huyền thoại. Kết hợp những combo quyền cước võ thuật đỉnh cao và nội công chấn động giang hồ.',
    instructions: 'Phím A, D để di chuyển, J để tấn công, K để nhảy, L để lướt né đòn.',
    thumbnail: '/images/games/stickman-dai-chien.jpg',
    categoryName: 'Hành động',
    categoryId: 'action',
    tags: JSON.stringify(['Hành động', 'Đối kháng', '2 người chơi', 'Hot']),
    badge: 'HOT',
    isHot: true,
    isNew: false,
    isFeatured: true,
    available: true,
    gameUrl: '/play/stickman-dai-chien',
    rating: 4.7,
    playCount: '87.6K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'minecraft-online',
    slug: 'the-gioi-khoi-vuong',
    title: 'Minecraft Online',
    subtitle: 'Thế Giới Khối Vuông Voxel',
    description: 'Khám phá thế giới vô tận được tạo nên từ những khối lập phương kỳ diệu. Tự do khai thác tài nguyên, xây dựng lâu đài mơ ước và sinh tồn trước bóng đêm.',
    instructions: 'WASD để di chuyển, Chuột trái để đào khối, Chuột phải để đặt khối, Phím E mở hòm đồ.',
    thumbnail: '/images/games/the-gioi-khoi-vuong.jpg',
    categoryName: 'Phiêu lưu',
    categoryId: 'adventure',
    tags: JSON.stringify(['Phiêu lưu', 'Xây dựng', '3D', 'Hot', 'New']),
    badge: 'NEW',
    isHot: true,
    isNew: true,
    isFeatured: true,
    available: true,
    gameUrl: '/play/the-gioi-khoi-vuong',
    rating: 4.9,
    playCount: '135.8K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'zombie-survival',
    slug: 'zombies-survival',
    title: 'Zombies Survival',
    subtitle: 'Zombie Blast Apocalypse',
    description: 'Thành phố đã bị xâm chiếm bởi làn sóng thây ma đông đảo và hung hãn. Thu thập các loại vũ khí uy lực và trụ vững qua từng đợt tấn công nguy hiểm.',
    instructions: 'WASD di chuyển, Chuột ngắm bắn, Phím 1-4 đổi vũ khí, Phím R nạp đạn.',
    thumbnail: '/images/games/zombies-survival.jpg',
    categoryName: 'Bắn súng',
    categoryId: 'shooter',
    tags: JSON.stringify(['Bắn súng', 'Sinh tồn', 'Hành động', 'Hot']),
    badge: null,
    isHot: true,
    isNew: false,
    isFeatured: true,
    available: true,
    gameUrl: '/play/zombies-survival',
    rating: 4.6,
    playCount: '76.1K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'football-strike',
    slug: 'football-strike',
    title: 'Football Strike',
    subtitle: 'Stadium Rush Soccer',
    description: 'Bước vào sân vận động rực lửa trước hàng chục vạn khán giả reo hò. Thực hiện những cú sút phạt hình quả chuối xoáy bóng hiểm hóc vào góc chữ A khung thành.',
    instructions: 'Vuốt hoặc kéo chuột để tạo đường cong và lực sút bóng vượt qua hàng rào thủ môn.',
    thumbnail: '/images/games/football-strike.jpg',
    categoryName: 'Thể thao',
    categoryId: 'sports',
    tags: JSON.stringify(['Thể thao', 'Bóng đá', 'Hot', 'mobile']),
    badge: null,
    isHot: true,
    isNew: false,
    isFeatured: true,
    available: true,
    gameUrl: '/play/football-strike',
    rating: 4.8,
    playCount: '112.5K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'cooking-with-kiet',
    slug: 'nau-an-cung-kiet',
    title: 'Nấu Ăn Cùng Kiệt',
    subtitle: 'Sweet Chibi Baker',
    description: 'Hóa thân thành đầu bếp bánh ngọt tài năng! Tự tay nhào bột, nướng bánh bông lan thơm phức và trang trí lớp kem dâu tây hảo hạng cho bữa tiệc sinh nhật.',
    instructions: 'Bấm chuột chọn nguyên liệu, kéo thả để trang trí bánh theo công thức yêu cầu.',
    thumbnail: '/images/games/nau-an-cung-kiet.jpg',
    categoryName: 'Giải đố',
    categoryId: 'puzzle',
    tags: JSON.stringify(['Giải trí', 'Nấu ăn', 'Dễ thương', 'New', 'vietnam']),
    badge: 'NEW',
    isHot: false,
    isNew: true,
    isFeatured: false,
    available: true,
    gameUrl: '/play/nau-an-cung-kiet',
    rating: 4.7,
    playCount: '64.3K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'ocean-fishing',
    slug: 'ban-ca-dai-duong',
    title: 'Bắn Cá Đại Dương',
    subtitle: 'Ocean Arcade Bubble Reef',
    description: 'Khám phá rạn san hô lung linh dưới đáy đại dương cùng đàn cá hề Nemo đáng yêu. Sử dụng đại bác năng lượng để săn những loài sinh vật biển quý hiếm.',
    instructions: 'Di chuyển chuột để đổi góc bắn pháo lưới, bấm phím Cách để tăng cấp độ pháo.',
    thumbnail: '/images/games/ban-ca-dai-duong.jpg',
    categoryName: 'Giải đố',
    categoryId: 'puzzle',
    tags: JSON.stringify(['Giải đố', 'Bắn cá', 'Đại dương', 'New']),
    badge: 'NEW',
    isHot: false,
    isNew: true,
    isFeatured: false,
    available: true,
    gameUrl: '/play/ban-ca-dai-duong',
    rating: 4.6,
    playCount: '58.9K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'smart-puzzle',
    slug: 'xep-hinh-thong-minh',
    title: 'Xếp Hình Thông Minh',
    subtitle: 'Block Snap Brain Puzzle',
    description: 'Thử thách trí thông minh và tư duy không gian với các khối xếp hình 3D rực rỡ sắc màu. Xếp các hàng gạch kín để tạo hiệu ứng nổ tung lấp lánh.',
    instructions: 'Kéo các khối gạch vào lưới 8x8. Hoàn thành hàng hoặc cột để xóa gạch và nhận điểm thưởng combo.',
    thumbnail: '/images/games/xep-hinh-thong-minh.jpg',
    categoryName: 'Giải đố',
    categoryId: 'puzzle',
    tags: JSON.stringify(['Giải đố', 'Trí tuệ', 'Xếp gạch', 'New']),
    badge: 'NEW',
    isHot: false,
    isNew: true,
    isFeatured: false,
    available: true,
    gameUrl: '/play/xep-hinh-thong-minh',
    rating: 4.8,
    playCount: '92.1K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'princess-fashion',
    slug: 'thoi-trang-cong-chua',
    title: 'Thời Trang Công Chúa',
    subtitle: 'Princess Dream Glitter',
    description: 'Thiết kế những bộ trang phục dạ hội lộng lẫy nhất vương quốc cho nàng công chúa kiêu sa. Lựa chọn kiểu tóc bồng bềnh, vương miện lấp lánh và trang sức quý phái.',
    instructions: 'Nhấp chọn danh mục trang phục, phụ kiện và kiểu tóc để thử đồ cho công chúa.',
    thumbnail: '/images/games/thoi-trang-cong-chua.jpg',
    categoryName: 'Thời trang',
    categoryId: 'fashion',
    tags: JSON.stringify(['Thời trang', 'Công chúa', 'Làm đẹp', 'New']),
    badge: 'NEW',
    isHot: false,
    isNew: true,
    isFeatured: false,
    available: true,
    gameUrl: '/play/thoi-trang-cong-chua',
    rating: 4.9,
    playCount: '104.7K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  },
  {
    id: 'tank-warfare',
    slug: 'dai-chien-tank',
    title: 'Đại Chiến Tank',
    subtitle: 'Iron Clash 3D',
    description: 'Chỉ huy cỗ xe bọc thép uy lực lăn bánh qua các phòng tuyến quân sự ác liệt. Khéo léo tính toán góc bắn đạn đại bác và lợi dụng địa hình để phá hủy căn cứ địch.',
    instructions: 'WASD điều khiển xe tăng di chuyển, Chuột để xoay tháp pháo và khai hỏa.',
    thumbnail: '/images/games/dai-chien-tank.svg',
    categoryName: 'Chiến thuật',
    categoryId: 'strategy',
    tags: JSON.stringify(['Chiến thuật', 'Bắn súng', 'Xe tăng', 'New']),
    badge: 'NEW',
    isHot: false,
    isNew: true,
    isFeatured: false,
    available: true,
    gameUrl: '/play/dai-chien-tank',
    rating: 4.7,
    playCount: '49.8K',
    releaseDate: '2024',
    developer: 'Hồ Kiệt Studio'
  }
];

const LEADERBOARD_ENTRIES = [
  { gameSlug: 'ban-ga-3d', playerName: 'Hồ Kiệt (Admin)', score: 18500, combo: 24 },
  { gameSlug: 'ban-ga-3d', playerName: 'ShadowSniper', score: 15200, combo: 19 },
  { gameSlug: 'ban-ga-3d', playerName: 'GaMayChem', score: 12450, combo: 15 },
  { gameSlug: 'ban-ga-3d', playerName: 'ProShooter99', score: 9800, combo: 12 },
  { gameSlug: 'ban-ga-3d', playerName: 'NongDanVuiVe', score: 7600, combo: 8 }
];

async function seed() {
  console.log('🌱 Starting MySQL seeding for gamevui24h...');

  // 1. Clean existing records in dependency order
  await prisma.leaderboardEntry.deleteMany({});
  await prisma.promoBanner.deleteMany({});
  await prisma.heroSlide.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.quickCategory.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('✓ Cleaned old records');

  // 2. Insert Categories
  for (const cat of CATEGORIES) {
    await prisma.category.create({ data: cat });
  }
  console.log(`✓ Inserted ${CATEGORIES.length} Categories`);

  // 3. Insert QuickCategories
  for (const qc of QUICK_CATEGORIES) {
    await prisma.quickCategory.create({ data: qc });
  }
  console.log(`✓ Inserted ${QUICK_CATEGORIES.length} Quick Categories`);

  // 4. Insert Games
  for (const game of GAMES) {
    await prisma.game.create({ data: game });
  }
  console.log(`✓ Inserted ${GAMES.length} Games`);

  // 5. Insert Hero Slides
  for (const slide of HERO_SLIDES) {
    await prisma.heroSlide.create({ data: slide });
  }
  console.log(`✓ Inserted ${HERO_SLIDES.length} Hero Slides`);

  // 6. Insert Promo Banners
  for (const promo of PROMO_BANNERS) {
    await prisma.promoBanner.create({ data: promo });
  }
  console.log(`✓ Inserted ${PROMO_BANNERS.length} Promo Banners`);

  // 7. Insert Leaderboard Entries
  for (const entry of LEADERBOARD_ENTRIES) {
    await prisma.leaderboardEntry.create({ data: entry });
  }
  console.log(`✓ Inserted ${LEADERBOARD_ENTRIES.length} Leaderboard Entries`);

  console.log('🎉 Seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
