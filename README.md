<h1>Snippets Manager</h1>

English | [简体中文](./README.zh-CN.md)
<!-- <p>
<a href="https://marketplace.visualstudio.com/items?itemName=promise96319.snippets-manager" target="__blank">
<img src="https://img.shields.io/visual-studio-marketplace/v/promise96319.snippets-manager.svg?color=blue&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" />
</a><a href="https://marketplace.visualstudio.com/items?itemName=promise96319.snippets-manager" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/d/promise96319.snippets-manager.svg?color=4bdbe3" alt="Visual Studio Marketplace Downloads" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=promise96319.snippets-manager" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/i/promise96319.snippets-manager.svg?color=63ba83" alt="Visual Studio Marketplace Installs" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=promise96319.snippets-manager" target="__blank"><img src="https://vsmarketplacebadge.apphb.com/trending-monthly/promise96319.snippets-manager.svg?color=a1b858" alt="Marketplace Trending Monthly" /></a>
<br/>
<a href="https://github.com/promise96319/snippets-manager" target="__blank"><img src="https://img.shields.io/github/last-commit/promise96319/snippets-manager.svg?color=c977be" alt="GitHub last commit" /></a>
<a href="https://github.com/promise96319/snippets-manager/issues" target="__blank"><img src="https://img.shields.io/github/issues/promise96319/snippets-manager.svg?color=a38eed" alt="GitHub issues" /></a>
<a href="https://github.com/promise96319/snippets-manager" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/promise96319/snippets-manager?style=social"></a>
</p> -->

![Code snippets demo](./media/demo.gif)

Manage your code snippets in a super easy way!

## Features

- [x] Support easily generating code snippets from selected content.
- [x] Support grouping and managing code snippets.
- [x] Automatically detect the corresponding programming language for code snippets.
- [x] Support visual management of code snippet groups through directory structure.

## How to use
1. First, select the content you want to convert into a code snippet, such as:
  ![Select code](./media/select-code.jpg)
2. Press cmd+k, then press cmd+shift+s, enter the snippets shortcut and confirm.
  ![Enter prefix](./media/enter-prefix.jpg)
3. Edit the content:
  ![Edit content](./media/content.jpg)
    - `group`: the name of the group to which the code snippet belongs, such as `project-a`.
    - `scope`: the scope of the code snippet, such as `javascript`. When left blank, the code snippet can be used in any file.
    - `prefix`: the shortcut for the code snippet, such as log for console.log template.
    - `description`: the detailed content of the code snippet prompt. To use more syntax for code snippets, please refer to the [VSCode official documentation](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax).
4. Finally, press `cmd+s` to save the code snippet, and you will be able to see the corresponding code snippet shortcut in the sidebar grouping. Now, we can happily use the code snippets~
  ![Code snippets demo](./media/snippet.gif)

## License
MIT
