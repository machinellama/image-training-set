# image-training-set

[![ja](https://img.shields.io/badge/lang-Japanese-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.ja.md)
[![es](https://img.shields.io/badge/lang-Spanish-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.es.md)
[![ko](https://img.shields.io/badge/lang-Korean-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.ko.md)
[![zh-CN](https://img.shields.io/badge/lang-Simplified--Chinese-green?color=1a5296)](https://github.com/machinellama/image-training-set/blob/main/translated-md/README.zh-CN.md)

我创建了这个仓库，以便轻松地为训练图像模型标注和组织图像。它支持上传图像（PNG/JPG）或视频（MP4），并以每秒1次的间隔自动生成图像。您可以为每个图像添加标题，并下载包含所有图像和相关标题的ZIP文件。

我专门使用它来训练Stable Diffusion模型并创建kohya_ss格式的训练集。注意：这个仓库与Stable Diffusion和kohya_ss没有任何关联。

# 目录
- [隐私](#隐私)
- [设置](#设置)
- [步骤](#步骤)
- [截图](#截图)
- [许可证](#许可证)
- [问题和贡献](#问题和贡献)

## 隐私
隐私是这个仓库的重要方面。您的数据绝不会发送到计算机外部。数据也不会保存在您的浏览器中；如果您刷新或关闭标签页，任何正在处理的数据将会丢失。

## 设置

- 前提条件：`NodeJS`（我使用的是v20.11.1，但其他版本可能也能正常工作）
- `npm install`
- `npm run dev` 在3000端口运行

## 步骤

- 上传一个或多个图像（PNG/JPG）并为每个图像添加标题
  - 标题越详细，训练集效果越好
- 上传MP4视频文件
  - 设置开始和结束时间以从视频中捕获图像
  - 图像将以每秒1次的间隔生成
  - 添加适用于每个生成图像的描述
- 下载包含所有图像和相关标题的ZIP文件
- 如果下载了多个ZIP文件，将所有文件解压到一个文件夹中以进行训练
- 将所有训练数据（图像和txt文件）放入一个文件夹中，然后前往[kohya_ss](https://github.com/bmaltais/kohya_ss)训练或微调您的Stable Diffusion模型

## 截图

上传图像：

<img src="../images/its1.png" alt="image-training-set" width="650"/>

上传视频：

<img src="../images/its2.png" alt="image-training-set" width="650"/>

下载ZIP文件：

<img src="../images/its3.png" alt="image-training-set" width="650"/>

## 许可证
MIT许可证

## 问题和贡献
如果您有任何问题或发现任何问题，请创建一个包含详细信息的`Issue`。
  - 请注意，这仅在使用Firefox的Windows计算机上进行了测试。在其他操作系统和浏览器上的效果可能会有所不同。

欢迎任何人添加新代码或功能！请先创建一个`Issue`，评论您正在处理的内容（以便多个用户不会处理同一内容），并在您的Pull Request中提及`Issue`编号。
