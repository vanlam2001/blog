---
title: Pantagrule
date: 29/8/2021
layout: single
header:
  teaser: https://opengraph.githubassets.com/23cb3696b69656a05b034fd8989cebcc37ef867e87358e4011aa6597a17cefcf/rarecoil/pantagrule
---

![1](https://opengraph.githubassets.com/23cb3696b69656a05b034fd8989cebcc37ef867e87358e4011aa6597a17cefcf/rarecoil/pantagrule)

## Mô Tả
Tác giả: rarecoil

Bộ quy tắc hashcat gargantuan được tạo từ mật khẩu bị xâm phạm

> Cảnh báo bảo trì dự án: Dự án này được coi là đã hoàn thành. Không có yêu cầu kéo hoặc thay đổi nào được thực hiện đối với dự án này trong tương lai trừ khi chúng là lỗi hoặc di chuyển thực sự để cho phép các quy tắc này hoạt động với các phiên bản mới hơn của hashcat.

Pantagrule là một loạt các quy tắc dành cho trình bẻ khóa mật khẩu [hashcat](https://hashcat.net/hashcat/) được tạo ra từ một lượng lớn dữ liệu xâm phạm mật khẩu trong thế giới thực. Mặc dù tệp quy tắc Pantagrule có thể lớn, các quy tắc đều có thể điều chỉnh và hoạt động tốt hơn nhiều bộ quy tắc hiện có

Pantagrule được tạo bằng thuật toán Đường dẫn ngược Levenshtein của [PACK](https://github.com/iphelix/pack/blob/master/rulegen.py) để tạo quy tắc tự động (Kacherginsky, 2013). Đầu ra của PACK sau đó được sắp xếp dựa trên số lần PACK tạo quy tắc để tạo bộ quy tắc cơ sở. Quá trình này tương tự như các quy tắc do [_NSAKEY](https://github.com/NSAKEY/nsa-rules) tạo ra cho các cuộc thi bẻ khóa mật khẩu vào năm 2014 (_NSAKEY, 2014), tuy nhiên, Pantagrule được tạo ra từ một bộ mật khẩu lớn hơn đáng kể. Phiên bản 2 của Pantagrule được phát triển dựa trên kho ngữ liệu hashes.org "founds" có sẵn công khai, một danh sách từ công khai tốt nhất trong lớp. Điều này mang lại kết quả minh bạch hơn so với biến thể ban đầu, sử dụng kho tài liệu độc quyền chứa 842.643.513 mật khẩu duy nhất

Khi các bộ quy tắc lớn như vậy được cung cấp thông qua PACK, hàng triệu quy tắc sẽ dẫn đến. Tuy nhiên, vì hầu hết các quy tắc được tạo chỉ xuất hiện một số ít lần, nên hầu hết các quy tắc hữu ích là những quy tắc thường được tạo ra bởi thuật toán. Kho lưu trữ này chứa một tập hợp con các quy tắc được tạo bởi PACK trong khi lặp qua kho lưu trữ hiện có

## Các biến thể được tối ưu hóa
Để tạo tối ưu hóa lần thứ hai của các quy tắc dựa trên dữ liệu trong thế giới thực, một triệu quy tắc được tạo hàng đầu đã được chạy dựa trên danh sách Pwned Passwords NTLM bằng cách sử dụng danh sách từ rockou. Bất kỳ quy tắc nào bẻ khóa mật khẩu đều được thêm vào danh sách của chính nó và các quy tắc hoạt động kém hơn sẽ bị loại bỏ

Bốn loại tối ưu hóa đã được tạo:

+ `popular.rule`: pantagrule.1m chạy với 25.000.000 mật khẩu hàng đầu của bộ HIBP.

+ `random.rule`: pantagrule.1m chạy với 25.000.000 mật khẩu được chọn ngẫu nhiên từ bộ HIBP.

+ `hybrid.rule`: Danh sách được sắp xếp gồm sự kết hợp của các quy tắc ngẫu nhiên và phổ biến thành công nhất, sau đó được cắt làm đôi, nhằm tạo ra một bộ quy tắc "cân bằng" nhẹ hơn, hoạt động trên một tập mẫu lớn hơn.

+ `one.rule`:Một phiên bản của OneRuleToRuleThemAll trong đó các quy tắc kết hợp hoạt động hàng đầu được thêm vào và danh sách được cắt ngắn theo kích thước của bộ quy tắc bổ sung. Điều thú vị là chỉ có một vài nghìn quy tắc trùng lặp với các quy tắc OneRuleToRuleThemAll và Pantagrule, làm cho hai chiến lược này bổ sung cho nhau. Pantagrule của một hoạt động tốt hơn so với các danh sách đã biết khác có kích thước này và bạn nên bắt đầu với bộ quy tắc này trước khi thử một trong các biến thể lớn hơn

## Pantagrule hashorg.v6
> Sau sự thành công của các bộ quy tắc lớn này, một nỗ lực đã được thực hiện nhằm tạo ra sự nghịch đảo của biến thể royce, trong đó phương pháp Pantagrule ban đầu đã được sử dụng nhưng cả hai bộ dữ liệu đều khác nhau. Pantagrule hiện sử dụng danh sách "founds" hashes.org công khai làm cơ sở danh sách từ của nó để tạo quy tắc và sau đó đã thực hiện vượt qua tối ưu hóa dựa trên danh sách V6 NTLM từ Have I Been Pwned. Với tính chất công khai hoàn toàn của dữ liệu được sử dụng, nó cũng cho phép xuất bản dữ liệu tái lập thô, bao gồm `pantagrule.v2.1m.rule`, là một triệu quy tắc hàng đầu được tạo ra bởi phương pháp này. Dữ liệu cho V5 và V6 giống nhau đối với 25 triệu mật khẩu hàng đầu

Đối với phiên bản này, cách tạo một phiên bản đã thay đổi. Để tạo một danh sách, danh sách 1 triệu đầy đủ đã được thêm vào `OneRuleToRuleThemAll.rule` và sau đó toàn bộ tập hợp được hiệu chỉnh trên Pwned V6, so với chỉ thêm các quy tắc và cắt bớt

Các quy ước đặt tên cho các quy tắc hiện đã thay đổi thành định dạng `pantagrule.${Corpus}.${Trainingversion}.${Extension}` Điều này giúp bạn dễ dàng hiểu quy tắc được tối ưu hóa cho mục đích gì. Ví dụ: đối với `pantagrule.hashorg.v6.random`, Tác giả đã sử dụng phương pháp ngẫu nhiên với hashes.org làm cơ sở cho việc tạo quy tắc, được tối ưu hóa trên Pwned Passwords V6

## Quy tắc ban đầu
Các quy tắc ban đầu đã được đào tạo bằng cách sử dụng danh sách từ độc quyền cùng với bộ Pwned Passwords NTLM v5 sử dụng `rockou.txt` làm cơ sở. Vì "dữ liệu đào tạo" và dữ liệu xác thực giống nhau, sẽ rất hợp lý nếu chúng được tối ưu hóa cho tập dữ liệu V5

## Các biến thể của royce

> Theo yêu cầu của người đóng góp cho hashcat, [Royce Williams](https://github.com/roycewilliams), việc tối ưu hóa một triệu quy tắc hàng đầu cũng đã được thực hiện với danh sách các thành viên của hashes.org. Điều này là do kho ngữ liệu HIBP tương đối bẩn và [danh sách các founds trên hashes.org](https://github.com/rarecoil/hashes.org-list) có khả năng mang lại một bộ quy tắc thiết thực hơn cho việc bẻ khóa trong thế giới thực. Chúng đã được thêm vào dưới dạng các biến thể của `royce`. Các tối ưu hóa của `royce` dường như bao gồm ít quy tắc hơn một chút về tổng thể, và `random.royce` về cơ bản hiệu quả hơn trên một đuôi dài của các mật khẩu so với ngẫu nhiên ban đầu. Hiệu suất không tăng so với các quy tắc hiện có trên một số biến thể, nhưng do dữ liệu đào tạo và xác thực của Pantagrule ban đầu đều từ tập dữ liệu Pwned Passwords, điều này có vẻ không đáng ngạc nhiên. Các biến thể `royce` Pantagrule tồn tại trong thư mục quy tắc `royce`

## Hiệu suất so với các quy tắc thường dùng khác
Để kiểm tra bất kỳ thành công nào của chiến lược Pantagrule so với các bộ quy tắc khác,  chạy dữ liệu xác thực trên 25 triệu mật khẩu hàng đầu của Pwned Passwords V5 và 100 triệu mật khẩu hàng đầu của Pwned Passwords V5 để hiểu được hiệu quả của quy tắc khi bẻ khóa " đuôi dài "với mỗi bộ quy tắc. Canonical `rockou.txt` sẽ là từ điển của tác giả và là cơ sở 

Thế hệ biến thể ban đầu được thực hiện trên giàn 8x 1070Ti chạy hashcat v5.1.0. Các biến thể của `royce` Pantagrule được tạo ra trên giàn [4x Radeon VII](https://gist.github.com/rarecoil/54340280d81528dcb024ef5df2535c86) chạy hashcat git build v5.1.0-1774-gf96594ef. Các biến thể hashorg.v6 đã được tạo và xác thực (rất chậm) trên một [NVIDIA Tesla M4](https://www.techpowerup.com/gpu-specs/tesla-m4.c2770), một 1070Ti và hashcat v6.1.0

Để lưu ý hiệu suất của quy tắc đối với các mật khẩu rất phổ biến, 0-25M được chia thành cột riêng của nó. Cột RPP là các quy tắc trên phần trăm trên tập dữ liệu 100M. Điều này được tính bằng cách sử dụng công thức `rpp = Math.round(num_rules /(0_100m_percent - 6.450))`. Con số này càng cao, càng có nhiều quy tắc được chạy trên mỗi phần trăm bị bẻ khóa. Điều này giúp nhận ra lợi nhuận giảm dần trong các bộ quy tắc và đưa ra ý tưởng về chi phí khuếch đại của việc chạy các quy tắc trên các hàm băm chậm hơn

| Rules        | Number of Rules | V5 25M     | V5 100M | RPP |
|----------------|-----------------|-----------|--------|-----|
| No Rules (just rockyou.txt) | 0 | 16.549% | 6.450% | N/A |
| pantagrule.private.v5.one | 99,092 | 79.814% |69.417% | 1,574 |
| pantagrule.private.v5.hybrid | 355,205 | 81.346% | 73.372% | 5,308 |
| pantagrule.private.v5.popular | 478,736 | **81.792%** | 73.544% | 7,135 |
| pantagrule.private.v5.random | 616,236 | 81.687% | 69.805% | 8,828 |
| pantagrule.hashorg.v6.one | 99,092 | 74.500% | 60.573% | 1,831 |
| pantagrule.hashorg.v6.hybrid | 339,953 | 77.649% |  68.341% | 5,493 |
| pantagrule.hashorg.v6.popular | 514,416 | 80.668% | 72.377% | 6,931 |
| pantagrule.hashorg.v6.random | 638,773 | 80.603% | 72.713% | 8,614 |
| pantagrule.private.hashorg.one.royce | 99,092 | 79.618% | 69.092% | 1,582 |
| pantagrule.private.hashorg.hybrid.royce | 314,268 | 81.068% | 73.082% | 4,716 |
| pantagrule.private.hashorg.popular.royce | 420,984 | 81.386% |  73.102% | 6,316 |
| pantagrule.private.hashorg.random.royce | 592,235 | 81.659% | **74.010%** | 8,766 |
| [best64](https://github.com/hashcat/hashcat/blob/master/rules/best64.rule) | 64 | 45.117% |24.985% | 3 |
| [hob064](https://github.com/praetorian-code/Hob0Rules) | 68 | 37.786% | 19.773% | 5 |
| [OneRuleToRuleThemAll](https://github.com/NotSoSecure/password_cracking_rules) | 52,014 | 78.058% | 64.541% | 895 |
| [d3adhob0](https://github.com/praetorian-code/Hob0Rules) | 57,548 |  51.274% |  34.800% | 2,030 |
| [dive](https://github.com/hashcat/hashcat/blob/master/rules/dive.rule) | 99,092 | 77.111% | 63.314% | 1,743 |
| [_NSAKEY V1](https://github.com/NSAKEY/nsa-rules/blob/master/_NSAKEY.v1.dive.rule) | 123,289 | 76.42% | 64.121% | 2,138 |
| [_NSAKEY V2](https://github.com/NSAKEY/nsa-rules/blob/master/_NSAKEY.v2.dive.rule) | 123,289 | 76.882% | 64.472% | 2,124 |

## Kết luận
Công trình này xác nhận những hạn chế của thuật toán PACK LRP ban đầu được _NSAKEY chứng kiến trên các tập dữ liệu hiện đại khi sử dụng từ điển Rockou. Mặc dù thuật toán LRP tạo ra các quy tắc làm tăng tỷ lệ bẻ khóa, nhưng nó lại làm như vậy với sự gia tăng lớn về không gian tìm kiếm. Vì lý do này, Pantagrule hữu ích nhất trong những trường hợp khó bẻ khóa đòi hỏi các quy tắc kỳ lạ.

Điều quan trọng cần lưu ý là nếu bạn có thể sử dụng PACK để tạo các quy tắc dựa trên một kho dữ liệu cụ thể và sau đó nhắm mục tiêu các hàm băm còn lại của bạn với nó, bạn có khả năng mang lại tỷ lệ bẻ khóa lớn hơn so với việc sử dụng một trong các bộ quy tắc lớn này. Ví dụ: Pantagrule V2 không hoạt động tốt trên PPv5 như bộ quy tắc được hiệu chỉnh v5

Kể từ bản phát hành Pantagrule ban đầu, các quy tắc này đã tự chứng minh trên nhiều cam kết của đội đỏ tại các công ty công nghệ lớn và các đơn vị tư vấn như nhau. Danh sách `pantagrule.1m` ban đầu đã bẻ khóa 8% số băm HIBP còn lại phù hợp với kho dữ liệu được sử dụng để tạo Pantagrule, các bộ quy tắc phổ biến ở trên, lực lượng brute gồm 7 ký tự chữ và số và các cấu trúc liên kết [PathWell](https://blog.korelogic.com/blog/2014/04/04/pathwell_topologies) của KoreLogic

Ngay cả tác giả của Quy tắc tổng hợp Một quy tắc để cai trị cho tất cả (Hunt, 2017) đã tuyên bố, không có quy tắc nào hoạt động tốt hơn những quy tắc khác. Mỗi trường hợp sử dụng đều khác nhau và mọi nguồn quy tắc có thể giúp bạn nhiều hơn một nguồn khác trên một kết xuất băm cụ thể hoặc với một danh sách từ cụ thể. Lưu ý rằng dữ liệu này không hiển thị những gì đã bị bẻ khóa; một số quy tắc đã bẻ khóa hàm băm mà các quy tắc khác không

## Trích dẫn
1. Rabelais, F. (1532). [Pantagruel](https://en.wikipedia.org/wiki/Gargantua_and_Pantagruel). Paris: Libr. générale française.

2. _NSAKEY. (2014). NSAKEY/nsa-rules. [online] Available at: [NSAKEY/nsa-rules](https://github.com/NSAKEY/nsa-rules) [Accessed 4 Oct. 2019].

3. Hunt, W. (2017). One Rule to Rule Them All. [online] Available at: [https://www.notsosecure.com/one-rule-to-rule-them-all/](https://notsosecure.com/one-rule-to-rule-them-all/) [Accessed 4 Oct. 2019].

## Giấy phép
Các quy tắc của Pantagrule được phát hành theo giấy phép của MIT. Hãy tích hợp chúng vào công cụ của riêng bạn
