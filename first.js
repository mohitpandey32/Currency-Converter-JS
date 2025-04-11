const BaseApi = "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=0584c1e2d6504f50884f74eaa848ef3f";
let dropdowns = document.querySelectorAll("select");
const Btn = document.getElementById("ExhchangeButton");
const FromCurr = document.getElementById("SelectFrom");
const ToCurr = document.getElementById("SelectTo");
const NewMsg = document.getElementById("GetRate");

for (let select of dropdowns) {
    for (let Currcode in countryList) {
        let NewOption = document.createElement("option");
        NewOption.innerText = Currcode;
        NewOption.value = Currcode;
        if (select.id === "SelectFrom" && Currcode === "USD") {
            NewOption.selected = "selected";
        }
        if (select.id === "SelectTo" && Currcode === "INR") {
            NewOption.selected = "selected";
        }

        select.appendChild(NewOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        if (img) img.src = newSrc;
    }
};

Btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let getAmount = document.getElementById("Amount");
    let AmountVal = getAmount.value;

    try {
        let response = await fetch(BaseApi);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        let data = await response.json();
        if (!data.rates) throw new Error("Invalid API response");

        let fromRate = parseFloat(data.rates[FromCurr.value.toUpperCase()]);
        let toRate = parseFloat(data.rates[ToCurr.value.toUpperCase()]);

        if (!fromRate || !toRate) throw new Error("Exchange rate not found");

        let FinalAmount = (AmountVal / fromRate) * toRate;
        NewMsg.innerText = `${AmountVal} ${FromCurr.value} = ${FinalAmount.toFixed(2)} ${ToCurr.value}`;

    } catch (error) {
        console.error("Error:", error);
        NewMsg.innerText = "Failed to fetch exchange rates. Please check API and try again.";
    }
});
