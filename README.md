# Music-Player
## 学习html,css,javascript,jquery进行练手的小demo
1. 模仿QQ音乐播放器样式开发的网页版音乐播放器;
2. 使用模拟数据，将歌曲jpg/mp3/txt 即歌曲专辑图片，歌曲mp3文件，歌词等保存在source文件中
3. 编写musiclist.json文件，模拟数据; 使用ajax获取数据

- musiclist.json格式如下
```javascript
[
  {
    "name":"告白气球",
    "singer": "周杰伦",
    "album": "周杰伦的床边故事",
    "time": "03:35",
    "link_url":"./source/告白气球.mp3",
    "cover":"./source/告白气球.jpg",
    "link_lrc":"./source/告白气球.txt"
  }
  ...
]
```
