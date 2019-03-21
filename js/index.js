$(function() {
    //0.自定义滚动条
    $(".content-list").mCustomScrollbar();
    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var vioceProgress;
    var lyric;
    //1.加载歌曲列表
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function(data) {
                player.musicList =data;
                //获取data内的内容 动态创建每一条歌曲
                // console.log(data);
                var $musicList = $(".content-list ul");
                $.each(data,function(index,ele){
                    var $item = createMusicItem(index,ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error: function(e) {
                console.log(e);
            }
        })
    }
    //2.初始化歌曲信息
    function initMusicInfo(music){
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAblum = $(".song_info_ablum a");
        var $musicProgressName = $(".music_top_name");
        var $musicProgressTime = $(".music_top_time");
        var $maskBackground = $(".mask-bg");
        var $songLyric = $(".song_lyric");
        //给获取到的元素赋值
        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name + "/" + music.singer);
        $musicProgressTime.text("00:00/" + music.time);
        $maskBackground.css("background","url('"+music.cover+"')");
    }
    //3.初始化歌词信息
    function initMusicLyric(music){
        lyric = new Lyric(music.link_lrc);
        var $songLyric = $(".song_lyric");
        //清空上一首音乐的歌词
        $songLyric.html("");
        lyric.loadLyric(function(){
            //1.创建歌词列表
            $.each(lyric.lyrics,function(index,ele){
                var $item = $("<li>"+ ele+"</li>");
                $songLyric.append($item);
            });
        });
    }
    //4.初始化进度条
    initProgress();
    function initProgress(){
        //歌曲播放进度条
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress =  Progress($progressBar,$progressLine,$progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function(value){
            player.musicSeekTo(value);
        });

        //音量进度条
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        vioceProgress =  Progress($voiceBar,$voiceLine,$voiceDot);
        vioceProgress.progressClick(function (value) {
            player.musicVoiceSeek(value);
        });
        vioceProgress.progressMove(function(value){
            player.musicVoiceSeek(value);
        });
    }
    //4.初始化事件监听
    initEvents();
    function initEvents(){
        var $musicPlay = $(".music_play");
        //2.1 监听歌曲的移入移除
        //动态创建的元素如果想要添加事件，则需要通过事件委托
        $(".content-list").delegate(".list-music", "mouseenter", function () {
            //2.1.1移入时显示menu,删除
            $(this).find(".list_song_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            //移除时长
            $(this).find(".list_time span").stop().fadeOut(100);
        })
        $(".content-list").delegate(".list-music", "mouseleave", function () {
            //2.1.2 移出时menu去掉，删除变为时间
            $(this).find(".list_song_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            $(this).find(".list_time span").stop().fadeIn(100);
        })
        //2.2 复选框点击事件
        $(".content-list").delegate(".list_check","click",function(){
            $(this).toggleClass('list_checked');

        })
        //2.3添加子菜单播放按钮的监听
        $(".content-list").delegate(".list_song_play","click",function(){
            var $item =  $(this).parents(".list-music");
            //2.3.1切换播放图标
            $(this).toggleClass("list_song_play2");
            //2.3.2复原其他的播放图标
            $(this).parents(".list-music").siblings().find(".list_song_play").removeClass("list_song_play2");
            //2.3.3同步底部播放
            if($(this).attr("class").indexOf("list_song_play2") != -1){
                //子菜单播放按钮为播放时
                //底部同步为播放按钮
                $musicPlay.addClass("music_play2");
                //文字高亮
                $(this).parents(".list-music").find('div').css('color','#fff');
                //文字排他
                $(this).parents(".list-music").siblings().find('div').css('color','rgba(255,255,255,0.5)');
            }else{
                //当子菜单按钮不为播放时
                $musicPlay.removeClass("music_play2");
                //文字变灰
                $(this).parents(".list-music").find('div').css('color','rgba(255,255,255,0.5)');
            }
            //2.3.4 切换序号状态
            $(this).parents('.list-music').find('.list_number').toggleClass("list_number2");
            $(this).parents('.list-music').siblings().find(".list_number").removeClass("list_number2");
            //2.3.5 播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);
            //2.3.6切换歌曲信息
            initMusicInfo($item.get(0).music);
            //2.3.7切换歌歌词信息
            initMusicLyric($item.get(0).music);

        });
        //2.4监听底部控制区播放按钮的点击
        $musicPlay.click(function(){
            //判断是不是第一首歌曲
            if(player.currentIndex == -1){
                //是第一首歌曲 list_song_play播放的
                $(".list-music").eq(0).find('.list_song_play').trigger('click');
            }else{
                //不是第一首歌的情况下，找到
                $(".list-music").eq(player.currentIndex).find(".list_song_play").trigger('click');
            }
        });
        //2.5监听底部控制区上一首按钮的点击
        $(".music_prev").click(function(){
            $(".list-music").eq(player.prevIndex()).find(".list_song_play").trigger('click');
        });
        //2.6监听底部控制区下一首按钮的点击
        $(".music_next").click(function(){
            $(".list-music").eq(player.nextIndex()).find(".list_song_play").trigger('click');
        });
        //2.7监听底部控制区删除按钮的点击
        $(".content-list").delegate(".list_song_del","click",function(){
            var $item = $(this).parents(".list-music");

            //判断删除的歌曲是否是正在播放的歌曲
            if($item.get(0).index == player.currentIndex){
                $(".music_next").trigger("click");
            }
            $item.remove();
            player.changeMusic($item.get(0).index);
            //重新排序
            $(".list-music").each(function(index,ele){
                ele.index = index;//改变当前对象的原生li的index
                $(ele).find(".list_number").text(index+1);
            })
        });
        //2.8监听播放的进度
        player.musicTimeUpdate(function(currentTime,duration,timeStr){
            //同步时间
            $(".music_top_time").text(timeStr);
           //同步进度条
            var value = currentTime / duration *  100;
            progress.setProgress(value);
            //同步歌词
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            // console.log($item);

            $item.addClass("cur");
            $item.siblings().removeClass("cur");
            //歌词滚动
            if(index <= 2) return;
            $(".song_lyric").css("marginTop",(-index + 2) * 30);
        });
        //2.9监听喇叭按钮的切换
        $(".music_voice_icon").click(function(){
            // alert("点击成功");
            $(this).toggleClass("music_voice_icon2");
            if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                //如果是关闭状态
                player.musicVoiceSeek(0);
            }else{
                //如果是播放状态
                player.musicVoiceSeek(1);
            }
        })
    }
    //定义一个方法创建一条音乐
	function createMusicItem(index,music){
	    var $item = $("<li class=\"list-music\">\n" +
            "\t\t\t\t <div class=\"list_check\"><i></i></div>\n" +
            "\t\t\t\t <div class=\"list_number \">"+(index+1)+"</div>\n" +
            "\t\t\t\t\t<div class=\"list_song\">"+  music.name +"\n" +
            "\t\t\t\t\t<div class=\"list_song_menu\">\n" +
            "\t\t\t\t\t<a href=\"javascript:;\" title=\"播放\" class='list_song_play'></a>\n" +
            "\t\t\t\t\t<a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "\t\t\t\t\t<a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "\t\t\t\t\t<a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "\t\t\t\t\t</div> \n" +
            "\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t<div class=\"list_singer\">"+    music.singer+"</div>\n" +
            "\t\t\t\t\t<div class=\"list_time\">\n" +
            "\t\t\t\t\t<span>"+music.time+"</span>\n" +
            "\t\t\t\t\t<a href=\"javascript:;\" title=\"删除\" class='list_song_del'></a>\n" +
            "\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t</li>");

        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }
    //6.加载登录框
    $('#login').click(function() {

    })
})
