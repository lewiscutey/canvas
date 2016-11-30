/**
 * Created by Lewis on 2016/11/19.
 */

  //制造图形
    function shape(canvas,copy,obj) {
        this.canvas = canvas;
        this.ctx = obj;
        this.copy = copy;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.type = "line";
        this.style = "stroke";
        this.strokeStyle = "#000";
        this.fillStyle = "#000";
        this.lineWidth = 1;
        this.edgeNum = 5;
        this.angleNum = 5;
        this.history = [];
        this.isback = true;
        this.xpsize=10;
        this.isshowxp=true;
    }
    //构造形状
    shape.prototype = {
        init:function () {
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.fillStyle = this.fillStyle;
        },
        draw:function () {
            var that = this;
            this.copy.onmousedown = function (e) {
                var startx = e.offsetX;
                var starty = e.offsetY;
                that.copy.onmousemove = function (e) {
                    that.isback = true;
                    that.init();
                    var endx = e.offsetX;
                    var endy = e.offsetY;
                    that.ctx.clearRect(0,0,that.width,that.height);
                    if(that.history.length){
                        that.ctx.putImageData(that.history[that.history.length-1],0,0);
                    }
                    that[that.type](startx,starty,endx,endy);
                };
                that.copy.onmouseup = function (e) {
                    that.copy.onmousemove = null;
                    that.copy.onmouseup = null;
                    that.history.push(that.ctx.getImageData(0,0,that.width,that.height));
                };
                return false;
            }
        },
        line:function (x,y,x1,y1) {
            this.ctx.beginPath();
            this.ctx.moveTo(x,y);
            this.ctx.lineTo(x1,y1);
            this.ctx.stroke();
        },
        rect:function (x,y,x1,y1) {
            this.ctx.beginPath();
            this.ctx.rect(x,y,x1-x,y1-y);
            this.ctx[this.style]();
        },
        arc:function (x,y,x1,y1) {
            this.ctx.beginPath();
            var r = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
            this.ctx.arc(x,y,r,0,Math.PI*2);
            this.ctx[this.style]();
        },
        triangle:function (x,y,x1,y1) {
            this.ctx.beginPath();
            this.ctx.moveTo(x,y);
            this.ctx.lineTo(x1,y1);
            this.ctx.lineTo(2*x-x1,y1);
            this.ctx.lineTo(x,y);
            this.ctx.closePath();
            this.ctx[this.style]();
        },
        polygon:function (x,y,x1,y1) {
            this.ctx.beginPath();
            var r = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
            var deg = Math.PI*2/this.edgeNum;
            for(var i = 0;i<this.edgeNum;i++){
                this.ctx.lineTo(r*Math.cos(i*deg)+x,r*Math.sin(i*deg)+y);
            }
            this.ctx.closePath();
            this.ctx[this.style]();
        },
        pentagrams:function (x,y,x1,y1) {
            this.ctx.beginPath();
            var R = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
            var r = R/3;
            var deg = Math.PI*2/(this.angleNum*2);
            for(var i = 0;i<this.angleNum*2;i++){
                if(i%2==0){
                    this.ctx.lineTo(R*Math.cos(i*deg)+x,R*Math.sin(i*deg)+y);
                }else{
                    this.ctx.lineTo(r*Math.cos(i*deg)+x,r*Math.sin(i*deg)+y);
                }
            }
            this.ctx.closePath();
            this.ctx[this.style]();
        },
        pen:function(){
            var that=this;
            this.copy.onmousedown=function(e){
                var startx= e.offsetX;
                var starty= e.offsetY;
                that.ctx.beginPath();
                that.ctx.moveTo(startx,starty);
                that.copy.onmousemove=function(e){
                    that.init();
                    var endx= e.offsetX;
                    var endy= e.offsetY;
                    that.ctx.clearRect(0,0,that.width,that.height);
                    if(that.history.length>0){
                        that.ctx.putImageData(that.history[that.history.length-1],0,0);
                    }
                    that.ctx.lineTo(endx,endy);
                    that.ctx.stroke();
                };
                that.copy.onmouseup=function(){
                    that.copy.onmouseup=null;
                    that.copy.onmousemove=null;
                    that.history.push(that.ctx.getImageData(0,0,that.width,that.height));
                };
                return false;
            }
        },
        xp:function(xpobj){
        var that=this;
        that.copy.onmousemove=function(e){
            if(!that.isshowxp){
                return false;
            }
            var movex=e.offsetX;
            var movey=e.offsetY;
            var lefts=movex-that.xpsize/2;
            var tops=movey-that.xpsize/2;
            if(lefts<0){
                lefts=0;
            }
            if(lefts>that.canvas.width-that.xpsize){
                lefts=that.canvas.width-that.xpsize
            }
            if(tops<0){
                tops=0;
            }
            if(tops>that.canvas.height-that.xpsize){
                tops=that.canvas.height-that.xpsize
            }
            xpobj.css({
                display:"block",
                left:lefts,
                top:tops,
                width:that.xpsize+"px",
                height:that.xpsize+"px"
            });
        };
        that.copy.onmousedown=function(e){
            that.copy.onmousemove=function(e){
                var movex=e.offsetX;
                var movey=e.offsetY;
                var lefts=movex-that.xpsize/2;
                var tops=movey-that.xpsize/2;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.canvas.width-that.xpsize){
                    lefts=that.canvas.width-that.xpsize;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.canvas.height-that.xpsize){
                    tops=that.canvas.height-that.xpsize;
                }
                xpobj.css({
                    display:"block",
                    left:lefts,
                    top:tops,
                    width:that.xpsize+"px",
                    height:that.xpsize+"px"
                });
                that.ctx.clearRect(lefts,tops,that.xpsize,that.xpsize);
            };
           that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.xp(xpobj);
                that.history.push(that.ctx.getImageData(0,0,that.canvas.width,that.canvas.height));
            };
            return false;
        }
    },
    select:function(selectareaobj){
        var that=this;
        that.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            var minx,miny,w,h;
            that.init();
            that.copy.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                selectareaobj.css({
                    left:minx,
                    top:miny,
                    width:w,
                    height:h,
                    display:"block"
                });
            };
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.temp=that.ctx.getImageData(minx,miny,w,h);
                that.ctx.clearRect(minx,miny,w,h);
                that.history.push(that.ctx.getImageData(0,0,that.canvas.width,that.canvas.height));
                that.ctx.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);
            };
            return false;
        }
    },
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.copy.onmousemove=function(e){
            selectareaobj.css("cursor","move");
        };
        that.copy.onmousedown=function(e){
            var ax= selectareaobj.position().left;
            var ay= selectareaobj.position().top;
            var ox= e.clientX;
            var oy= e.clientY;
            that.copy.onmousemove=function(e){
                that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);
                if(that.history.length!=0){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }
                var mx= e.clientX;
                var my= e.clientY;
                var lefts=(mx-ox)+ax;
                var tops=(my-oy)+ay;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.canvas.widht-w){
                    lefts=that.canvas.width-w;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.canvas.height-h){
                    tops=that.canvas.height-h;
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops,
                    border:"1px dotted #000"
                });
                x=lefts;
                y=tops;
                that.ctx.putImageData(that.temp,lefts,tops);
            };
            that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.drag(x,y,w,h,selectareaobj);
                selectareaobj.css({
                    // border:"none"
                })
            };
            return false;
        }
    },
    rp:function (dataobj,x,y) {
        for(var i=0;i<dataobj.width*dataobj.height;i++){
            dataobj.data[i*4+0] = 255-dataobj.data[i*4+0];
            dataobj.data[i*4+1] = 255-dataobj.data[i*4+1];
            dataobj.data[i*4+2] = 255-dataobj.data[i*4+2];
            dataobj.data[i*4+3] = 255;
        }
        this.ctx.putImageData(dataobj,x,y);
    }, 
    mosaic:function (dataobj,num,x,y) {
        var width = dataobj.width, height = dataobj.height;
        var num = num;
        var w = width / num;
        var h = height / num;
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < num; j++) {
                var dataObj = this.ctx.getImageData(j * w, i * h, w, h);
                var r = 0, g = 0, b = 0;
                for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                    r += dataObj.data[k * 4 + 0];
                    g += dataObj.data[k * 4 + 1];
                    b += dataObj.data[k * 4 + 2];
                }

                r = parseInt(r / (dataObj.width * dataObj.height));
                g = parseInt(g / (dataObj.width * dataObj.height));
                b = parseInt(b / (dataObj.width * dataObj.height));

                for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                    dataObj.data[k * 4 + 0] = r;
                    dataObj.data[k * 4 + 1] = g;
                    dataObj.data[k * 4 + 2] = b;
                }
                this.ctx.putImageData(dataObj, x + j * w, y+i * h);

            }
        }
    },
    blur:function (dataobj,num,x,y) {
        var width = dataobj.width, height = dataobj.height;
        var arr=[];
        var num = num;
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                var x1=j+num>width?j-num:j;
                var y1=i+num>height?i-num:i;
                var dataObj = this.ctx.getImageData(x1, y1,num, num);
                var r = 0, g = 0, b = 0;
                for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                    r += dataObj.data[k * 4 + 0];
                    g += dataObj.data[k * 4 + 1];
                    b += dataObj.data[k * 4 + 2];
                }
                r = parseInt(r / (dataObj.width * dataObj.height));
                g = parseInt(g / (dataObj.width * dataObj.height));
                b = parseInt(b / (dataObj.width * dataObj.height));
                arr.push(r,g,b,255);
            }
        }
        for(var i=0;i<dataobj.data.length;i++){
            dataobj.data[i]=arr[i];
        }
        this.ctx.putImageData(dataobj,x,y);

    }

    };



















