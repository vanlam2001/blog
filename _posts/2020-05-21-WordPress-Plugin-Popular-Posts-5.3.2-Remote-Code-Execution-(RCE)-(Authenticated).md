---
title: WordPress Plugin Popular Posts 5.3.2 - Remote Code Execution (RCE) (Authenticated)
date: 15/7/2021
layout: single
header:
  teaser: /assets/images/wordpress.png
--- 

## Mô Tả 
Lưu ý: Cần có tiện ích Bài đăng phổ biến đang hoạt động (tức là trong phần chân trang) và tiện ích mở rộng gd cho `PHP` là Đã bật (nếu không `WPP` không thể tạo hình thu nhỏ). Ngoài ra, người dùng được xác thực phải có vai trò "Người đóng góp" trở lên.

+ Tác giả: Simone Cristofaro
+ Phiên bản: 5.3.2 
+ Đã thử nghiệm trên: WordPress 5.7.2, PHP phiên bản 7.3.27



## Khai thác  
Tập lệnh này sẽ đăng nhập bằng thông tin đăng nhập được cung cấp, tạo bài đăng mới và thêm trường tùy chỉnh với liên kết đến, `web shell` sẽ được máy chủ tự động tải xuống. Nếu bạn không muốn tải tệp lên, bạn cần phải cung cấp một URL cho một web shell có hỗ trợ SSL (`https`) và đảm bảo rằng nó chứa tên tệp trong đó. Nếu plugin là thiết lập để hiển thị một số lượng cố định các bài đăng phổ biến (tức là. top 5), bạn chỉ cần làm mới trang bài đăng để làm cho nó tăng lên;)
+ Mã khai thác [exploits/50129](https://www.exploit-db.com/exploits/50129)


## Mã Kiểm Tra 
[![Language](https://img.shields.io/badge/Lang-Python-blue.svg)](https://www.python.org)

```powershell
* Wordpress Popular Posts plugin <= 5.3.2 - RCE (Authenticated)
* @Heisenberg

usage: 15.py [-h] -t IP [-p PORT] -w PATH -U USER -P PASS

Wordpress Popular Posts plugin <= 5.3.2 - RCE (Authenticated)

optional arguments:
  -h, --help  show this help message and exit
  -t IP       --Target IP
  -p PORT     --Target port
  -w PATH     --Wordpress path (ie. /wordpress/)
  -U USER     --Username
  -P PASS     --Password
```

## Chúc may mắn :D


