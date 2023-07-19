// 헤더 메뉴버튼
const hamBtn = document.querySelector(".menuBtn");
// 헤더 플러스버튼
const hamBtnSpan = document.querySelectorAll(".hammenu span");
const hamBtnCross = document.querySelector(".hammenu span:last-child");
// 상단메뉴배경
const gnbBg = document.querySelector(".gnbBg");

let toggle = true;
hamBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    if(toggle){
        hamBtnCross.style.transform = "translate(-50%,-50%) rotate(180deg)"
        gnbBg.style.transform = "translateY(0%)"
        hamColorB()
        toggle = !toggle
    }
    else if(toggle === false){
        toggle = !toggle;
        hamBtnCross.style.transform = "translate(-50%,-50%) rotate(90deg)"
        gnbBg.style.transform = "translateY(-200%)"
        hamColorWh()
    }
})
// 햄버거메뉴 흰색 함수
function hamColorWh(){
    for(let i=0; i< hamBtnSpan.length; i++){
            hamBtnSpan[i].style.backgroundColor = '#fff'
        }
        hamBtn.style.color = '#fff'
};
// 햄버거메뉴 검은색 함수
function hamColorB(){
    for(let i=0; i< hamBtnSpan.length; i++){
            hamBtnSpan[i].style.backgroundColor = '#000'
        }
        hamBtn.style.color = '#000'
};