//控制音乐的方法
(function(window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
        Player.prototype = {
            constructor:Player,
            musicList:[],
            init:function($audio){
                //jquery中的
                this.$audio = $audio;
                //原生
                this.audio = $audio.get(0);
            },
            currenIndex : -1,
            playMusic:function(index,music){
                //判断是否是同一首音乐
                if(this.currentIndex == index){
                    //是同一首音乐
                    if(this.audio.paused){
                        this.audio.play();
                    }else{
                        this.audio.pause();
                    }
                }else{
                    //不是同一首
                    this.$audio.attr("src",music.link_url);
                    this.audio.play();
                    this.currentIndex = index;
                }
            },
            prevIndex:function () {
                var index = this.currentIndex - 1;
                if(index < 0){
                    index = this.musicList.length - 1;
                }
                return index;
            },
            nextIndex:function(){
                var index = this.currentIndex + 1;
                if(index > this.musicList.length - 1){
                    index = 0;
                }
                return index;
            },
            changeMusic:function(index){
                //删除对应的后台数据
                this.musicList.splice(index,1);
                //判断删除的歌曲的是否是正在播放歌曲的前面
                if(index < this.currentIndex){
                    this.currentIndex = this.currentIndex - 1;
                }
            },
            //监听音乐播放进度
            musicTimeUpdate:function(callBack){
                var $this = this;
                this.$audio.on("timeupdate",function(){
                    var duration = $this.audio.duration;
                    var currentTime = $this.audio.currentTime;
                    var timeStr = $this.formatDate(currentTime,duration);
                    callBack(currentTime,duration,timeStr);
                });
            },
            //定义一个格式化时间的方法
            formatDate:function(currentTime,duration){
                //获取分钟
                var endMin = parseInt(duration/60);
                if(endMin < 10){
                    endMin = "0" + endMin;
                }
                //获取秒
                var endSec = parseInt(duration % 60);
                if(endSec < 10){
                    endSec = "0" + endSec;
                }
                var startMin = parseInt(currentTime / 60);
                if(startMin < 10){
                    startMin = "0" + startMin;
                }
                var startSec = parseInt(currentTime % 60);
                if(startSec < 10){
                    startSec = "0" + startSec;
                }
                return startMin + ":" + startSec + "/" + endMin + ":" + endSec;
            },
            musicSeekTo:function(value){
                if(isNaN(value)) return;
                this.audio.currentTime = this.audio.duration * value;
            },
            musicVoiceSeek:function(value){
                if(isNaN(value)) return;
                if(value >= 0 && value <= 1){
                    this.audio.volume = value;
                }

            }
        }
        Player.prototype.init.prototype = Player.prototype;
        window.Player = Player;
})(window);
