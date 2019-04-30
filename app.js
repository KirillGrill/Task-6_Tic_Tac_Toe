var GAME = {
    username: '',
    server: 'https://ttt-practice.azurewebsites.net/',
    start: '/start',
    waitMove: '/waitMove',
    makeMove: '/makeMove',
    id: '',
    isCanMove: false,
    yourIcon: '',
    competitorsIcon: ''
};

function start() {
    const username = document.getElementById('nameField');
    const icon = document.getElementById('iconSelector');
    if(!username.value){
        alert('to playing you must input your name');
        return;
    }
    GAME.username = username.value;
    GAME.yourIcon = icon.value;
    if(GAME.yourIcon === '0'){
        GAME.competitorsIcon = 'X';
    }else {
        GAME.competitorsIcon = '0';
    }

    let init = {
        method: 'GET',
    };

    fetch(GAME.server + GAME.start + '?name=' + GAME.username, init)
        .then(startResponse)
}

function move(e) {
    if (!e || !e.target || e.target.tagName !== 'TD' || !GAME.isCanMove) {
        return;
    }
    e.target.innerHTML = GAME.yourIcon;
    let cell = e.target.dataset.cell;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    console.log({name: GAME.username, id: GAME.id, move: cell});
    let body = JSON.stringify({name: GAME.username, id: GAME.id, move: cell});

    let init = {
        method: 'POST',
        headers: headers,
        body: body
    };

    fetch(GAME.server + GAME.makeMove, init)
        .then(makeMoveResponse)
        .then(waitMove)


}

function waitMove () {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = JSON.stringify({name: GAME.username, id: GAME.id});

    let init = {
        method: 'POST',
        headers: headers,
        body: body
    };

    fetch(GAME.server + GAME.waitMove, init)
        .then(waitMoveResponse);
}

async function startResponse(response) {
    let json = await response.json();
    if(!json.ok){
        console.log(json.reason);
        return;
    }
    let data = json.data;
    GAME.isCanMove = data.canMove;
    GAME.id = data.id;
    console.log(json);
}

async function makeMoveResponse(response) {
    let json = await response.json();
    console.log(json);
    if(!json.ok){
        console.log(json.reason);
        return;
    }

    let data = json.data;
    if(data.win) {
        switch (data.win) {
            case 0:
                alert('You lose');
                break;
            case 1:
                alert('You win');
                break;
            case 2:
                alert('Dead heat');
                break;
        }
    }
}

async function waitMoveResponse(response) {
    let json = await response.json();
    console.log(json);
    if(!json.ok){
        console.log(json.reason);
        return;
    }
    let data = json.data;
    const competitorsMove = document.getElementById(`${data.move}`);
    competitorsMove.innerHTML = GAME.competitorsIcon;

    if(data.win) {
        switch (data.win) {
            case 0:
                alert('You lose');
                break;
            case 1:
                alert('You win');
                break;
            case 2:
                alert('Dead heat');
                break;
        }
    }

}
