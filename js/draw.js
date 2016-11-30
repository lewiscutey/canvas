/**
* Created by Lewis on 2016/11/30.
*/
window.onload=function(){
    var canvasBox=document.querySelector(".canvas-box");
    var canvasBoxW=canvasBox.offsetWidth;
    var canvasBoxH=canvasBox.offsetHeight;
    var canvas=document.querySelector("canvas");
    var ctx=canvas.getContext("2d");
    var copy=document.querySelector(".copy");
    canvas.width=canvasBoxW;
    canvas.height=canvasBoxH;

// 菜单栏选项卡
    var nav = $(".menu-list");
    nav.hover(function(){
        $(this).find('.aside-menu-list').stop().slideToggle();
        $(".xp").css("display","none");
        drawObj.isshowxp=false;
        $(".selectarea").css("display","none");
    });

// 创建画笔
    var drawObj=new shape(canvas,copy,ctx);

    /*菜单操作*/
    /*$(".menu-list").click(function(){
     var index=$(".menu-list").index(this);
     $(".aside-menu-list").hide().eq(index).slideToggle(100);
     $(".xp").css("display","none");
     drawObj.isshowxp=false;
     $(".selectarea").css("display","none");
     });*/

    /*菜单栏画图*/
    $(".aside-menu-list:eq(1) li").click(function(){
        var fn=$(this).attr("data-role");
        if(fn=="polygon"){
            drawObj.edgeNum=prompt("请输入边数",drawObj.edgeNum)
        }
        if(fn=="pentagrams"){
            drawObj.angleNum=prompt("请输入角数",drawObj.angleNum)
        }
        if(fn!=="pen") {
            drawObj.type = fn;
            drawObj.draw();
        }else{
            drawObj.pen();
        }
    });


    /*画图的方式*/
    $(".aside-menu-list:eq(2) li").click(function(){
        var fn=$(this).attr("data-role");
        drawObj.style=fn;
        drawObj.draw();
    });

    /*画图的颜色*/
    $(".aside-menu-list:eq(3) li input").change(function(){
        drawObj[$(this).attr("data-role")]=$(this).val();
        drawObj.draw();
    });

    /*线条的粗细*/
    $(".aside-menu-list:eq(4) li").click(function(){
        var num=$(this).attr("data-role");
        if(num!=="null") {
            drawObj.lineWidth =num;
            drawObj.draw();
        }
    });
//        自定义设置线条宽度
    $(".aside-menu-list:eq(5) li input").change(function(){
        var num=$(this).val();
        drawObj.lineWidth =num;
        drawObj.draw();
    });

    /*操作菜单栏第一项*/
    $(".aside-menu-list:eq(0) li ").click(function(){
        var index=$(".aside-menu-list:eq(0) li").index(this);
        if(index==0){
            if(drawObj.history.length>0){
                var yes=confirm("是否保存");
                if(yes){
                    var url=canvas.toDataURL();
                    var newurl=url.replace("image/png","stream/octet");
                    location.href=newurl;
                }
            }

            ctx.clearRect(0,0,canvas.width,canvas.height);
            drawObj.history=[];

        }else if(index==2){
            //返回
            if(drawObj.history.length==0){
                //no
                ctx.clearRect(0,0,canvas.width,canvas.height);
                setTimeout(function(){
                    alert("已经无路可退了！");
                },10);
            }else{
                if (drawObj.isback) {
                    if (drawObj.history.length == 1) {
                        drawObj.history.pop();
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    } else {
                        drawObj.history.pop();
                        ctx.putImageData(drawObj.history.pop(), 0, 0);
                    }
                } else {
                    ctx.putImageData(drawObj.history.pop(), 0, 0);
                }

                drawObj.isback = false;

            }
        }else if(index==3) {
            var url=canvas.toDataURL();
            var newurl=url.replace("image/png","stream/octet")
            location.href=newurl;

        }

    });

    $(".menu-list:eq(6)").click(function(){
        var xpobj=$(".xp");
        drawObj.xp(xpobj);
        drawObj.isshowxp=true;
        $(".aside-menu-list:last-child li input").val=drawObj.xpsize;
    });

    $(".aside-menu-list:eq(6) input").change(function(){
        drawObj.xpsize=$(this).val();
        $(".xp").css({
            width:$(this).val()+"px",
            height:$(this).val()+"px"
        })
    });

    $(".menu-list:last-child").click(function(){
        var selectarea = $(".selectarea");
        drawObj.select(selectarea);
        selectarea.css("border","1px dotted #000");
    });

//滤镜操作
    var file=document.querySelector(".open");
    var img=document.querySelector("img");
    var dataobj=ctx.getImageData(0,0,canvas.width,canvas.height);

    file.onchange=function(){
        var fileObj=this.files[0];
        var reader=new FileReader();
        reader.readAsDataURL(fileObj);
        reader.onload=function(e){
            img.src= e.target.result;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
        }
    };

    var lis=$(".aside-menu-list:eq(5) li");
    for(var i=0;i<lis.length;i++){
        lis[i].onclick=function(){
            var attr=this.getAttribute("data-role");
            if(attr=="blur"){
                drawObj.blur(dataobj,5,0,0);
            }else if(attr=="rp"){
                drawObj.rp(dataobj,0,0);
            }else if(attr=="mosaic"){
                drawObj.mosaic(dataobj,50,0,0);
            }
        }
    }

//侧边工具栏

    //文件操作
    $("aside .file li:nth-child(1)").on("click",function () {
        if(drawObj.history.length>0){
            var yes=confirm("是否保存");
            if(yes){
                var url=canvas.toDataURL();
                var newurl=url.replace("image/png","stream/octet");
                location.href=newurl;
            }
        }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawObj.history=[];
    });
    $("aside .file li:nth-child(2)").on("click",function () {
    });
    $("aside .file li:nth-child(3)").on("click",function () {
        if(drawObj.history.length==0){
            //no
            ctx.clearRect(0,0,canvas.width,canvas.height);
            setTimeout(function(){
                alert("已经无路可退了！");
            },10);
        }else{
            if (drawObj.isback) {
                if (drawObj.history.length == 1) {
                    drawObj.history.pop();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    drawObj.history.pop();
                    ctx.putImageData(drawObj.history.pop(), 0, 0);
                }
            } else {
                ctx.putImageData(drawObj.history.pop(), 0, 0);
            }

            drawObj.isback = false;

        }
    });
    $("aside .file li:nth-child(4)").on("click",function () {
        var url=canvas.toDataURL();
        var newurl=url.replace("image/png","stream/octet");
        location.href=newurl;
    });

    //画图操作
    $("aside .hua li:nth-child(1)").on("click",function () {
        drawObj.type = "line";
        drawObj.draw();
    });
    $("aside .hua li:nth-child(2)").on("click",function () {
        drawObj.type = "rect";
        drawObj.draw();
    });
    $("aside .hua li:nth-child(3)").on("click",function () {
        drawObj.type = "arc";
        drawObj.draw();
    });
    $("aside .hua li:nth-child(4)").on("click",function () {
        drawObj.edgeNum=prompt("请输入边数",drawObj.edgeNum);
        drawObj.type = "polygon";
        drawObj.draw();
    });
    $("aside .hua li:nth-child(5)").on("click",function () {
        drawObj.angleNum=prompt("请输入角数",drawObj.angleNum);
        drawObj.type = "pentagrams";
        drawObj.draw();
    });
    $("aside .hua li:nth-child(6)").on("click",function () {
        drawObj.pen();
    });

    //画图方式
    $("aside .hua-style li:nth-child(1)").on("click",function () {
        drawObj.style="stroke";
        drawObj.draw();
    });
    $("aside .hua-style li:nth-child(2)").on("click",function () {
        drawObj.style="fill";
        drawObj.draw();
    });

    //橡皮擦
    $("aside .xpxz li:nth-child(2)").on("click",function () {
        var xpobj=$(".xp");
        drawObj.xp(xpobj);
        drawObj.isshowxp=true;
        $(".aside-menu-list:last-child li input").val=drawObj.xpsize;
    });
    //选择
    $("aside .xpxz li:nth-child(1)").on("click",function () {
        var selectarea = $(".selectarea");
        drawObj.select(selectarea);
        selectarea.css("border","1px dotted #000");
    });

    //滤镜操作
    $("aside .lvjing li:nth-child(1)").on("click",function () {
        drawObj.mosaic(dataobj,50,0,0);
    });
    $("aside .lvjing li:nth-child(2)").on("click",function () {
        drawObj.rp(dataobj,0,0);
    });
    $("aside .lvjing li:nth-child(3)").on("click",function () {
        drawObj.blur(dataobj,5,0,0);
    });
    $("aside .lvjing li:nth-child(4)").on("click",function () {
    //    杂色还没写
    });

    //边框的颜色
    $("aside .border-color input").on("change",function () {
        drawObj.strokeStyle=$(this).val();
        drawObj.draw();
    });

    //背景的颜色
    $("aside .back-color input").on("change",function () {
        drawObj.fillStyle=$(this).val();
        drawObj.draw();
    });

    //线条的宽度
    //细
    $("aside .line-width i:nth-child(1)").on("click",function () {
        drawObj.lineWidth = 2;
        drawObj.draw();
    });
    //中
    $("aside .line-width i:nth-child(2)").on("click",function () {
        drawObj.lineWidth = 5;
        drawObj.draw();
    });
    //粗
    $("aside .line-width i:nth-child(3)").on("click",function () {
        drawObj.lineWidth = 10;
        drawObj.draw();
    });










};
