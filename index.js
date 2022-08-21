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
}
var checkDead = setInterval(function(){
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(blockLeft<20 && blockLeft>0 && characterTop>=130){
        block.style.animation = "none";
        block.style.display = "none";
        alert("你输了！");
    }
},10);
