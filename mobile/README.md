# 📱 Meme Maker - Mobile App

> Ứng dụng tạo meme từ ảnh với Vite + React + TypeScript + Capacitor

## 📋 Thông tin Project

- **Framework:** Vite + React + TypeScript
- **Platform:** Capacitor (Android/iOS/Web)
- **Architecture:** Clean Architecture (4 layers)

### Capacitor Plugins
- `@capacitor/camera` - Chọn ảnh từ thư viện
- `@capacitor/filesystem` - Lưu file vào thiết bị
- `@capacitor/share` - Chia sẻ nội dung

---

## ✅ Tính năng

### Yêu cầu cơ bản
- ✅ Chọn ảnh từ thư viện thiết bị
- ✅ Thêm và tùy chỉnh text overlay (font size, color, stroke, rotation)
- ✅ Di chuyển text bằng drag & drop
- ✅ Lưu meme vào thiết bị
- ✅ Chia sẻ meme lên các platform khác

### Tính năng mở rộng
- ✅ Bộ lọc ảnh: Grayscale, Sepia, Brightness, Contrast, Saturate, Blur
- ✅ Điều chỉnh intensity cho từng filter
- ✅ Multiple text layers với customization

---

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  Components + Pages + Styles        │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│     Business Logic Layer            │
│  Custom Hook (useMemeEditor)        │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│     Utility Layer                   │
│  canvas.ts + capacitor.ts           │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│     Native Layer                    │
│  Capacitor Plugins                  │
└─────────────────────────────────────┘
```

### Cấu trúc thư mục
```
src/
├── components/       # UI components (ImageEditor, TextControls, FilterControls)
├── hooks/            # Custom hooks (useMemeEditor)
├── pages/            # Pages (MemeEditor)
├── types/            # TypeScript type definitions
├── utils/            # Utilities (canvas, capacitor)
├── App.tsx
└── main.tsx
```

---

## 🚀 Quick Start

### Yêu cầu
- Node.js >= 20.0.0
- npm hoặc yarn
- Android Studio (cho Android - optional)

### 🎯 Cách 1: Setup Tự Động (Khuyên dùng)

**Chạy 1 lệnh duy nhất:**

```bash
./setup.sh
```

Script sẽ tự động:
- ✅ Kiểm tra Node.js version
- ✅ Cài đặt dependencies (nếu cần)
- ✅ Hiển thị menu lựa chọn:
  1. Run development server (Web)
  2. Build for production
  3. Build & run on Android
  4. Install dependencies only
  5. Clean & reinstall

**Ví dụ:**
```bash
# Lần đầu chạy
cd /home/phanhoailang/Flutter/Meme_Maker/mobile
./setup.sh
# → Chọn option 1 để chạy dev server
```

### 🛠️ Cách 2: Setup Thủ Công

#### Bước 1: Cài đặt Node.js 20+ (nếu cần)

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20

# Verify
node -v  # Should be v20.x.x
```

#### Bước 2: Cài đặt Dependencies

```bash
npm install
```

#### Bước 3: Chạy Project

**Development (Web Browser):**
```bash
npm run dev
# → Mở http://localhost:5173
```

**Build Production:**
```bash
npm run build
```

**Android (nếu có Android Studio):**
```bash
# Build project
npm run build

# Sync với Capacitor
npx cap sync android

# Mở Android Studio
npx cap open android
# → Click Run ▶️ trong Android Studio
```

### ⚡ Scripts Tiện Lợi

Có thể dùng `run.sh` để rút gọn commands:

```bash
./run.sh dev       # Start dev server
./run.sh build     # Build project
./run.sh android   # Build & open Android Studio
```

### 🔄 Load NVM (Nếu cần)

Nếu gặp lỗi Node.js version, load nvm:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
```

---

## 📐 Best Practices Applied

### 1. Clean Architecture
- **Separation of Concerns:** UI tách biệt business logic
- **Custom Hook Pattern:** State management trong hook
- **Pure Functions:** Utils không có side effects

### 2. TypeScript Strict Mode
- Type-safe code
- Interfaces rõ ràng
- Không dùng `any`

### 3. Mobile-First Design
- Touch-friendly UI (buttons >= 44px)
- Responsive layout với flexbox
- Dynamic viewport height (dvh)
- Gesture support (drag & drop)

### 4. Error Handling
- Try-catch cho async operations
- Loading states rõ ràng
- User-friendly error messages

### 5. Performance
- `useCallback` để tránh re-renders
- Efficient canvas rendering
- Memoization

---

## 📝 Hướng dẫn sử dụng

### 1. Chọn ảnh
Tap **"Choose Image"** → Chọn ảnh từ gallery → Ảnh hiển thị trong editor

### 2. Thêm text
Tap **"➕ Add Text"** → Text xuất hiện → Kéo để di chuyển

### 3. Tùy chỉnh text
- **Text:** Nhập nội dung
- **Font Size:** 20-120px
- **Color:** Chọn màu text
- **Stroke:** Màu và độ dày viền
- **Rotation:** Xoay -180° đến 180°

### 4. Áp dụng filter
Tab **"Filter"** → Chọn filter → Điều chỉnh intensity

### 5. Lưu & Chia sẻ
- **💾 Save:** Lưu vào Documents folder
- **📤 Share:** Chia sẻ qua WhatsApp, Messenger, etc.

---

## 🎨 Components Chi tiết

### `useMemeEditor` Hook
**Business logic chính:**
```typescript
const {
  imageUrl,           // URL ảnh đã chọn
  textOverlays,       // Mảng text layers
  selectedOverlay,    // Text đang được chọn
  filter,             // Filter hiện tại
  isLoading,          // Trạng thái loading
  error,              // Error message
  loadImage,          // Chọn ảnh
  addTextOverlay,     // Thêm text
  updateTextOverlay,  // Update text
  deleteTextOverlay,  // Xóa text
  selectOverlay,      // Chọn text để edit
  setFilter,          // Set filter
  saveMeme,           // Lưu meme
  shareMeme,          // Share meme
  reset               // Reset editor
} = useMemeEditor();
```

### `ImageEditor` Component
- Render canvas với image + text overlays
- Handle drag & drop
- Touch event handling

### `TextControls` Component
- Text input
- Font size slider
- Color pickers (text + stroke)
- Rotation slider
- Delete button

### `FilterControls` Component
- Filter type dropdown
- Intensity slider

---

## 🔧 Troubleshooting

### App không chạy trên emulator?
```bash
# Check Node.js version
node -v  # Phải >= 20.0.0

# Nếu < 20, install nvm và upgrade
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### Build failed?
```bash
# Clean và rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Canvas không render text?
- Check console log
- Verify font family: `'Impact', 'Arial', sans-serif`

### Permissions denied trên Android?
Check `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.CAMERA"/>
```

---

## 📊 Project Statistics

- **Lines of Code:** ~1,500+
- **Components:** 3
- **Custom Hooks:** 1
- **Utils:** 2
- **TypeScript Types:** 5+

---

## 🎯 Testing Checklist

- [ ] Chọn ảnh từ gallery ✅
- [ ] Add multiple text layers ✅
- [ ] Drag text to reposition ✅
- [ ] Edit text properties ✅
- [ ] Apply & adjust filters ✅
- [ ] Save meme ✅
- [ ] Share meme ✅
- [ ] Reset editor ✅

---

## 🔮 Future Enhancements

- [ ] Preset frames (Instagram, Facebook, Twitter)
- [ ] Sticker/Emoji library
- [ ] Undo/Redo
- [ ] Template saving
- [ ] Dark mode
- [ ] Multiple fonts
- [ ] Image cropping

---

## 📚 Learning Resources

### React & TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Capacitor
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Camera Plugin](https://capacitorjs.com/docs/apis/camera)
- [Filesystem Plugin](https://capacitorjs.com/docs/apis/filesystem)
- [Share Plugin](https://capacitorjs.com/docs/apis/share)

### Canvas API
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

---

## 📄 License

MIT License

---

## 👨‍💻 Development

### Code Structure
```
src/
├── components/
│   ├── ImageEditor.tsx + .css     # Canvas editor với drag & drop
│   ├── TextControls.tsx + .css    # Text customization panel
│   └── FilterControls.tsx + .css  # Filter controls
├── hooks/
│   └── useMemeEditor.ts           # Main business logic
├── pages/
│   └── MemeEditor.tsx + .css      # Main app page
├── types/
│   └── index.ts                   # TypeScript definitions
├── utils/
│   ├── canvas.ts                  # Canvas utilities
│   └── capacitor.ts               # Capacitor wrappers
├── App.tsx                        # Root component
└── main.tsx                       # Entry point
```

### Key Principles
1. **Separation of Concerns** - UI vs Logic
2. **Type Safety** - TypeScript strict mode
3. **Mobile-First** - Touch-friendly, responsive
4. **Error Handling** - Try-catch, loading states
5. **Performance** - Memoization, efficient rendering

---

**Built with ❤️ following senior developer standards**

For questions or issues, check code comments or raise an issue.

Happy meme-making! 🎨✨
