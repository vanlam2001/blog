---
title: Vulmap-Windows
date: 7/8/2021
layout: single
header:
  teaser: https://raw.githubusercontent.com/vulmon/Vulmap/master/Vulmap-Windows/vulmap-logo.png
--- 

## Vulmap Windows
Tác giả: vulmon

Máy quét lỗ hổng cục bộ trực tuyến dành cho hệ thống Windows. Tìm phần mềm đã cài đặt trên máy chủ lưu trữ, hỏi các lỗ hổng của chúng đối với API vulmon.com và in các lỗ hổng bằng các cách khai thác có sẵn. Tất cả các khai thác được tìm thấy có thể được tải xuống bằng Vulmap

Vulmap Windows là một phần của Dự án [máy quét lỗ hổng cục bộ trực tuyến Vulmap](https://github.com/vulmon/Vulmap)

Vulmap-[Windows](https://github.com/vulmon/Vulmap/blob/master/Vulmap-Windows)
## Ảnh chụp màn hình
![1](https://raw.githubusercontent.com/vulmon/Vulmap/master/Vulmap-Windows/bir.jpg)

![2](https://raw.githubusercontent.com/vulmon/Vulmap/master/Vulmap-Windows/iki.jpg)

## Sử dụng
Cách sử dụng được đề xuất là dán mã tại (https://github.com/vulmon/Vulmap/blob/master/Vulmap-Windows/vulmap-windows.ps1)[https://github.com/vulmon/Vulmap/blob/master/Vulmap-Windows/vulmap-windows.ps1] hoặc lệnh bên dưới vào thiết bị đầu cuối powershell

```powershell
iex(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/vulmon/Vulmap/master/Vulmap-Windows/vulmap-windows.ps1')
```

Nếu bạn không có quyền truy cập vào powershell nhưng CMD, lệnh dưới đây có thể được sử dụng trên CMD

```powershell
powershell -nop -c "iex(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/vulmon/Vulmap/master/Vulmap-Windows/vulmap-windows.ps1')"
```
[![usage gif](https://raw.githubusercontent.com/vulmon/Vulmap/master/Vulmap-Windows/uc.gif)](https://www.youtube.com/watch?v=y39w9WYYnmI)

Parameter                     | Description
------------------------------| -------------
-OnlyExploitableVulns         | Conducts a vulnerability scanning and only shows vulnerabilities that have exploits.
-DownloadExploit <exploit_id> | Downloads given exploit.
-DownloadAllExploits          | Scans the computer and downloads all available exploits.
-ReadFromFile                 | Uses software inventory file rather than scanning local computer.
-SaveInventoryFile            | Saves software inventory file. Enabled automatically when Mode is 'CollectInventory'.
-InventoryInFile              | Input JSON file name referred by SaveInventoryFile. Default is 'inventory.json'.
-InventoryOutFile             | Output JSON file name referred by ReadFromFile. Default is 'inventory.json'.
-Proxy                        | Defines an HTTP proxy. (-Proxy http://localhost:8080)

## Các ví dụ
* Chế độ mặc định. Tiến hành quét lỗ hổng bảo mật:
```powershell
PS> Invoke-Vulmap
```

* Tiến hành quét lỗ hổng bảo mật và chỉ hiển thị các lỗ hổng đã khai thác:
```powershell
PS> Invoke-Vulmap -OnlyExploitableVulns
```

* Các lượt tải xuống được cung cấp khai thác:
```powershell
PS> Invoke-Vulmap -DownloadExploit EDB9386
```

* Quét máy tính và tải xuống tất cả các khai thác có sẵn:
```powershell
PS> Invoke-Vulmap -DownloadAllExploits
```

* Thu thập kho phần mềm nhưng không tiến hành quét lỗ hổng bảo mật. Khoảng không quảng cáo phần mềm sẽ được lưu dưới dạng 'stock.json' theo mặc định:
```powershell
PS> Invoke-Vulmap -Mode CollectInventory
```

* Thu thập khoảng không quảng cáo phần mềm và lưu nó với tên tệp nhất định. Không tiến hành quét lỗ hổng bảo mật:
```powershell
PS> Invoke-Vulmap -Mode CollectInventory -InventoryOutFile pc0001.json
```

* Tiến hành quét lỗ hổng bảo mật và lưu khoảng không quảng cáo phần mềm vào tệp stock.json:
```powershell
PS> Invoke-Vulmap -SaveInventoryFile
```

* Tiến hành quét lỗ hổng bảo mật và lưu khoảng không quảng cáo phần mềm vào tên tệp nhất định:
```powershell
PS> Invoke-Vulmap -SaveInventoryFile -InventoryOutFile pc0001.json
```

* Tiến hành quét lỗ hổng bảo mật dựa trên kho phần mềm từ tệp. Khoảng không quảng cáo phần mềm sẽ được tải từ 'stock.json' theo mặc định:
```powershell
PS> Invoke-Vulmap -ReadFromFile
```

* Tiến hành quét lỗ hổng bảo mật dựa trên tệp kiểm kê phần mềm được tải từ tên tệp nhất định:
```powershell
PS> Invoke-Vulmap -ReadFromFile -InventoryInFile pc0001.json
```

* Tiến hành quét lỗ hổng bảo mật thông qua proxy HTTP:
```powershell
PS> Invoke-Vulmap -Proxy http://127.0.0.1:8080
```
## Nền tảng đề xuất
Tương thích với PowerShell v3 và cao hơn
## Thanks :D
