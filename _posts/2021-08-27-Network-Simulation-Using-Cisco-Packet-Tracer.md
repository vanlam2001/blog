---
title: Network-Simulation-Using-Cisco-Packet-Tracer
date: 27/8/2021
layout: single
header:
  teaser: https://ting3s.com/uploads/images/202012/cai-dat-cisco-packet-tracer-11.jpg
---

![1](https://ting3s.com/uploads/images/202012/cai-dat-cisco-packet-tracer-11.jpg)

## Mô Tả
🖧 Cấu trúc liên kết mạng được thiết kế bằng Cisco Packet Tracer

Tác giả: harismuneer

> Thiết kế cấu hình mạng này cho mạng của ba công ty, với một số ràng buộc. Vấn đề này đã được trình bày trong Phòng thí nghiệm mạng máy tính (CL307) cuối cùng của tác giả. Vai trò chính là mạng con các địa chỉ IP chính xác.

> Đây là một vấn đề thú vị thể hiện các khái niệm về Mạng con IP không phân lớp và sử dụng Giao thức RIPv2. Tôi đang chia sẻ giải pháp hoạt động này để nó có thể giúp ích cho những người khác muốn tìm hiểu những khái niệm này bằng một ví dụ thực tế thực tế

## Mạng được thiết kế

![2](https://raw.githubusercontent.com/harismuneer/Network-Simulation-Using-Cisco-Packet-Tracer/master/network-screenshot.PNG)

## Báo cáo vấn đề
Giả sử bạn là Giám đốc điều hành của một công ty khởi nghiệp chuyên về cấu hình mạng cho các công ty khác nhau. Sau 100 ngày đấu tranh, cuối cùng bạn đã nhận được nhiệm vụ đầu tiên của mình là định cấu hình mạng cho ba công ty khác nhau theo cách mà tất cả các PC trong mỗi công ty phải có thể giao tiếp với nhau cũng như với tất cả các PC của bất kỳ công ty nào khác. Công ty.

Các công ty được đặt tên là CMP X, CMP Y và CMP Z.

+ CMP X có 5 phòng với 1 máy tính trong mỗi phòng.
+ CMP Y có 3 phòng với 3 máy tính trong mỗi phòng.
+ CMP Z có 2 phòng với 4 máy tính trong mỗi phòng.

Công ty quản lý IP đã chỉ định các địa chỉ mạng IP sau cho từng công ty:

+ CMP X: 144.186.96.0/19
+ CMP Y: 50.152.0.0/15
+ CMP Z: 210.98.169.64/26

> Là một phần của thỏa thuận, cả ba công ty đã yêu cầu bạn chịu chi phí cho tất cả các thiết bị chuyển mạch và bộ định tuyến được sử dụng để kết nối tất cả các máy tính trong mạng hợp nhất cho ba công ty và hướng dẫn thêm cho bạn rằng tất cả các PC trong một phòng duy nhất phải được bật cùng một mạng con và tất cả các phòng của một công ty phải nằm trên một mạng con khác sẽ được chỉ định sau khi mạng phụ địa chỉ mạng được chỉ định cho công ty có liên quan (không chấp nhận mạng bên ngoài hoặc mạng của công ty khác ) ví dụ: mỗi phòng cho CMP X sẽ được gán một mạng con khác nhau sau khi mạng con chỉ địa chỉ 144.186.96.0/19 chứ không phải bất kỳ địa chỉ mạng nào khác. Các công ty đã thông báo thêm cho bạn rằng các công ty có kế hoạch mở rộng số lượng PC của họ trong mỗi phòng trong tương lai.

Bạn, hãy khéo léo tiết kiệm, quyết định cài đặt các bộ chuyển mạch cũ (Bộ chuyển mạch chung trong Cisco Packet Tracer) chỉ có ba cổng Ethernet hoạt động trong số bốn cổng và bộ định tuyến (Bộ định tuyến chung trong Bộ theo dõi gói của Cisco) để định cấu hình mạng cho ba công ty theo cách sao cho bạn sử dụng càng ít bộ định tuyến và bộ chuyển mạch càng tốt

Bạn cũng đã mua địa chỉ mạng IP folliwng cho giao tiếp nối tiếp giữa các bộ định tuyến khác nhau sẽ kết nối các mạng con giữa Công ty và Nội bộ khác nhau. Bạn có kế hoạch tạo các mạng con của địa chỉ sau để phục vụ giao tiếp nối tiếp giữa tất cả các bộ định tuyến: Bộ định tuyến Giao tiếp nối tiếp: 199.210.121.160/28

## Hạn chế
Bạn rất thận trọng quyết định mô phỏng cấu trúc liên kết trên Cisco Packet Tracer để thiết kế mạng một cách tối ưu có xem xét đến số lượng thiết bị (thiết bị chuyển mạch, bộ định tuyến, v.v.) được sử dụng để tối đa hóa biên lợi nhuận của công ty bạn. Tuy nhiên, bạn phải mô phỏng cấu trúc liên kết tuân thủ nghiêm ngặt các quy tắc và quy định được mô tả bên dưới:

1. Sử dụng dây Thẳng, cáp Chéo hoặc dây DCE Nối tiếp khi cần thiết và có thể áp dụng.
2. Sử dụng Bộ định tuyến Chung và Máy tính Chung cho thiết kế của bạn
3. Sử dụng Công tắc Chung để bạn chỉ gắn 3 trong số 4 Giao diện Ethernet khả dụng cho một công tắc duy nhất, tuy nhiên, bạn có thể gắn bao nhiêu thiết bị chuyển mạch theo thiết kế tối ưu
4. Bạn phải gán IP cho các PC bằng cách sử dụng cấp phát IP tĩnh
5. Mặc dù bạn phải sử dụng GUI của bộ định tuyến để định cấu hình các giao diện của nó nhưng bạn phải sử dụng CLI của bộ định tuyến để định cấu hình Giao thức RIPv2 cho Địa chỉ mạng con không phân lớp

## Cách chạy
Cài đặt [Cisco Packet Tracer](https://www.netacad.com/courses/packet-tracer) và sau đó chỉ cần mở [file.pkt](https://github.com/harismuneer/Network-Simulation-Using-Cisco-Packet-Tracer/blob/master/main/main%20file.pkt) chính. Toàn bộ mạng đang trong tình trạng hoạt động. Bạn có thể kiểm tra nó bằng cách gửi một gói từ hệ thống này sang hệ thống khác hoặc thông qua lệnh PING trong Cisco Packet Tracer

Giải pháp này hoạt động cho phiên bản 6.2 trở lên của Cisco Packet Tracer.

## Thanks :D
