自研轻量化后台 全局UI统一规范 v1.0
一、规范前置说明
1. 适用范围
本规范适配：无框架自研原生后台、通用管理系统、企业内网、业务表单、数据中台项目；不依赖Layui、Element等第三方UI组件库，纯自研封装组件，适配Cursor/Copilot等AI编程生成代码，AI编写页面必须百分百遵循本规范。
2. 整体视觉定位
风格：经典扁平化商务后台、轻质感、低饱和度、方正规整、极简克制
调性：复刻原版Layui商务原生审美，不魔改组件形态、不新增异形按钮、不混搭圆角、不自定义非主流配色，全站组件视觉统一、交互质感统一，适配自研全局主题联动。
3. 强制禁令（开发+AI通用）
- 禁止脱离本规范，手写十六进制色值、自定义rgba弹窗底色、自定义按钮样式
- 禁止混用超大圆角、圆形卡片、渐变光影、磨砂玻璃、卡通样式
- 禁止随意修改全局字体、行高、表格边框、分割线粗细
- 禁止自定义非规范px边距，所有布局遵循全局4px基准网格
- 优先使用项目自研封装公共组件，禁止大面积手写div复刻表单、按钮、弹窗

---
二、全局色彩系统（沿用原版色系，无改动，脱离layui绑定）
全站固化CSS变量，全局直接调用，支持一键主题换色，无第三方组件库色值绑定
1. 品牌主题主色（商务青，全站唯一主色）
- --ui-primary：#009688 【全局主色】主按钮、选中tab、高亮文字、复选框、开关、导航激活态
- --ui-primary-light：#e6f7f5 主色浅底色、hover背景、标签浅色背景
- --ui-primary-dark：#007d70 主色加深、按钮点击下沉态
2. 业务功能状态色（通用后台标准功能色，不可替换）
- --ui-success：#5fb878 成功、提交完成、状态正常
- --ui-warning：#ffb800 警告、待审核、待处理、编辑提示
- --ui-danger：#ff5722 删除、禁用、报错、高危操作
- --ui-info：#8799a3 辅助文字、默认提示、次要图标
3. 全局中性灰度（页面背景、文字、边框、分割专用，全站统一）
- --ui-bg-page：#f2f2f2 【页面底层背景】全站统一页面底色
- --ui-bg-card：#ffffff 卡片、表单容器、弹窗白底
- --ui-border：#e6e6e6 常规边框、表格分割线、模块分界线
- --ui-border-dark：#d2d2d2  hover加深边框、输入框聚焦边框
- --ui-text-title：#333333 一级标题、模块标题、表格表头文字
- --ui-text-default：#666666 正文、表单label、常规内容文字
- --ui-text-aux：#999999 辅助小字、备注、占位文字、禁用文字

---
三、全局网格与间距系统（基准4px，完全沿用原版间距档位）
基准网格：4px，所有内边距、外边距、模块间隔、表单间距，只能使用以下档位，禁止写 5px/7px/10px 自定义值
- --ui-space-xs：4px 极小间距、单元格内留白、小字上下边距
- --ui-space-sm：8px 表单标签间距、小组件留白、按钮内边距最小档
- --ui-space-md：12px 通用留白、卡片内边距、弹窗内边距默认值
- --ui-space-lg：16px 模块外边距、页面板块间隔、大卡片留白
- --ui-space-xl：24px 页面区块分隔、大板块上下留白
栅格规则：自研12等分流式栅格布局，禁止手写百分比宽度排版，栅格单位适配4px基准网格

---
四、全局圆角规范（原版偏方正极简风格不变，无改动）
全站偏方正极简风格，圆角分级固化，禁止自定义任意圆角、border-radius:50%异形使用
- --ui-radius-none：0px 【默认原生】表格、模块外框、导航栏、侧边栏，纯直角
- --ui-radius-sm：2px 输入框、下拉选择、小型标签、次要按钮（全站小型组件默认圆角）
- --ui-radius-md：4px 弹窗、业务卡片、主按钮、搜索框（全站通用最大圆角）
- 禁用项：禁止8px及以上圆角、禁止全局圆形容器

---
五、全局阴影层级（复刻原版轻阴影，无厚重投影）
- --ui-shadow-none：none 表格、列表、常规模块，无阴影
- --ui-shadow-sm：0 1px 3px rgba(0,0,0,0.08) 下拉菜单、悬浮按钮轻投影
- --ui-shadow-md：0 2px 8px rgba(0,0,0,0.1) 弹窗、首页业务卡片专属阴影

---
六、全局字体排版规范（沿用原版字体、字号、字重，风格不变）
1. 全局字体栈（固定不可修改）
font-family: "Microsoft YaHei", Helvetica Neue, Helvetica, Arial, sans-serif;
2. 字号分级（沿用原版字号档位）
- --ui-font-min：12px 备注文字、表格小字、表单提示文案
- --ui-font-default：14px 全站默认正文、表单文字、表格内容（全站默认字号）
- --ui-font-title：16px 模块标题、弹窗标题、板块名称
- --ui-font-big：18px 页面一级大标题
3. 字重规则
- 常规文字：font-weight:400 常规
- 标题强调：font-weight:500 中等加粗
- 禁止：font-weight:700 粗黑体，破坏商务轻量化质感

---
七、核心组件统一UI细则（自研组件标准，风格对齐原版layui质感）
1. 按钮 Button
- 默认圆角：2px（--ui-radius-sm）
- 尺寸：统一自研三等尺寸：大号/中号/小号，禁止自定义宽高按钮
- 样式：三类固定状态：主色按钮、默认灰色按钮、危险按钮，无自定义配色按钮
- hover规则：仅底色深浅变色，不自定义hover光影、缩放、发光特效
2. 表单 Input/Select/Checkbox
- 统一圆角：2px，边框默认 --ui-border，聚焦边框 --ui-primary
- 表单模块间距：上下间距固定 --ui-space-md，label与输入框间距 --ui-space-sm
- 复选框、单选、开关统一自研样式，形态方正简约，禁止异形勾选组件
3. 数据表格 Table
- 全站边框式表格，表头底色固定#f8f8f8，不可修改
- 行hover浅底色高亮，禁止自定义高饱和高亮行颜色
- 表格圆角：0px直角，禁止给表格加圆角裁切
4. 全局弹窗
- 全局弹窗圆角固定：4px（--ui-radius-md）
- 弹窗阴影：统一使用 --ui-shadow-md
- 弹窗头部底色：固定#f8f8f8，禁止自定义彩色弹窗头部
5. 卡片模块 Card
- 底色：#ffffff，圆角4px，外边框1px solid var(--ui-border)
- 卡片内边距：固定 --ui-space-md
6. 导航、侧边栏
方正简约侧边导航，激活项主色为--ui-primary，白底浅分割线，禁止渐变、磨砂、彩色异形侧边栏

---
八、全局CSS根变量（重命名ui前缀，脱离layui，可直接复制使用）
/* 项目自研全局UI变量，全局引入即可生效，无第三方依赖 */
:root {
  /* 主题主色 */
  --ui-primary: #009688;
  --ui-primary-light: #e6f7f5;
  --ui-primary-dark: #007d70;
  /* 功能色 */
  --ui-success: #5fb878;
  --ui-warning: #ffb800;
  --ui-danger: #ff5722;
  --ui-info: #8799a3;
  /* 中性色 */
  --ui-bg-page: #f2f2f2;
  --ui-bg-card: #ffffff;
  --ui-border: #e6e6e6;
  --ui-border-dark: #d2d2d2;
  --ui-text-title: #333333;
  --ui-text-default: #666666;
  --ui-text-aux: #999999;
  /* 间距 */
  --ui-space-xs: 4px;
  --ui-space-sm: 8px;
  --ui-space-md: 12px;
  --ui-space-lg: 16px;
  --ui-space-xl: 24px;
  /* 圆角 */
  --ui-radius-none: 0px;
  --ui-radius-sm: 2px;
  --ui-radius-md: 4px;
  /* 阴影 */
  --ui-shadow-none: none;
  --ui-shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --ui-shadow-md: 0 2px 8px rgba(0,0,0,0.1);
  /* 字体 */
  --ui-font-min: 12px;
  --ui-font-default: 14px;
  --ui-font-title: 16px;
  --ui-font-big: 18px;
  --ui-font-family: "Microsoft YaHei", Helvetica Neue, Helvetica, Arial, sans-serif;
}


---
九、AI专属强制编码规则（复制给AI全局prompt直接生效）
AI编写本自研后台项目页面，必须遵守以下硬性规则：
1. 所有颜色、圆角、间距、阴影，只能调用项目:root内ui开头全局变量，禁止手写#色值、rgba、自定义px圆角
2. 页面布局优先使用项目自研栅格、自研封装公共组件，禁止大面积手写div复刻表单、弹窗、按钮
3. 所有按钮、输入框、表格、弹窗形态严格贴合本规范商务方正质感，禁止新增渐变、发光、缩放hover特效
4. 页面底色固定var(--ui-bg-page)，卡片白底固定var(--ui-bg-card)，不得修改页面底色
5. 所有间距仅使用定义好5档ui-space变量，禁止自定义零散像素边距
6. 如需新增UI样式，不得临时手写css，先补充全局:root变量后再调用