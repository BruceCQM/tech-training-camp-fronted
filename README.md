# tech-training-camp-fronted
字节前端训练营大作业Markdown

# 项目介绍

该项目实现了一个Markdown编辑器，项目功能主要如下：
- 支持最基础的Markdown语法格式
- 实时渲染Markdown语法为HTML格式
- 提供工具栏按钮进行操作，方便不熟悉Markdown语法的用户（暂未实现对选中文字的操作，只实现了在光标处直接插入）

实现的Markdown语法：
- 标题
- 粗体
- 斜体
- 引用
- 图片
- 链接
- 代码高亮
- 多行代码块
- 分割线
- 无序列表（暂时不支持列表的嵌套）
- 有序列表

项目效果图：（外观参照了作业部落的Markdown编辑器）
![image](https://user-images.githubusercontent.com/74523362/111494177-38e11600-8779-11eb-9114-c183fed4893c.png)

# 项目主要技术
- 项目主要使用html, css, javascript实现
- 为了美化界面，使用bootstrap进行UI设计

# 项目主要思路
- 界面布局：顶部是一个div区域，放置操作按钮；左侧是一个textarea，进行输入；右侧为一个div区域，显示解析渲染效果
- 实时渲染：为textarea绑定oninput事件，当其内容发生改变时，重新解析Markdown文本，转换为HTML
- Markdown语法解析：主要采用正则表达式。将输入内容按照换行符进行分割，分别对每一行的内容利用正则表达式进行匹配，随后转换为相对应的HTML标签
- 工具栏按钮：目前只实现了点击按钮往光标处插入对应的Markdown文本。使用了bootstrap的按钮样式和字体图标，当点击按钮后，首先获取textarea光标所在位置，随后插入相应的Markdown文本，会自动选中需要用户修改的文字，再手动调用textarea的oninput事件，解析并渲染
