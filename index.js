var character = document.getElementById("character");
//创建变量“character”，并从文件中获取id名为“character”的元素
var block = document.getElementById("block");
//创建变量“block”，并从文件中获取id名为“block”的元素
function jump(){
    if(character.classList != "animate"){
        character.classList.add("animate");
    }
    setTimeout(function(){
        character.classList.remove("animate");
    },500);
}// 在运行动画“animate”的500ms后删除该行为以便再次运行动画“animate”
var checkDead = setInterval(function(){
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    //创建变量“characterTop”，内容为解析出的int（数字），解析目标为character的top高度位置
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    //创建变量“blockLeft”，内容为解析出的int（数字），解析目标为block的left位置
    if(blockLeft<20 && blockLeft>0 && characterTop>=130){
        //判断，当变量“blockLeft”的内容小于20 且 大于0 且 变量“characterTop”大于或等于130时执行以下命令
        block.style.animation = "none";
        block.style.display = "none";
        //停止block动画
        alert("你输了！");
        //弹出页面：“你输了！”
    }
},10);
