# Smidig-Kolonial
Smidig prosjekt - Kolonial

## Overview
 - [Download and Install](#download_and_install)
   - [Requirements](#requirements)
   - [Download as ZIP](#download-as-zip)
   - [Download using Git](#download-using-git)
   - [Use copy from itslearning delivery](#Use-copy-from-itslearning-delivery)
   - [Install and run](#install-and-run)
 - [I don't want to install anything](#I-don-t-want-to-install-anything)
 - [How do I login?](#how-do-i-login-)
 - [Additional notes](#additional-notes)

## Download and Install

---

### Requirements

Your going to need [NodeJS](https://nodejs.org/en/ "NodeJS Home Page") version 8.9.4 or later. You will also need Git, [GitHub Desktop](https://desktop.github.com/ "GitHub Desktop Home Page") is easy to use tool for this. You will also need a file from the our delivery on itslearning.

---

### Download as Zip
##### <div align="right"><sub> [:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>

> - Head to the [GitHub Repository](https://github.com/Westerdals/PRO200-17-17) and find the green button that says `Clone or download` and click it.  
> ![Image pointing to a green button saying "Clone or download"](https://puu.sh/AEy1Q/21c444b9f3.png)
>
> - Now click `Download ZIP`.  
> ![Image pointing to a button saying "Download ZIP"](https://puu.sh/AEy78/328a0dd9c2.png)
>
> - Now go to where you downloaded it to and open it (double click).  
> ![Find and open the .zip file](https://puu.sh/AEygE/e4aa323052.png)
>
> - Extract the folder in the .zip to any anywhere you like on your computer. When its extracted go ahead and open it.  
> ![Extract content to Desktop](https://puu.sh/AEyl7/0361b15157.png)
> ![Open the extracted folder](https://puu.sh/AEyrN/8cc79a65e2.png)
>

---

### Download using Git
##### <div align="right"><sub> [:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>

> - Head to the [GitHub Repository](https://github.com/Westerdals/PRO200-17-17) and find the green button that says `Clone or download` and click it.  
> ![Image pointing to a green button saying "Clone or download"](https://puu.sh/AEy1Q/21c444b9f3.png)
>
> - Now click `Open in Desktop`  
> ![Click "Open in Desktop"](https://puu.sh/AEzP1/bc0fe01a9c.png)
> 
> - The GitHub Desktop app will open. Now you may choose where you want to clone the repository to. Then click the button saying `Clone`.  
> ![Clone to selected folder](https://puu.sh/AEA1s/6f0596cd68.png)
>

---

### Use copy from itslearning delivery
##### <div align="right"><sub> [:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>

If you have our itslearning delivery and don't want to download from github, you can use the copy included in this delivery. You are still bound by the above [requirements](#requirements), but don't need to download anything from the github repository.

To set it up, just move or copy the included copy anywhere you want on your computer. And follow the [install and run](#install-and-run--arrow_heading_up-back-to-top) section.

---

### Install and run
##### <div align="right"><sub> [:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>

> - You need to find the file called `tokens.json` in our itslearning delivery, and copy it to the `configs` folder.  
> ![Image of the 'configs' folder](https://puu.sh/AEA83/0d587ad047.png)
>
> - Next up. Go to `Runnables => <win|unix>` (win is for windows, unix is for mac and linux) and run (double click) the `Install` file. You will see a terminal/console open that's the installer don't close it.  
> ![Go to install file and run it](https://puu.sh/AEySf/bcaff6458b.png)
>
> - Now run the `RunServer` file. Your browser should open and go to the web page automatically.  
> ![Server and Client running](https://puu.sh/AEzGM/f0d4ade7c7.png)
>

---

## I don't want to install anything
##### <div align="right"><sub> [:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>

That's just fine we have uploaded the product to a live [web-server](https://planleggeren.azurewebsites.net/). Now the site is somewhat slow so be patient with it. It's also recommended to still read the [adidtional notes](#additional-notes).

---

## How do I login?
##### <div align="right"><sub> [:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>

There is no way to register a new user. So, you will need to use an already registered one. You can pick from the one below.

| Username/Email-address | Password | Note |
|------------------------|----------|------|
| test@test.com          | Test1234 | This is out test user and may have some shopping-lists already saved |
| test1@test.com         | Test1    |      |
| test2@test.com         | Test2    |      |
| test3@test.com         | Test3    |      |

All usernames and password are case sensitive so make sure you input them correctly.

There is also no way to log out, other than to manually go to the url:   
`host`/user/logout   
Where `host` is the domain and port in the case of the live web-server this will be `planleggeren.azurewebsites.net` or in the case of a local server `localhost:3000`  

---

## Additional notes
##### <div align="right"><sub> [:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>

Our website was made to best fit a mobile phone. If you are using a computer you can still simulate this in your browser (provided you are using `Googlge Chrome`). Though the functionality is the same either way, but the styling is not intended for a desktop experience. Here is a short "how to" tutorial for simulating a phone in your `Google Chrome` browser.  

> - Either press `Ctrl + Shift + i` or right click anywhere on the page and select `Inspect` or `Inspiser`.  
> ![Open dev tools](https://puu.sh/AEApU/9707061859.png)
>
> - Now that you have opend the dev tools click the little mobile/tablet icon in the top left corner.  
> ![Enable phone/tablet mode](https://puu.sh/AEAtq/24e5a69646.png)
>
> - You can also select a device to emulate.  
> ![Select device to emulate](https://puu.sh/AEAxT/da3276e37d.png)

##### <div align="right"><sub>[:arrow_heading_up: Back to top](#smidig-kolonial)</sub></div>