---
title: WanaCryptor. NSA Exploits & Ransomware = Ransomworm.
date: 20/7/2021
layout: single
header:
  teaser: /assets/images/madoc.jpg
--- 

## Giới Thiệu
Mã Độc Tống Tiền WanaCryptor
## Mô Tả 
Bây giờ tôi chắc chắn rằng tất cả mọi người đã nghe nói về WanaCryptor ransomworm.

Tuy nhiên, những gì bạn có thể không biết là đã có một cách khai thác rất cụ thể được sử dụng kết hợp với ransomware / worm này. Vì vậy, đối với một số thông tin cơ bản, một thời gian trước chi nhánh của NSA EQUATIONGROUP đã bị tấn công bởi một nhóm người tự xưng là "Shadow Broker". Người ta tuyên bố rằng một kho vũ khí lớn của 0day và các khai thác tùy chỉnh đã được thực hiện trong vụ vi phạm dữ liệu. Điều này sau đó đã trở thành sự thật khi Shadow Broker bán tất cả các công cụ họ có trên mạng.


Một trong những lỗ hổng được tiết lộ bởi vụ rò rỉ là MS17-010. Đây là một lỗ hổng nghiêm trọng trong cách Windows xử lý việc triển khai Khối Thông báo Máy chủ hoặc SMB. SMB là một giao thức truyền tệp. Lỗ hổng ở đây là cách mà SMB xử lý các yêu cầu được chế tạo đặc biệt. Với yêu cầu phù hợp, điều này có thể cho phép thực thi mã từ xa và theo cách này, Ransomware cũng hoạt động như một con sâu.


Khi đã có được chỗ đứng ban đầu, ransomware sẽ quét mạng cục bộ để tìm dịch vụ SMB. Nếu được tìm thấy, nó sẽ tung ra một cuộc khai thác để lan truyền qua mạng và lây nhiễm cho nhiều máy nhất có thể. Nếu bạn quan tâm BAE Systems có một báo cáo phân tích chi tiết về chức năng của phần mềm độc hại.



Trong thời gian này, Rapid7 đã thêm một mô-đun cho phép khai thác có tên là EternalBlue vào khuôn khổ metasploit. Các chi tiết có thể được tìm thấy bằng cách nhấp vào đây.


Điều thú vị là bạn có thể đọc trong bài báo Hệ thống BAE, phần mềm độc hại có một số loại chức năng chuyển đổi tiêu diệt. Những gì nó làm là kiểm tra sự tồn tại của một miền nhất định, nếu miền được tìm thấy, nó sẽ dừng việc thực thi trọng tải. Điều này rất có thể được thực hiện như một kỹ thuật né tránh hộp cát.

Trớ trêu thay, một khi các nhà nghiên cứu phát hiện ra điều này, họ đã nhanh chóng đăng ký miền, điều này dẫn đến việc giảm nhiễm trùng. Điều thú vị về cuộc tấn công ransomware này là nó đã sử dụng một phương thức khai thác cấp quốc gia để hoạt động như một con sâu và trái với cơ chế phân phối thông thường (chiến dịch Lừa đảo), có vẻ như các dịch vụ SMB trên internet đã bị phần mềm độc hại nhắm mục tiêu trực tiếp.

Hơn nữa, Microsoft đã đưa ra một bản vá. Bạn nên cập nhật nếu bạn chạy Windows as OS trên bất kỳ hộp nào bạn có. Nếu bạn muốn biết liệu Windows của mình có dễ bị tấn công hay không, bạn có thể sử dụng tập lệnh Python này để tìm hiểu.



## Mã Kiểm Tra 
[![Language](https://img.shields.io/badge/Lang-Python-blue.svg)](https://www.python.org)

Mã kiểm tra tại đây [blogth3pr0/WanaCryptor](https://github.com/blogth3pr0/WanaCryptor)

## Chúc một ngày tốt lành :D
