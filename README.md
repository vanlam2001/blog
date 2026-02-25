# VanLam Blog (Astro Version)

Đây là mã nguồn blog cá nhân được xây dựng lại bằng [Astro](https://astro.build/), thay thế cho phiên bản Jekyll cũ. Blog tập trung vào chia sẻ kiến thức về bảo mật và lập trình.

## Yêu cầu hệ thống

- **Node.js**: Phiên bản 18.14.1 trở lên.
- **npm**: (Đi kèm với Node.js).

## Cài đặt và Chạy

1.  **Cài đặt các thư viện cần thiết:**

    Mở terminal tại thư mục gốc của dự án và chạy lệnh:

    ```bash
    npm install
    ```

2.  **Chạy server phát triển (Development):**

    Để xem trước blog và chỉnh sửa trực tiếp (hot-reload):

    ```bash
    npm run dev
    ```

    Truy cập vào địa chỉ: `http://localhost:4321/`

3.  **Xây dựng trang tĩnh (Build):**

    Để tạo ra các file HTML tĩnh (thư mục `dist/`) cho việc deploy:

    ```bash
    npm run build
    ```

4.  **Xem trước bản build:**

    Để kiểm tra kết quả sau khi build:

    ```bash
    npm run preview
    ```

## Quản lý bài viết

Bài viết được lưu trữ trong thư mục `src/content/posts/`.

### Thêm bài viết mới

Tạo một file Markdown (`.md`) mới trong thư mục `src/content/posts/`.
Định dạng file cần có phần frontmatter ở đầu như sau:

```markdown
---
title: Tiêu đề bài viết
date: 2023-10-27
description: Mô tả ngắn gọn về nội dung bài viết (tùy chọn)
header:
  teaser: /images/hinh-anh-dai-dien.png (tùy chọn)
---

Nội dung bài viết bắt đầu từ đây...
```

### Chỉnh sửa bài viết

Mở file `.md` tương ứng trong `src/content/posts/` và chỉnh sửa nội dung. Khi đang chạy `npm run dev`, thay đổi sẽ tự động cập nhật trên trình duyệt.

### Xóa bài viết

Để xóa một bài viết khỏi giao diện blog:

1.  **Xóa file `.md`** tương ứng trong thư mục `src/content/posts/`.
2.  Nếu đang chạy `npm run dev`, giao diện sẽ tự động cập nhật và bài viết sẽ biến mất.
3.  Nếu deploy production, hãy chạy lại lệnh `npm run build` để tạo lại trang tĩnh mới không còn bài viết đó.

**Lưu ý:** Hệ thống Astro sẽ tự động quét thư mục `posts` mỗi khi build. Bất kỳ file nào không còn tồn tại trong thư mục này sẽ không được tạo trang HTML, do đó bài viết sẽ hoàn toàn biến mất khỏi website.

## Cấu trúc dự án

- `src/content/posts/`: Chứa các bài viết Markdown.
- `src/pages/`: Chứa các trang chính (Trang chủ, trang chi tiết bài viết).
- `src/layouts/`: Chứa layout chung cho toàn bộ website.
- `src/styles/`: Chứa file CSS global.
- `public/`: Chứa các file tĩnh (hình ảnh, favicon, robots.txt...).
- `astro.config.mjs`: File cấu hình của Astro.
