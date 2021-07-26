const btn = document.querySelector(".btn");
let resultBmiValue = document.querySelector(".resultBmiValue");
let smallText = document.querySelector(".smallText");
let resultBmiStatus = document.querySelector(".resultBmiStatus");
let restartBtn = document.querySelector(".restartBtn");
let height = document.querySelector('#height');
let weight = document.querySelector('#weight');
let bmiList = document.querySelector('.bmiList');
const data = JSON.parse(localStorage.getItem("record")) || [];

// 顯示結果圓圈圈
function showResult(color, bmi, status) {
  // 改變圓形按鈕框線和文字顏色
  btn.style.border =`5px solid ${color}`;
  btn.style.color = `${color}`;
  btn.style.backgroundColor ="transparent";
  // 改變文字內容和顏色
  resultBmiValue.textContent = bmi;
  resultBmiValue.style.margin = "15px 0 0 0";
  resultBmiStatus.textContent = status;
  resultBmiStatus.style.display = "block";
  resultBmiStatus.style.color = `${color}`;
  smallText.style.display = "block";
  btn.style.cursor = "auto";

  // 取消hover效果
  btn.classList.remove("effect");

  // 加入重來按鈕和效果
  restartBtn.style.backgroundColor = `${color}`;
  restartBtn.style.display = "block";
  restartBtn.addEventListener('click', calBmi, false);
}
// 計算bmi + 存進data
function calBmi(){
  let height = document.querySelector('#height');
  let weight = document.querySelector('#weight');
  let bmi = parseInt(weight.value)/((parseInt(height.value)/100)**2);
  let warning = document.querySelectorAll('.warning');
  bmi = bmi.toFixed(1)
  console.log(bmi);
  if (warning[0].textContent != "" || warning[1].textContent != ""){return};
  if (bmi === "NaN"){return;}
  let color;
  let status;
  // 判斷狀態
  if (bmi < 18.5) {
    color = "var(--over-thin)";
    status = "過輕";
  } else if (bmi >= 18.5 && bmi < 24) {
    color = "var(--idol-color)";
    status = "理想";
  } else if (bmi >= 24 && bmi < 27) {
    color = "var(--over-fat)";
    status = "過重";
  } else if (bmi >= 27 && bmi < 30) {
    color = "var(--low-fat)";
    status = "輕度肥胖";
  } else if (bmi >= 30 && bmi < 35 ){
    color = "var(--medium-fat)";
    status = "中度肥胖";
  } else {
    color = "var(--high-fat)";
    status = "重度肥胖";
  };

  showResult(color,bmi,status);
  addRecord(color, bmi, status, weight.value, height.value);
}

// 存資料進data
function addRecord(color, bmi, status, weight, height){
  let date = new Date();
  date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  let temp = {
    "color": color,
    "bmi": bmi,
    "status": status,
    "weight": weight,
    "height": height,
    "date":date
  }
  console.log(temp);
  data.unshift(temp);
  renderList();
  localStorage.setItem('record',JSON.stringify(data));
}

// 判斷結果顯示
function checkInt(e){
  console.log(e.target.value);
  if(!isNumber(e.target.value)){
  this.nextElementSibling.textContent = `請輸入數字`;
  e.target.style.border = "2px solid red";
  }else{
    this.nextElementSibling.textContent = ``;
    e.target.style.border = "2px solid var(--main-color)";
  };
};
// 判斷是否為數字
function isNumber(val) {
  return /^[-]?[\.\d]+$/.test(val);
}

// 從data拿資料出來顯示
function renderList(){
  str = '';
  data.forEach(function (item,index) {
    console.log(item);
    str += `
    <li class="bmiItem" style="border-left: 8px solid ${item.color};" data-index=${index}>
      <ul class="itemDetail">
        <li class="status">${item.status}</li>
        <li class="label">BMI <span class="val bmi">${item.bmi}</span></li>
        <li class="label">weight<span class="val weight">${item.weight}kg</span></li>
        <li class="label">height<span class="val height">${item.height}cm</span></li>
        <li class="label date">${item.date}</li>
        <li class="delete"><i class="fas fa-minus-circle" title="刪除"></i></li>
      </ul>
    </li>`
  });
  if (data) {
    str += `<button class="clearAll">清除全部</button>`;
    bmiList.innerHTML = str;
    let itemDetail = document.querySelectorAll('.itemDetail');
    itemDetail.forEach(item =>
        item.addEventListener('click',deleteBmi,false)
      );
    clearStorage();
  }
}

function deleteBmi(e){
  console.log(e.target.nodeName);
  if (e.target.nodeName != "I"){
    return;
  } else {
    let index = e.target.dataset.index;
    data.splice(index, 1);
    localStorage.setItem("record", JSON.stringify(data));
    renderList();
  };
};

function clearStorage(){
  let clearAll = document.querySelector(".clearAll");
  clearAll.addEventListener('click', function(){
    console.log('clear');
    bmiList.innerHTML = "";
    data.length = 0;
    localStorage.clear();    
  }, false);
}

height.addEventListener('blur', checkInt,false);
weight.addEventListener('blur',checkInt,false);
btn.addEventListener("click",calBmi,false);

renderList();