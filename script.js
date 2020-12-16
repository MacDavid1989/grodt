const form = document.querySelector('.form');
const body = document.querySelector('body');
const main = document.querySelector('.main');
const battle = document.querySelector('.battle');
const losers = document.querySelector('.losers');
const ballers = document.querySelector('.ballers');
const graph1 = document.querySelector('.stock1__graph');
const graph2 = document.querySelector('.stock2__graph');

form.addEventListener('submit', formHandler);
        
function formHandler(e) {
    e.preventDefault();
    main.classList.add('hide');
    battle.classList.remove('hide');
    let stock1 = e.target.stock1.value;
    let stock2 = e.target.stock2.value;
    let period1 = e.target.formDate1.valueAsNumber/1000;
    let period2 = e.target.formDate2.valueAsNumber/1000;

    document.querySelector('.stock1__choice').innerText = stock1;
    document.querySelector('.stock2__choice').innerText = stock2;

    render(stock1,stock2,period1,period2);
};

const reset1 = document.querySelector('.button-reset1')

reset1.addEventListener('click', ()=>{
ballers.classList.add('hide');
main.classList.remove('hide');
location.reload();  
})

const reset2 = document.querySelector('.button-reset2')

reset2.addEventListener('click', ()=>{
losers.classList.add('hide');
main.classList.remove('hide');
location.reload();  
})

Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

const currentFormDate1 = document.getElementById('formDate1')
const currentFormDate2 = document.getElementById('formDate2');
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
currentFormDate1.setAttribute("max", today);
currentFormDate2.setAttribute("max", today);

const render = (stock1, stock2, period1, period2) => {
    console.log(period1)
    console.log(period2);
    axios({
        "method":"GET",
        "url":"https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-historical-data",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key":"56ee66212emsh709c47256074129p1dd988jsnf15cedb971ff",
        "useQueryString":true
        },
        "params":{
        "frequency":"1d",
        "filter":"history",
        "period1": period1,
        "period2":  period2,
        "symbol":stock1
        }
        })
        .then((response)=>{
          
          let response1 = response;
          console.log(response1.data);
          if (response1.data.firstTradeDate < 0){
            alert ("Stock 1 was not listed prior to end date.")
            location.reload();
          }
          axios({
            "method":"GET",
            "url":"https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-historical-data",
            "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"apidojo-yahoo-finance-v1.p.rapidapi.com",
            "x-rapidapi-key":"56ee66212emsh709c47256074129p1dd988jsnf15cedb971ff",
            "useQueryString":true
            },
            "params":{
            "frequency":"1d",
            "filter":"history",
            "period1": period1,
            "period2": period2,
            "symbol":stock2
            }
            })
            .then((response2)=>{
              console.log(response2.data);
              if (response2.data.firstTradeDate < 0){
                alert ("Stock 2 was not listed prior to end date.")
                location.reload();
              } 
              
              if (response1.data === "" || response2.data === ""){
                alert ("You have added an invalid ticker symbol!")
                location.reload();
              } else {

              var size1 = Object.size(response.data.prices);
              var size2 = Object.size(response2.data.prices);
              if (size1 > size2){
                size1 = size2;
              } else if (size1 < size2){
                size2 = size1;
              }

              let firstPrice1 = response1.data.prices[0].close;
              let lastPrice1 = response1.data.prices[size1-1].close;
              let firstProfit1 = ((firstPrice1-lastPrice1)/lastPrice1)*100;
              let profit1 = firstProfit1.toFixed(2);
              console.log(profit1);
              let firstPrice2 = response2.data.prices[0].close;
              let lastPrice2 = response2.data.prices[size2-1].close;
              let firstProfit2 = ((firstPrice2-lastPrice2)/lastPrice2)*100;
              let profit2 = firstProfit2.toFixed(2);
              console.log(profit2);
              
              graph1.addEventListener('click', () => graph1Handler(profit1, profit2));
              graph2.addEventListener('click', () => graph2Handler(profit1, profit2));

              function graph1Handler(profit1, profit2) {
                  battle.classList.add('hide');
                  if(Number(profit1) > Number(profit2)){
                    console.log(profit1);
                    console.log(profit2);
                    ballers.classList.remove('hide');
                    const kanyeIsLaughing = document.querySelector('.audio-kanye');
                    kanyeIsLaughing.play()
                    document.querySelector('.ballers__return').innerText = Math.floor(profit1 - profit2) + '%';
                  } else {
                      losers.classList.remove('hide');
                      const kawhiIsLaughing = document.querySelector('.audio-kawhi');
                    kawhiIsLaughing.play()
                    document.querySelector('.losers__return').innerText = Math.floor(profit1 - profit2) + '%';
                  } 
              }

              function graph2Handler(profit1, profit2) {
                battle.classList.add('hide');
                if(Number(profit2) > Number(profit1)){
                  console.log(profit1);
                  console.log(profit2);
                  ballers.classList.remove('hide');
                  const kanyeIsLaughing = document.querySelector('.audio-kanye');
                  kanyeIsLaughing.play()
                  document.querySelector('.ballers__return').innerText = Math.floor(profit2 - profit1) + '%';
                  
                } else {
                    losers.classList.remove('hide');
                    const kawhiIsLaughing = document.querySelector('.audio-kawhi');
                    kawhiIsLaughing.play()
                    document.querySelector('.losers__return').innerText = Math.floor(profit2 - profit1) + '%';
                }
            }
            }
            })
            .catch((error2)=>{
              console.log(error2)
            })
        })
        .catch((error)=>{
          console.log(error)
    })
    }


