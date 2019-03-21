(function(window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }

    Lyric.prototype = {
        constructor:Lyric,
        times:[], //用来保存所有的时间
        lyrics:[],//用来保存所有的歌词
        index: -1,
        init:function(path){
            this.path = path;
        },

        loadLyric:function(callBack){
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function(data) {
                    $this.parseLyric(data);
                    callBack();
                },
                error: function(e) {
                    console.log(e);
                }
            })
        },
        parseLyric:function(data){
            var $this = this;
            $this.times = [ ];
            $this.lyrics = [ ];
            var array = data.split("\n");
            // console.log(array);
            //利用正则表达式 匹配时间 [00:00.92]
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            //遍历array数组
            $.each(array,function(index,ele){
                //歌词的处理
                var lyric = ele.split("]")[1];
                //排除歌词为空的情况
                if(lyric.length == 1) return true;
                $this.lyrics.push(lyric);

                //时间的处理
                var res = timeReg.exec(ele);
                // console.log(res);
                if(res == null) return true;
                var timeStr = res[1];//00:03.79 分:秒.毫秒
                var time = timeStr.split(":");
                var min = parseInt(time[0])* 60;
                var sec = parseFloat(time[1]);
                var time = Number(Number(min + sec).toFixed(2));
                // console.log(typeof time);
                $this.times.push(time);
                //歌词的处理
                // console.log(ele);
            });

        },
        currentIndex:function(currentTime){
            // console.log(currentTime);

            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift();
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window)