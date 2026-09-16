# 🎮 HỒ KIỆT – GAMEVUI 24H

> Cổng Game Trực Tuyến Đẳng Cấp & Đa Dạng Thể Loại – Tích Hợp Game 3D & 2D Arcade Hiện Đại.

---

## 🌟 Tính năng nổi bật

### 1. 🐔 Bắn Gà 3D (Chicken Mayhem 3D)
- **Đồ họa 3D WebGL / Three.js**: Sử dụng `@react-three/fiber` và `@react-three/drei`.
- **Góc nhìn thứ nhất FPS**: Cơ chế di chuyển WASD, xoay góc nhìn 360° bằng chuột (Pointer Lock mượt mà), hệ thống độ giật súng (Recoil), Hitmarker, Combo rực lửa.
- **Tối ưu hóa hiệu năng**: Rendering vòng lặp tham chiếu WebGL trực tiếp, tốc độ 60-120 FPS.
- **Tự động lưu điểm**: Gửi kết quả và combo cao nhất vào MySQL Leaderboard khi hết giờ.

### 2. 🐠 Bắn Cá Đại Dương (Ocean Arcade Bubble Reef)
- **Engine Canvas 2D chuyên biệt**: Sinh vật biển bơi lội sinh động theo đường cong tự nhiên (Cá hề Nemo, Cá bướm, Cá nóc phồng gai, Rùa biển, Cá đuối phát sáng, Cá mập búa mini-boss, Cá rồng vàng Thần Thoại).
- **Cơ chế Lưới Năng Lượng**: Bắn đạn phát nổ thành lưới điện lan rộng, vòi phun xu vàng hút về khẩu pháo.
- **Âm thanh Web Audio tổng hợp**: 100% âm thanh tạo lập bằng Web Audio API, không lo lỗi mạng hay file 404.
- **Kỹ năng tối thượng**: ❄️ Đóng Băng Đại Dương & 💣 Bom Sóng Thần Nổ Toàn Màn Hình.

### 3. 🌐 Cổng Game WebVui Hiện Đại
- **Giao diện chuẩn Mockup**: Thiết kế tông màu tối Gaming Neon, Glassmorphism, Responsive hoàn hảo trên mọi kích thước màn hình.
- **Hệ thống danh mục & Tìm kiếm tức thì**: Lọc theo thể loại, tìm kiếm game nhanh với gợi ý tự động.
- **Bảng xếp hạng Trực tiếp**: Kết nối MySQL hiển thị Top cao thủ.
- **Yêu thích & Lưu trữ**: Quản lý danh sách game yêu thích theo thời gian thực.

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript.
- **Graphics**: Three.js, React Three Fiber, HTML5 Canvas 2D.
- **Styling**: Vanilla CSS Modules & CSS Design Tokens hiện đại.
- **Database & ORM**: MySQL (XAMPP localhost:3306), Prisma ORM v6.4.1.
- **State Management**: Zustand v5.
- **Icons & Effects**: Lucide React, Canvas Confetti.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- Node.js >= 18.x
- MySQL (XAMPP / MariaDB) đang chạy trên cổng `3306`

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình cơ sở dữ liệu
Tạo file `.env` (tham khảo `.env.example`):
```env
DATABASE_URL="mysql://root:@localhost:3306/gamevui24h"
```

Khởi tạo cơ sở dữ liệu và nạp dữ liệu mẫu:
```bash
npx prisma db push
node scripts/seed.mjs
```

### 4. Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📁 Cấu trúc thư mục

```
game/
├── prisma/
│   └── schema.prisma         # Định nghĩa các bảng dữ liệu MySQL
├── public/
│   └── images/               # Hình ảnh game, banner, mascot thương hiệu
├── scripts/
│   └── seed.mjs              # Script tự động seed dữ liệu vào MySQL
├── src/
│   ├── app/                  # Next.js App Router (trang chủ, API, chi tiết, chơi game)
│   ├── audio/                # Hệ thống âm thanh Web Audio
│   ├── components/
│   │   ├── game/             # 3D Bắn Gà Components
│   │   ├── ocean/            # 2D Bắn Cá Components & Canvas Engine
│   │   ├── portal/           # Header, Sidebar, Cards, Banners, Carousels
│   │   └── ui/               # HUD, Modals, Menus
│   ├── data/                 # Dữ liệu dự phòng & Mock configs
│   ├── lib/                  # Prisma Client singleton & Ocean Engine
│   ├── stores/               # Zustand state stores
│   └── styles/               # CSS Design Tokens & Portal Styles
└── README.md
```

---

## 👨‍💻 Tác giả & Bản quyền
- **Phát triển bởi**: Hồ Kiệt Studio – GameVui 24h
- **Liên hệ**: [GitHub](https://github.com/hkiett265)
