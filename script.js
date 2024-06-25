const image = {
    src: [
        "items/mud.png",
         "items/stick.png",
         "items/leather.png",
         "items/wood.png",
         "items/rock.png",
         "items/brick.png",
         "items/copper.png",
         "items/iron.png",
         "items/bronze.png",
         "items/silver.png",
         "items/gold.png",
         "items/obsidian.png",
         "items/quartz.png",
         "items/amethist.png",
         "items/lapis.png",
         "items/ruby.png",
         "items/emerald.png",
         "items/diamond.png",
         "items/redDiamond.png"
         ],
}

const upgrades = {
    cost: [
        10000,
        25000,
        50000,
        100000,
        250000,
        500000,
        1000000,
        2000000,
        5000000,
        10000000,
        25000000,
        50000000,
        100000000,
        200000000,
        500000000,
        1000000000,
        2000000000,
        5000000000
    ],
    boost: [
        1.5,
        2,
        3,
        5,
        7.5,
        10,
        20,
        50,
        100,
        250,
        500,
        1000,
        2500,
        5000,
        10000,
        25000,
        50000
    ]

}

const sound1 = new Audio();
sound1.src = "sounds/click.mp3";

const sound2 = new Audio();
sound2.src = "sounds/bop.mp3";



let intervalId;

let reaction = 0;

let startTime = 0;

let coinAmount = 0;

let itemSpawnTimeout;

let clickedToofast = false;

let upgrade = 0;

let boost = 1;

let bestScore;

let pb = 0;

let attempts = Number(0);

let scoreSum = Number(0);

let avg = 0;

let side = 1;



if (localStorage.getItem('upgrade') == null) {
    localStorage.setItem('upgrade', upgrade);
}
else {
    upgrade = localStorage.getItem('upgrade');
}


if (localStorage.getItem('coins') == null) {
    localStorage.setItem('coins', coinAmount);
}
else {
    coinAmount = localStorage.getItem('coins');
}


if (localStorage.getItem('pb') == null) {
    localStorage.setItem('pb', pb);
}
else {
    pb = localStorage.getItem('pb');
}


if (localStorage.getItem('attempts') == null) {
    localStorage.setItem('attempts', attempts);
}
else {
    attempts = Number(localStorage.getItem('attempts'));
}


if (localStorage.getItem('scoreSum') == null) {
    localStorage.setItem('scoreSum', scoreSum);
}
else {
    scoreSum = Number(localStorage.getItem('scoreSum'));
}

function setAvg() {
    avg = scoreSum / attempts;
    document.getElementById('avg').innerText = avg + " ms"
}

setBoost();

function setBoost() {

    for (let i = 1; i < image.src.length; i++) {
        if (upgrade == i) {
            boost = upgrades.boost[i - 1];
        }
    }
}





let item = document.createElement('img');
item.src = image.src[upgrade];
item.id = "itemImg";
document.getElementById('itemSpawn').appendChild(item);

document.getElementById('coinAmount').innerText = coinAmount;

document.getElementById('pb').innerText = pb + " ms";

function gameStart() {
    const gameTime = (Math.floor(Math.random() * 10000) + 1);

    document.getElementById('gameStartMenu').style.display = "none";
    document.getElementById('gameStartButton2').style.display = "none";
    document.getElementById('timeDisplay').innerText = "0 ms";
    document.getElementById('gameplay').style.display = "block";
    document.getElementById('timeDisplay').style.display = "none";
    document.getElementById('coinsGained').style.display = "none";
    document.getElementById('clickedTooFast').style.display = "none";
    document.getElementById('header').style.display = "none";

    document.getElementById('countdown').innerText = "3";
    sound2.play();

    setTimeout(() => {
        document.getElementById('countdown').innerText = "2";
        sound2.play();
    }, 1000);

    setTimeout(() => {
        document.getElementById('countdown').innerText = "1";
        sound2.play();
    }, 2000);

    setTimeout(() => {
        document.getElementById('countdown').innerText = "start!";
        sound2.play();
    }, 3000);
    setTimeout(() => {
        document.getElementById('countdown').innerText = "";
        document.getElementById('tooFast').style.display = "block"
    }, 3100);

    itemSpawnTimeout = setTimeout(() => {
        document.getElementById('itemSpawn').style.display = "block";
        document.getElementById('timeDisplay').style.display = "block";
        document.getElementById('tooFast').style.display = "none"



        startTime = Date.now() - reaction;
        
        intervalId = setInterval(function(){
            const currentTime = Date.now();
            reaction = currentTime - startTime;
            document.getElementById('timeDisplay').innerText = reaction + " ms";
        }, 1)

    }, (3100 + gameTime));




}

function tooFast() {
    clickedToofast = true;
    gameStop();
    clickedToofast = false;
    document.getElementById('tooFast').style.display = "none"
    document.getElementById('coinsGainedNumber').innerText = "coins gained: 0";

    document.getElementById('clickedTooFast').style.display = "block";

}

function gameStop() {
    
    sound1.play();

    clearTimeout(itemSpawnTimeout);

    document.getElementById('itemSpawn').style.display = "none";
    clearInterval(intervalId);
    document.getElementById('timeDisplay').innerText = "reaction time: " + reaction + " ms";

    if (reaction < pb || pb == 0) {
        pb = reaction;
        localStorage.setItem('pb', pb);
        document.getElementById('pb').innerText = pb + " ms";
    }

       

    document.getElementById('gameStartButton2').style.display = "block";
    document.getElementById('tooFast').style.display = "none"

    document.getElementById('header').style.display = "flex";
    document.getElementById('coinsGained').style.display = "flex";

    let coinsGained = 0;

    if (clickedToofast == false) {
        if (reaction < 150) {
            coinsGained = ((500 - reaction) * 10) * boost;
        }
        
        else if (reaction < 200) {
            coinsGained = ((500 - reaction) * 5) * boost;
        }
        else if (reaction < 250) {
            coinsGained = ((500 - reaction) * 2) * boost;
        }
        else if (reaction < 500) {
            coinsGained = ((500 - reaction) * 1) * boost;
            }
        else if (reaction == 500 || reaction > 500) {
            coinsGained = 0;
        }

        coinAmount = Number(coinAmount) + Number(coinsGained);

        localStorage.setItem('coins', coinAmount);
        document.getElementById('coinAmount').innerHTML = Number(coinAmount);

        
        document.getElementById('coinsGainedNumber').innerText = "coins gained: " + coinsGained; 

        attempts += 1;
        localStorage.setItem('attempts', attempts);

        scoreSum += reaction;
        localStorage.setItem('scoreSum', scoreSum);

        setAvg()
    }

    document.getElementById('coinsGained').style.display = "flex";

    reaction = 0;
    coinsGained = 0;
}


function shopOpen() {
    document.getElementById('shopIcon').style.display = "none";
    document.getElementById('closeShopIcon').style.display = "block";
    document.getElementById('gameStartMenu').style.display = "none";
    document.getElementById('gameplay').style.display = "none";
    document.getElementById('shop').style.display = "flex";
    document.getElementById('statsThings').style.display = "none";

    for (let i = 1; i < image.src.length; i++) {
        if (upgrade >= i) {
            document.getElementById(`cantAfford${i}`).style.display = "none";
            document.getElementById(`buyButton${i}`).style.display = "none";
            document.getElementById(`boughtButton${i}`).style.display = "block";
        }
        else {
            if (coinAmount >= upgrades.cost[i - 1]) {
                document.getElementById(`cantAfford${i}`).style.display = "none";
                document.getElementById(`buyButton${i}`).style.display = "block";
            }
            else if (upgrade >= i - 1) {
                document.getElementById(`cantAfford${i}`).style.display = "flex";
                document.getElementById(`buyButton${i}`).style.display = "none";
            }
        }
    }

    sound1.play();

}

function shopClose() {
    document.getElementById('shopIcon').style.display = "block";
    document.getElementById('closeShopIcon').style.display = "none";
    document.getElementById('gameStartMenu').style.display = "block";
    document.getElementById('shop').style.display = "none";
    document.getElementById('statsThings').style.display = "block";

    sound1.play();
}


function buyUpgrade(currentUpgrade, price) {
    if (upgrade == currentUpgrade) {
        upgrade = currentUpgrade + 1;
        localStorage.setItem('upgrade', upgrade);
        setBoost();

        coinAmount -= price;
        localStorage.setItem('coins', coinAmount);

        document.getElementById('coinAmount').innerText = coinAmount;

        shopOpen();
        item.src = image.src[upgrade];
    }

    sound1.play();
}

function statsOpen() {
    document.getElementById('gameStartMenu').style.display = "none";
    document.getElementById('gameplay').style.display = "none";
    document.getElementById('closeShopIcon').style.display = "none";
    document.getElementById('shop').style.display = "none";
    document.getElementById('shopThings').style.display = "none";
    document.getElementById('statsIcon').style.display = "none";

    document.getElementById('closeStatsIcon').style.display = "block";
    document.getElementById('stats').style.display = "block";


    sound1.play();
    setAvg()


}

function statsClose() {
    document.getElementById('shopThings').style.display = "flex";
    document.getElementById('gameStartMenu').style.display = "block";
    document.getElementById('statsIcon').style.display = "block";

    document.getElementById('closeStatsIcon').style.display = "none";
    document.getElementById('stats').style.display = "none";

    sound1.play();
}

function sideChange(right) {
    sound1.play();
    let s;

    if (right == true) {
        if (side < 2) {
            s = 1;
        }
        else {
            s = 0;
        }
    } else {
        if (side >= 2) {
            s = -1;
        }
        else {
            s = 0;
        }
        
    }
        document.getElementById(`side${side}`).style.display = "none";
        document.getElementById(`pageNumber${side}`).style.display = "none";
        side = side + s;
        document.getElementById(`side${side}`).style.display = "flex";
        document.getElementById(`pageNumber${side}`).style.display = "block";
}