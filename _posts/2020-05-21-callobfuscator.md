---
title: CallObfuscator
date: 4/8/2021
layout: single
header:
  teaser: https://raw.githubusercontent.com/d35ha/CallObfuscator/master/Images/pic6.png
--- 

## CallObfuscator
Tác giả: d35ha

Làm xáo trộn (ẩn) các nhập PE từ các công cụ phân tích tĩnh/động.

## Theory
Điều này khá thuận lợi, giả sử tôi đã sử dụng `VirtualProtect` và tôi muốn làm xáo trộn nó với `Sleep`, công cụ sẽ thao tác IAT sao cho dấu hiệu trỏ đến `VirtualProtect` sẽ trỏ đến `Sleep` thay vì thực thi tệp, trình tải cửa sổ sẽ tải `Sleep` thay vì `VirtualProtect` và di chuyển quá trình thực thi đến điểm nhập, từ đó việc thực thi sẽ được chuyển hướng đến `shellcode`, công cụ đã đặt trước đó, để tìm địa chỉ của `VirtualProtect` và sử dụng nó để thay thế địa chỉ của Sleep được gán trước đó bởi bộ nạp

## How To Use
Có thể được bao gồm trực tiếp như một thư viện, hãy xem đoạn mã sau (dựa trên ví dụ), bạn cũng có thể xem qua [cli.cpp](https://github.com/d35ha/CallObfuscator/blob/master/cli/cli.cpp)

```cpp
#include <cobf.hpp>

int main() {
	cobf obf_file = cobf("sample.exe");
	obf_file.load_pe();
	obf_file.obf_sym("kernel32.dll", "SetLastError", "Beep");
	obf_file.obf_sym("kernel32.dll", "GetLastError", "GetACP");
	obf_file.generate("sample_obfuscated.exe");
	obf_file.unload_pe();
	return 0;
};
```
+ Cũng có thể được sử dụng như một công cụ dòng lệnh bằng cách cung cấp cho nó đường dẫn PE đầu vào, đường dẫn PE đầu ra và  tùy chọn đường dẫn đến tệp cấu hình (mặc định là `config.ini`).
`cobf.exe <input file> <out file> [config file]`
+ Tệp cấu hình chứa các obfuscations cần thiết (dlls, ký hiệu, ...)
+ Đây là một mẫu cho conten tệp cấu hình

```ini
; Template for the config file:
; 	* Sections can be written as:
; 		[dll_name]
; 		old_sym=new_sym
;	* The dll name is case insensitive, but 
;	the old and the new symbols are not.
; 	* You can use the wildcard on both the
; 	dll name and the old symbol.
; 	* You can use '#' at the start of
; 	the old or the new symbol to flag 
; 	an ordinal.
;	* The new symbol should be exported
;	by the dll so the windows loader can resolve it.
; For example:
; 	* Obfuscating all of the symbols
;	imported from user32.dll with ordinal 1600.
[user32.dll]
*=#1600
;	* Obfuscating symbols imported from both
;	kernel32.dll and kernelbase.dll with Sleep.
[kernel*.dll]
*=Sleep
;	* Obfuscating fprintf with exit.
[*]
fprintf=exit
```
## Example
Xây dựng mẫu mã này
```cpp
#include <windows.h>
#include <stdio.h>

int main() {
	SetLastError(5);
	printf("Last error is %d\n", GetLastError());
	return 0;
};
```
Sau khi xây dựng nó, đây là cách nhập kernel32 trông như thế nào

![1](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic1.png)

Bây giờ chúng ta hãy làm xáo trộn cả `SetLastError` và `GetLastError` bằng `Beep` và `GetACP` (thực tế thì bất kỳ api nào từ kernel32 cũng sẽ ổn ngay cả khi nó không được nhập gì cả). Các cấu hình được sử dụng là

```ini
[kernel32.dll]
SetLastError=Beep
GetLastError=GetACP
```
Đây là đầu ra (bạn cũng có thể sử dụng thư viện trực tiếp như hình trên)

![2](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic2.png)

Một lần nữa chúng ta hãy xem xét các lần nhập kernel32

![3](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic3.png)

Không có sự tồn tại của SetLastError hoặc GetLastError
Xác nhận rằng hai tệp sẽ hoạt động bình thường

![4](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic4.png)

## Impact
IDA HexRays Decompiler

![5](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic5.png)

IDA Debugger

![6](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic6.png)

Ghidra

![7](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic7.png)

ApiMonitor

![8](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic8.png)

Đó là bởi vì tất cả các công cụ phân tích tĩnh phụ thuộc vào tên api được viết tại IAT là gì có thể được thao tác như được hiển thị.
Đối với ApiMonitor, do sử dụng IAT hooking, vấn đề tương tự cũng tồn tại.
Mặt khác, đối với các công cụ như x64dbg, tên api được hiển thị sẽ chỉ phụ thuộc vào những gì thực sự được gọi (không phải những gì được viết tại IAT).

![9](https://github.com/d35ha/CallObfuscator/raw/master/Images/pic9.png)

## Additional
+ Việc đưa PE bị xáo trộn ra khỏi bộ nhớ sẽ không làm xáo trộn nó, vì IAT được thao tác sẽ giống nhau.
+ Mục đích chính của công cụ này là làm rối loạn quá trình phân tích (làm cho nó chậm hơn).
+ Người ta có thể xáo trộn bất kỳ ký hiệu đã nhập nào (theo tên hoặc theo thứ tự) với một ký hiệu khác (tên hoặc thứ tự).
+ Shellcode được thực thi dưới dạng lệnh gọi lại tls đầu tiên để xử lý các ký hiệu bị xáo trộn cần thiết bởi các lệnh gọi lại + tls khác trước khi điểm vào được thực thi.
+ Mã shellcode được vận chuyển dưới dạng mã c, được tạo ra khi công cụ được biên dịch để tạo điều kiện chỉnh sửa nó.
+ Các tên ký hiệu bị xáo trộn đang được giải quyết bằng hàm băm chứ không phải bằng tên trực tiếp.
+ Công cụ này vô hiệu hóa các vị trí và loại bỏ bất kỳ biểu tượng gỡ lỗi nào.
+ Công cụ tạo một phần rwx mới có tên `.cobf` để giữ mã shellcode và các dữ liệu cần thiết khác.
+ Nó có thể được sử dụng nhiều lần trên cùng một PE được xáo trộn.
+ Chỉ được thử nghiệm trên Windows 10 x64.
+ Lấy mã nguồn bằng `git clone https://github.com/d35ha/CallObfuscator`.
+ Tải xuống tệp nhị phân từ Phần [phát hành](https://github.com/d35ha/CallObfuscator/releases).

## ToDo
+ Shellcode obfuscation (có thể là với [obfusion](https://github.com/kgretzky/obfusion))  
+ Hỗ trợ các ký hiệu tải chậm
+ Giảm thiểu kích thước phần đã tạo
+ Biên dịch băm thời gian
+ Kiểm tra tốt hơn
