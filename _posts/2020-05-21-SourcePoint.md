---
title: SourcePoint
date: 9/8/2021
layout: single
header:
  teaser: https://raw.githubusercontent.com/Tylous/SourcePoint/main/Screenshots/logo.png
--- 

## Mô tả 
Tác giả: Tylous

SourcePoint là một trình tạo hồ sơ C2 đa hình cho các C2 Cobalt Strike, được viết bằng Go. SourcePoint cho phép các cấu hình C2 duy nhất được tạo nhanh chóng giúp giảm các Chỉ số Thỏa hiệp ("IoC") của chúng tôi và cho phép người vận hành tạo ra các cấu hình phức tạp với nỗ lực tối thiểu. Điều này được thực hiện bằng cách xem xét rộng rãi các [Bài viết](https://www.cobaltstrike.com/help-malleable-c2) cũng như [Ghi chú](https://www.cobaltstrike.com/releasenotes.txt) bản vá để xác định các chức năng chính và các tính năng có thể sửa đổi. SourcePoint được thiết kế với mục đích giải quyết vấn đề làm thế nào để làm cho hoạt động C2 của chúng tôi khó bị phát hiện hơn, tập trung vào việc chuyển từ các IoC độc hại sang các IoC đáng ngờ. Mục tiêu ở đây là việc phát hiện C2 của chúng ta sẽ khó hơn nếu các IoC của chúng ta không có bản chất độc hại và yêu cầu nghiên cứu bổ sung để phát hiện ra bản chất đáng ngờ. SourcePoint chứa nhiều tùy chọn có thể định cấu hình khác nhau để chọn để sửa đổi hồ sơ của bạn (trong hầu hết các trường hợp, nếu để trống, SourcePoint sẽ ngẫu nhiên chọn chúng cho bạn). Các cấu hình được tạo sẽ sửa đổi tất cả các khía cạnh của C2 của bạn. Mục tiêu của dự án này là không chỉ hỗ trợ phá vỡ các biện pháp kiểm soát dựa trên phát hiện mà còn giúp hòa trộn lưu lượng và hoạt động C2 vào môi trường, làm cho hoạt động nói trên khó bị phát hiện.

[github.com/Tylous/SourcePoint](https://github.com/Tylous/SourcePoint)
## Ảnh chụp màn hình

![1](https://raw.githubusercontent.com/Tylous/SourcePoint/main/Screenshots/C2int_p1.png)

![2](https://raw.githubusercontent.com/Tylous/SourcePoint/main/Screenshots/C2int_p2.png)

## Cài đặt 
[![Language](https://img.shields.io/badge/Lang-go-blue.svg)](https://golang.org/)

```powershell
$go get gopkg.in/yaml.v2
```

```powershell
$go build SourcePoint.go
```
## Sử dụng 
Code [SourcePoint.go](https://github.com/Tylous/SourcePoint/blob/main/SourcePoint.go) 
## Important
SourcePoint chủ yếu tự động hóa quá trình xây dựng hồ sơ. Điều rất quan trọng là phải biết tất cả các tính năng được sửa đổi trong các cấu hình này. Biết những tính năng này thực sự có thể giúp tăng thành công của bạn.

## Options
Mặc dù có rất nhiều cài đặt và tính năng được mô tả trong chức năng trợ giúp của SourcePoint, nhưng có rất nhiều tính năng quan trọng được đưa vào từng hồ sơ mà bạn cần phải làm quen. Các tính năng này là:

## Global Options
Phần này trong hồ sơ của bạn sửa đổi cách các toán tử báo hiệu. Một số tính năng được sử dụng để sửa đổi hành vi là:

+ Giai đoạn máy chủ - Cho phép máy chủ nhóm lưu trữ mã shell theo giai đoạn cho HTTP, HTTPS, DNS. Nếu điều này được bật, bất kỳ ai gửi yêu cầu GET với một giá trị cụ thể như has `/9ZXq` cũng có thể kéo shellcode
+ Ngủ - Khoảng thời gian mà đèn hiệu gọi về nhà
+ Jitter - Thêm một tỷ lệ phần trăm vào thời gian về nhà của cuộc gọi báo hiệu
+ Useragent - Chuỗi sử dụng được sử dụng khi giao tiếp lưu lượng HTTP và HTTPS. Sử dụng chuỗi sử dụng thích hợp có thể giúp hòa nhập vào môi trường
+ Data Jitter - Thêm một chuỗi có độ dài ngẫu nhiên vào tất cả các yêu cầu GET và POST để đảm bảo các yêu cầu đến không có cùng độ dài
+ Tiêu đề khung SMB - Thêm giá trị tiêu đề vào thông báo báo hiệu SMB
+ Pipename - Đặt tên của đường ống SMB mà các đèn hiệu sẽ sử dụng để liên lạc
+ Pipename Stager - Đặt tên của SMB stager cho các báo hiệu
+ TCP Frame Header - Thêm giá trị tiêu đề vào thông báo đèn hiệu TCP
+ Biểu ngữ SSH - Biểu ngữ SSH được sử dụng
+ SSH Pipename - Tên được sử dụng cho biểu ngữ SSH

## Stage
Phần này của hồ sơ của bạn kiểm soát cách beacon được tải vào bộ nhớ và chỉnh sửa nội dung của beacon DLL. Một số tính năng được sử dụng để sửa đổi hành vi là:

+ Làm xáo trộn - Làm xáo trộn bảng nhập của DLL phản chiếu
+ Stomppe - Yêu cầu tải trọng nén các giá trị MZ, PE và e_lfanen sau khi tải
+ Dọn dẹp - Báo hiệu cho beacon giải phóng bộ nhớ được hỗ trợ với DLL phản xạ đã tạo ra nó
+ UseRWX - Đảm bảo shellcode không sử dụng quyền Đọc, Ghi Thực thi
+ Smart Inject - Sử dụng gợi ý con trỏ chức năng nhúng để khởi động tác nhân báo hiệu mà không cần đi bộ kernel32 EAT
+ Sleep Mask - Đèn hiệu TCP và SMB sẽ tự xáo trộn khi chúng chờ kết nối được thiết lập
+ PE Header - Thay đổi các đặc điểm của DLL phản xạ beacon của bạn để trông giống như một cái gì đó khác trong bộ nhớ
+ Chuyển đổi - Biến đổi giai đoạn DLL phản chiếu của đèn hiệu bằng cách xóa hoặc thêm chuỗi vào phần .rdata

## Process-Inject
Phần này trong hồ sơ của bạn kiểm soát cách đèn hiệu định hình nội dung được đưa vào và kiểm soát hành vi đưa vào quy trình. Một số tính năng được sử dụng để sửa đổi hành vi là:

+ Bộ phân bổ - Xác định cách bộ tải phản chiếu của đèn hiệu phân bổ bộ nhớ
+ Phân bổ tối thiểu - Số lượng bộ nhớ tối thiểu để yêu cầu nội dung được đưa vào
+ Userwx - Đảm bảo shellcode không sử dụng quyền Read, Write Execute (Thay thế là RW)
+ Startrwx - Sử dụng Đọc, Viết Thực thi làm quyền ban đầu cho nội dung được đưa vào (Thay thế là RW)
+ Transformer - Thêm một khối nội dung đệm được chèn bởi beacon
+ Thực thi - Phần này xác định cách thực thi mã được đưa vào

## Post-Exec
Phần này của hồ sơ của bạn kiểm soát cách beacon xử lý các mô-đun và lệnh sau khai thác. Một số tính năng được sử dụng để sửa đổi hành vi là:

+ Spawnto - Xác định báo hiệu quy trình tạm thời mặc định sẽ xuất hiện cho lệnh và tùy chọn sau khai thác của nó
+ Làm xáo trộn - Làm xáo trộn bảng nhập của DLL phản chiếu
+ Smart Inject - Chuyển các con trỏ chức năng chính từ đèn hiệu đến các công việc con của nó
+ AMSI vô hiệu hóa - Tắt AMSI cho powerpick, thực thi-lắp ráp và psinject (Các EDR nhất định có thể phát hiện điều này tốt + nhất nên tránh sử dụng các công cụ này)
+ Keylogger - Xác định cách API ghi nhật ký bàn phím sử dụng để ghi lại các lần gõ phím

## Profiles
Hiện tại, SourcePoint cung cấp cho bạn 6 tùy chọn cho cấu hình lưu lượng HTTP / HTTPS, dựa trên cấu hình hiện có. Trong số 6 người này, 4 người trong số họ chịu ảnh hưởng và dựa trên:

+ Giao tiếp Microsoft Windows Update
+ Liên lạc tin nhắn Slack
+ Gotomeeting Active Meeting Communication
+ Liên lạc qua email của Microsoft Outlook

2 trong số các tùy chọn hồ sơ (5 và 6) được thiết kế đặc biệt cho:

+ Cloudfront.net
+ AzureEdge.net

Tùy chọn cuối cùng (7) được thiết kế để nhập một cấu hình tùy chỉnh. Tùy chọn này được thiết kế để cho phép người điều hành sử dụng một hồ sơ lưu lượng hoàn toàn tùy chỉnh. Có nhiều trường hợp một hồ sơ lưu lượng truy cập hoàn toàn duy nhất sẽ mang lại thành công cao hơn là một trong những trường hợp này. Điều này cũng cho phép các nhà khai thác vẫn sử dụng các tính năng dễ uốn nắn của SourcePoint với hồ sơ lưu lượng truy cập yêu thích hoặc truy cập của họ. Vì điều này cho phép các cấu hình duy nhất, điều quan trọng là phải đảm bảo bạn tinh chỉnh và điều chỉnh cấu hình để SourcePoint hoạt động. Ở mức tối thiểu:

+ Replace - header "Host" "acme.com"; with header "Host" "{{.Variables.Host}}";
+ Replace - /pathtolegitpage/ under the GET field with {{.Variables.HTTP_GET_URI}}
+ Replace - /pathtolegitpage/ under the POST field with {{.Variables.HTTP_POST_URI}}

Để làm như vậy, hãy sử dụng các tùy chọn sau `-CustomURI` và `-ProfilePath` cùng với `-Profile 7`. Trong khi phát triển hồ sơ, bạn nên sử dụng ./c2lint gốc để xác minh mọi thứ đang hoạt động.

## Cấu hình Yaml mẫu
```powershell
Stage: "False"
Host: "acme-email.com"
Keystore: "acme-email.com.store"
Password: "Password"
Metadata: "netbios"
Injector: "VirtualAllocEx"
Outfile: "acme.profile"
PE_Clone: 20
Profile: 4
Allocation: 5312
Jitter: 30
Debug: true
Sleep: 35
Uri: 3
Useragent:  "Mac"
Post-EX Processname: 11
Datajitter: 40
Keylogger: "SetWindowsHookEx"
Customuri: 
CDN:
CDN_Value: 
ProfilePath: 
```
## SSL Certificate
Chế độ cấu hình 1-4 có thể được sử dụng mà không cần SSL xác thực, SourcePoint sẽ tạo chứng chỉ tự ký liên quan đến loại cấu hình. Tuy nhiên, chứng chỉ SSL hợp lệ là cực kỳ quan trọng đối với sự thành công của bất kỳ loại C2 nào. Vì nhiều lý do nhưng rõ ràng là không có chứng chỉ có nghĩa là lưu lượng truy cập sẽ không được mã hóa (tức là HTTP KHÔNG BAO GIỜ ĐƯỢC SỬ DỤNG) nhưng việc sử dụng chứng chỉ tự ký đi kèm với những hạn chế rõ ràng của nó. Có nhiều cách để có được chứng chỉ SSL hợp lệ để tạo kho khóa theo cách của tôi là sử dụng phiên bản sửa đổi của [HTTPsC2DoneRight.sh](https://github.com/killswitch-GUI/CobaltStrike-ToolKit/blob/master/HTTPsC2DoneRight.sh), được tạo bởi [Cham423](https://github.com/cham423/cs-tools)

## DNS
Hiện tùy chỉnh DNS không được cung cấp trực tiếp thông qua SourcePoint. Để vẫn cho phép các beacon dựa trên dns, có một phần nhận xét cho dns-beacon trong mọi hồ sơ được tạo.

- [x] Add More Profiles
- [x] DNS Staging

## Thanks
