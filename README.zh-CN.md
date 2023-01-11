<h1>Snippets Manager</h1>

[English](./README.md) | 简体中文

![snippets group tree](./media/snippets.gif)

轻松创建和管理代码片段。

## 功能

- [x] 支持对代码片段进行分组。
- [x] 通过侧边栏形式，可视化管理代码片段分组。
- [x] 支持将选中的内容生成代码片段。
- [x] 支持自动检测代码片段对应的编程语言.

## 如何使用
1. 首先，选中你想转换为代码片段的代码。
2. 按下 `cmd+k`，接着按下 `shift+cmd+s`，此时会进入到代码片段编辑状态.
3. 编辑代码片段内容：
  - `group`：代码片段分组名称，比如 `projectA`
  - `scope`：代码片段生效范围，比如 `javascript`，不填时任何文件里都可使用该代码片段。
  - `prefix`：代码片段的缩写，比如 `log`
  - `description`：代码片段的详细描述。
  - 其他内容均为代码片段内容，例如：
    ```javascript
    /* eslint-disable */
    // @group javascript
    // @scope javascript
    // @prefix forEach
    // @description array forEach
    ${1:array}.forEach(${2:element} => {
      ${3:// do something with element}
    });
    ```
    其中 `$` 语法是 `VSCode` 代码片段语法，比如 `$1` 表示光标处在的第一个位置，通过 `Tab` 键可以切换到下一个输入位置，`${1:array}` 是对第一个位置设置占位内容。
4. 最后，按下 `cmd+s` 保存代码片段，此时就能在侧边栏分组中看到相应的代码片段。

## License
MIT
