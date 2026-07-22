# 学中文 · HanWordTeam

Web học tiếng Trung cơ bản (pinyin, thanh điệu, từ vựng theo chủ đề) kèm các mini-game ôn tập, do **HanWordTeam** (FPT University) thực hiện.

## Cách chạy thử ở máy local

Vì trang dùng `fetch`/module theo đường dẫn tương đối, nên mở trực tiếp bằng cách double-click `index.html` có thể bị chặn bởi trình duyệt. Cách chạy chuẩn:

```bash
# Python 3
python3 -m http.server 8080
# rồi mở http://localhost:8080
```

Hoặc dùng extension "Live Server" trong VS Code.

## Cấu trúc thư mục

```
hanword-chinese-app/
├── index.html              # Khung HTML (View) — chỉ chứa markup, không có CSS/JS gộp
├── css/                     # View — style tách theo từng khu vực chức năng
│   ├── base.css              # reset + nền chung
│   ├── layout.css            # thanh điều hướng + badge nhóm (dùng chung mọi màn hình)
│   ├── home.css               # trang chủ + menu thực hành
│   ├── alphabet.css           # màn hình học bảng chữ cái
│   ├── flashcard.css          # màn hình học từ vựng bằng flashcard
│   └── games.css              # 6 mini-game ôn tập
├── js/
│   ├── data/                 # Model — dữ liệu thuần, không đụng DOM
│   │   ├── alphabet-data.js
│   │   └── topics.js
│   ├── core/                 # Controller chính — điều hướng & luồng app
│   │   ├── ScreenManager.js
│   │   └── app.js
│   └── games/                 # Controller riêng từng game
│       ├── alphabet.js
│       └── lantern.js
└── images/
    ├── hanword-logo.png
    └── fptu-logo.png
```

## Ghi chú

- Đây là ứng dụng 1 trang (SPA) thuần HTML/CSS/JS, không dùng framework/build tool — các "màn hình" là các `<div class="screen">` được ẩn/hiện bằng JS (`showScreen()` trong `js/core/app.js`), không phải nhiều trang riêng biệt.
- Liên hệ / theo dõi nhóm: [facebook.com/hanwordfptu](https://facebook.com/hanwordfptu)
