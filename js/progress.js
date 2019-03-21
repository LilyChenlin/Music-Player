(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor:Progress,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove:false,
        progressClick:function(callBack){
            var $this = this;//谁调用progressClick方法，this就指向谁 这里的this是progress
            //监听背景的点击
            this.$progressBar.click(function(event){
                //获取背景距离窗口默认的位置
                var normalLeft = $(this).offset().left;
                //获取鼠标点击距离窗口默认的位置
                var eventLeft = event.pageX;
                //设置前景Line的宽度
                $this.$progressLine.css("width",eventLeft - normalLeft);
                //设置dot的位置
                $this.$progressDot.css("left",eventLeft - normalLeft);
                // //计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        progressMove:function(callBack){
            var $this = this;
            //拖拽进度条移动事件
            var normalLeft = this.$progressBar.offset().left;
            var eventLeft;
            var barWidth = this.$progressBar.width();
            //1.监听鼠标按下事件 鼠标按之后进行拖拽
            this.$progressBar.mousedown(function(){
                $this.isMove = true;
                //2.监听鼠标移动事件
                $(document).mousemove(function(event){
                        //获取鼠标点击距离窗口默认的位置
                        eventLeft = event.pageX;
                        var progressLineWidth = eventLeft - normalLeft;
                        if(progressLineWidth >= 0 && progressLineWidth <= barWidth){
                            //设置前景Line的宽度
                            $this.$progressLine.css("width",progressLineWidth);
                            //设置dot的位置
                            $this.$progressDot.css("left",progressLineWidth);
                        }
                });
            });
            //3.监听鼠标离开事件
            $(document).mouseup(function(){
                $(document).off('mousemove');
                $this.isMove = false;
                //计算进度条的比例
                var value = (eventLeft - normalLeft) / barWidth;
                callBack(value);
            })
        },
        setProgress:function(value) {
            if(this.isMove) return;
            if(value < 0 || value > 100)
                return;
            this.$progressLine.css({
                width:value + "%"
            });
            this.$progressDot.css({
                left : value + "%"
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)