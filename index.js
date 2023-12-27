const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let slider_len=10;
let checkCount=0;
handle_slider();
setIndicator("#ccc");

async function cpy_password(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText= "copied";
    }
    catch(error){
        alert("didn't copy right now");
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        
    }, 2000);
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function handle_slider(){

    inputSlider.value = slider_len;
    lengthDisplay.innerText = slider_len;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (slider_len - min)*100/(max - min)) + "% 100%";
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && slider_len >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      slider_len >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(checkCount > slider_len){
        slider_len = checkCount;
        handle_slider();
    }
}

allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

copyBtn.addEventListener('click',() =>{
    if(passwordDisplay.value){
        cpy_password();
    }
});

inputSlider.addEventListener('input',() =>{
    slider_len = inputSlider.value;
    handle_slider();
})


function generatePassword(){
    if(checkCount == 0){
        return ;
    }
    if(slider_len < checkCount){
        slider_len = checkCount;
        handle_slider();
    }

    password = "";
    let count=0;
    let funcArr=[];
    if(allCheckBox[0].checked){
        password += generateUpperCase();
        count++;
        funcArr.push(generateUpperCase());
    }
    
    if(allCheckBox[1].checked){
        password += generateLowerCase();
        count++;
        funcArr.push(generateLowerCase());
    }

    if(allCheckBox[2].checked){
        password += generateRandomNumber();
        count++;
        funcArr.push(generateRandomNumber());
    }
    
    if(allCheckBox[3].checked){
        password += generateSymbol();
        count++;
        funcArr.push(generateSymbol());
    }

   for(let i=0;i<(slider_len-count);i++){
    password += funcArr[getRndInteger(0,funcArr.length)];
   }

   password = shufflePassword(Array.from(password));
   passwordDisplay.value = password;
   calcStrength();
}
