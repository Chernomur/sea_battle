function draw() {

  let cnv = document.getElementById('MyCanvas');
  let ctx = cnv.getContext('2d');
  let ships = [];
  let enemyShips = [];
  let field = [];
  let ports = [];
  let buttons = [];
  let enemyField = [];

  let canMove = true;

  cnv.width = 1300;
  cnv.height = 1000;

  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;

  let selected = false;
  let mouse = {
    x: 0,
    y: 0,
  }

  let Port = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isEmpty = true;
  }
  Port.prototype = {
    draw: function () {
      fillPort(this.x, this.y, this.w, this.h)
    },
    stroke: function () {
      strokePort(this.x, this.y, this.w, this.h)
    },
    select: function () {
      this.isEmpty = !this.isEmpty;
    }
  }

  function doPorts(x, y) {
    ports = [];
    ports.push(new Port(x, y, 30, 30))
    ports.push(new Port(x, y + 35, 65, 65))
    ports.push(new Port(x, y + 3 * 35, 100, 100))
    ports.push(new Port(x, y + 6 * 35, 135, 135))
  }

  let ButtonNext = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isEmpty = false;
  }
  ButtonNext.prototype = {
    draw: function () {
      fillButtonNext(this.x, this.y, this.w, this.h)
    },
    stroke: function () {
      strokeButtonNext(this.x, this.y, this.w, this.h)
    },
    select: function () {
      this.isEmpty = !this.isEmpty;
    }
  }


  let Ship = function (x, y, h, deck) {
    this.x = x;
    this.y = y;
    this.w = deck * 30 + (deck - 1) * 5;
    this.h = h;
    this.top = this.y;
    this.bottom = this.y + this.h;
    this.right = this.x + this.w;
    this.left = this.x;
    this.deck = deck;
    this.selected = false;
    this.onField = false;
    this.hit = deck;
    this.damaged = false;
    this.kill = false;
  }

  function doButtonNext(x, y, w, h) {
    buttons = [];
    buttons.push(new ButtonNext(x, y, w, h))
  }


  Ship.prototype = {
    draw: function () {
      fillShip(this.x, this.y, this.w, this.h)
    },
    stroke: function () {
      strokeShip(this.x, this.y, this.w, this.h)
    },
    select: function () {
      this.selected = !this.selected;
    },
    hitting: function () {
      this.hit--;
    },
    killing: function () {
      this.kill = true;
    },
  };

  // Создание кораблей
  function doShips() {
    ships = [];
    enemyShips = [];

    for (let i = 0; i < 4; i++) {

      for (let j = 4; i < j; j--) {
        ships.push(new Ship(ports[i].x, ports[i].y, 30, i + 1))
        enemyShips.push(new Ship(ports[i].x, ports[i].y, 30, i + 1))
      }
    }

  }


  class Menu {
    constructor(elem) {
      this._elem = elem;
      elem.onclick = this.onClick.bind(this);
    }

    doField(matrix) {
      field = [];
      enemyField = [];
      for (let i = 0; i < matrix; i++) {
        for (let j = 0; j < matrix; j++) {
          field.push(new Cell(10 + j * 35, 10 + i * 35, 30, 30, "blue"))
          enemyField.push(new Cell(700 + j * 35, 10 + i * 35, 30, 30, "gray"))
        }
      }
      update();
    }

    onClick(event) {
      let action = event.target.dataset.action;
      if (action) {
        this["doField"](action);

        doPorts(Math.sqrt(field.length) * 38, 20);
        doShips();
        doButtonNext(Math.sqrt(field.length) * 38, field.length, 100, 30)

      }
    };
  }

  new Menu(menu);

  let Cell = function (x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selected = this.bisy;
    this.bisy = false;
    this.color = color;
    this.shot = false;
    this.kill = false;
  };

  let fillRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h)
  }
  let fillPort = (x, y, w, h) => {
    ctx.fillStyle = "white"
    ctx.fillRect(x, y, w, h);
  }
  let fillShip = (x, y, w, h) => {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
  }
  let fillButtonNext = (x, y, w, h) => {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "black";
    ctx.font = "bold 30px serif";
    ctx.fillText("Battle!", x + 5, y + h - 5)

  }


  let strokeRect = (x, y, w, h) => {
    ctx.strokeRect(x, y, w, h)
  }
  let strokePort = (x, y, w, h) => {
    ctx.strokeRect(x, y, w, h)
  }
  let strokeShip = (x, y, w, h) => {
    ctx.strokeRect(x, y, w, h)
  }
  let strokeButtonNext = (x, y, w, h) => {
    ctx.strokeRect(x, y, w, h)
  }


  Cell.prototype = {
    draw: function () {
      fillRect(this.x, this.y, this.w, this.h, this.color)
    },
    stroke: function () {
      strokeRect(this.x, this.y, this.w, this.h)
    },
    select: function () {
      this.selected = !this.selected;
    }
  };

  let isCursorInCell = function (x, y, cell) {
    return x > cell.x && x < cell.x + cell.w &&
        y > cell.y && y < cell.y + cell.h;
  };

  window.onkeyup = function (e) {

    for (let ship of ships) {
      if (isCursorInShip(ship) && e.code == "ArrowUp" && (ship.onField == false)) {
        let tmp = ship.h
        ship.h = ship.w;
        ship.w = tmp;
      }
    }
    update();

  }

  cnv.oncontextmenu = function (e) {

    if (buttons[0] && buttons[0].isEmpty == false) {

      randomField(field, ships);
    }
    return false;

  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

  let randomField = function (field, ships) {

    for (let ship of ships) {
      ship.onField = false;
      if (Math.random() > 0.4) {
        let tmp = ship.h
        ship.h = ship.w;
        ship.w = tmp;
      }
    }

    while (ships.find(item => item.onField == false)) {

      for (let ship of ships) {
        let r = getRandomInt(0, field.length);

        if (isBisy(field, r, ship.deck, ship)) {

          ship.x = field[r].x;
          ship.y = field[r].y;
          ship.onField = true;


          update()
        }
      }
    }

  }

  let isCursorInShip = function (ship) {
    return mouse.x > ship.x && mouse.x < ship.x + ship.w &&
        mouse.y > ship.y && mouse.y < ship.y + ship.h;
  }

  let isShipOnCell = function (ship, cell) {
    return cell.x >= ship.x && cell.x + cell.w <= ship.x + ship.w &&
        cell.y >= ship.y && cell.y + cell.h <= ship.y + ship.h
  }

  function employmentCheck(field, ships, string = "bisy") {

    let rowL = Math.sqrt(field.length);

    for (let i = 0; field.length > i; i++) {
      for (let ship of ships) {


        if (isShipOnCell(ship, field[i]) && ship.onField == true) {   //занятость клеток под кораблями
          field[i].bisy = true;
          field[i].selected = true;
          if (ship.kill == true) {
            field[i].kill = true;
          }
          break;
        }

        if (!isShipOnCell(ship, field[i])) {
          field[i].selected = false;
          field[i].bisy = false;

        }

      }

      if (selected.x !== field[i].x && selected.y !== field[i].y) {
        selected.onField = false;
      }


      if ((i > Math.sqrt(field.length)) &&
          (i < (field.length - 1 - Math.sqrt(field.length)))) {

        if (((field[i + 1][string] == true) && (Math.floor((i) / rowL) == Math.floor((i + 1) / rowL))) ||
            ((field[i - 1][string] == true) && (Math.floor((i) / rowL) == Math.floor((i - 1) / rowL))) ||
            ((field[i + Math.sqrt(field.length)][string] == true)) ||
            (field[i - Math.sqrt(field.length)][string] == true) ||

            ((field[i - Math.sqrt(field.length) + 1][string] == true) &&
                (Math.floor((i - Math.sqrt(field.length)) / rowL) == Math.floor((i - Math.sqrt(field.length) + 1) / rowL))) ||

            ((field[i - Math.sqrt(field.length) - 1][string] == true) &&
                (Math.floor((i - Math.sqrt(field.length)) / rowL) == Math.floor((i - Math.sqrt(field.length) - 1) / rowL))) ||

            ((field[i + Math.sqrt(field.length) - 1][string] == true)
                && (Math.floor((i + Math.sqrt(field.length)) / rowL) == Math.floor((i + Math.sqrt(field.length) - 1) / rowL))) ||

            (((field[i + Math.sqrt(field.length) + 1][string] == true))
                && (Math.floor((i + Math.sqrt(field.length)) / rowL) == Math.floor((i + Math.sqrt(field.length) + 1) / rowL)))) {

          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }
        }
      }
      // first row
      else if ((i > 0) && (i < Math.sqrt(field.length) - 1)) {

        if (((field[i + 1][string] == true)) ||
            ((field[i - 1][string] == true)) ||

            ((field[i + Math.sqrt(field.length)][string] == true)) ||
            ((field[i + Math.sqrt(field.length) - 1][string] == true)) ||

            (((field[i + Math.sqrt(field.length) + 1][string] == true)))) {

          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }

        }
      }
      // last row
      else if ((i < field.length - 1) && (i > field.length - rowL)) {
        if ((field[i + 1][string] == true) || ((field[i - 1][string] == true)) ||

            ((field[i - Math.sqrt(field.length)][string] == true)) ||
            ((field[i - Math.sqrt(field.length) - 1][string] == true)) ||
            ((field[i - Math.sqrt(field.length) + 1][string] == true))) {

          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }


        }
      }
      //left top
      else if (i == 0) {
        if (((field[i + 1][string] == true)) ||

            ((field[i + Math.sqrt(field.length)][string] == true)) ||

            (((field[i + Math.sqrt(field.length) + 1][string] == true)))) {

          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }

        }
      }
      // right top
      else if (i == Math.sqrt(field.length) - 1) {
        if (((field[i - 1][string] == true)) ||

            ((field[i + Math.sqrt(field.length)][string] == true)) ||

            ((field[i + Math.sqrt(field.length) - 1][string] == true))) {

          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }

        }
      }
      //right down
      else if (i == field.length - 1) {
        if (((field[i - 1][string] == true)) ||

            ((field[i - Math.sqrt(field.length)][string] == true)) ||

            (((field[i - Math.sqrt(field.length) - 1][string] == true)))) {

          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }

        }
      }
      //left down
      else if (i == field.length - rowL) {
        if (
            (field[i + 1][string] == true) ||

            (field[i - rowL][string] == true) ||

            (field[i - rowL + 1][string] == true)
        ) {

          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }

        }
      }
      //left er
      else if (i == rowL) {
        if (
            (field[i + 1].bisy == true) ||

            (field[i + Math.sqrt(field.length)][string] == true) ||

            (field[i + Math.sqrt(field.length) + 1][string] == true) ||

            (field[i - rowL][string] == true) ||

            (field[i - rowL + 1][string] == true)

        ) {
          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }
        }
      }
      //right er
      else if (i == field.length - 1 - rowL) {
        if (
            (field[i - 1][string] == true) ||

            (field[i + Math.sqrt(field.length)][string] == true) ||

            (field[i + Math.sqrt(field.length) - 1][string] == true) ||

            (field[i - rowL][string] == true) ||

            (field[i - rowL - 1][string] == true)

        ) {
          field[i].selected = true;
          if (string == "kill") {
            field[i].shot = true;
          }
        }
      } else {
        field[i].selected = false;
        if (string == "kill") {
          field[i].shot = false;
        }
      }

    }
  }

  let rand = false; // opt
  function update() {
    ctx.clearRect(0, 0, cnv.width, cnv.height)

    for (let cell of field) {
      cell.draw();
      if (cell.selected) {
        cell.stroke()
      }

    }


    for (let port of ports) {
      port.draw();
    }

    if (buttons[0] && buttons[0].isEmpty == true) {

      for (let eCell of enemyField) {

        employmentCheck(enemyField, enemyShips, "kill");
        employmentCheck(enemyField, enemyShips);
        eCell.draw();
        if (isCursorInShip(eCell)) {
          eCell.stroke();
        }

        if (eCell.shot == true) {
          eCell.stroke()
        }
      }


      for (let eShip of enemyShips) {

        if (eShip.hit == 0) {
          eShip.killing();
        }
        if (eShip.kill == true) {
          eShip.draw();
        }


        if (!eShip.onField) {
          eShip.x = ports[eShip.deck - 1].x;
          eShip.y = ports[eShip.deck - 1].y;
        }
      }
      if (rand == false) {

        rand = true;
        randomField(enemyField, enemyShips);
      }
    }

    for (let ship of ships) {
      ship.draw();


      if (ship.hit <= 0) {
        ship.killing();
        ship.draw();
      }

      if ((ship.hit < ship.deck) && (ship.hit > 0)) {
        ship.damaged = true;
      } else {
        ship.damaged = false;
      }

      if (isCursorInShip(ship)) {
        ship.stroke();
      }
      if ((!ships.find(item => item.onField == false) && buttons[0].isEmpty == false)) {
        buttons[0].stroke();
        buttons[0].draw();
      }

      if (selected) {
        if (selected.w > selected.h) {
          selected.x = mouse.x - 15;
          selected.y = mouse.y - selected.h / 3;
        } else {
          selected.y = mouse.y - 15;
          selected.x = mouse.x - selected.w / 3;
        }

      }

      //если корабль не на поле
      if (!ship.onField) {
        ship.x = ports[ship.deck - 1].x;
        ship.y = ports[ship.deck - 1].y;
      }
      //проверка занятости клеток
      employmentCheck(field, ships, "kill")
      employmentCheck(field, ships)


    }

    while ((canMove == false) && (ships.find(item => item.kill == false) != undefined)) {
      let rluck;
      let r = getRandomInt(0, field.length);
      while (field[r].shot == false) {
        for (let ship of ships) {

          if (isShipOnCell(ship, field[r])) {
            shot(r, ship, "darkorange", false)
            rluck = r;
            break;

          } else if (!(isShipOnCell(ship, field[r]))) {
            shot(r, ship, "midnightblue", true)

          }

        }

      }
      if ((ships.find(item => item.kill == false) == undefined)) {

        break;
      }

    }


  }

  function cellsUnderShip(ship, field) {
    let mass = field.filter(function (item) {
      if (isShipOnCell(ship, item)) {
        return true
      }
      else {return false}

    })
    return mass;
  }

  function shot(r, ship, color, move) {
    field[r].shot = true;
    ship.hitting();
    field[r].color = color;
    canMove = move;
  }

  cnv.onclick = function (e) {
    for (let b of buttons) {
      if (isCursorInShip(b)) {
        b.isEmpty = true;
      }

    }
  }

  window.onmousedown = function () {
    if (!selected) {
      for (let ship of ships) {
        if (isCursorInShip(ship)) {
          selected = ship
        }

      }

    }
  }


  let isBisy = function (mass, n, p, ship) {

    let rowL = Math.sqrt(mass.length);
    while (p - 1 >= 0) {


      if (ship.w < ship.h) {

        if ((mass[n + (p - 1) * rowL] == undefined) || (mass[n + (p - 1) * rowL].selected == true)) {
          return false;
        }

      } else {
        if ((mass[n + p - 1] == undefined) || (mass[n + p - 1].selected == true)
            || (Math.floor(n / rowL) != Math.floor((n + p - 1) / rowL))) {
          return false;
        }
      }
      p--;
    }

    return true
  }


  window.onmouseup = function (e) {
    let x = e.pageX - cnv.offsetLeft;
    let y = e.pageY - cnv.offsetTop;

    for (let i = 0; i < field.length; i++) {
      if (isCursorInCell(x, y, field[i]) && field[i].bisy == false && isBisy(field, i, selected.deck, selected)) {
        selected.x = field[i].x;
        selected.y = field[i].y;
        selected.onField = true;
      }
    }
    selected = false;

    for (let eCell of enemyField) {

      for (let eShip of enemyShips) {
        if ((isCursorInCell(x, y, eCell)) && isShipOnCell(eShip, eCell) && (canMove == true)) {
          eCell.shot = true;
          eShip.hitting();
          eCell.color = "darkorange";

        } else if ((isCursorInCell(x, y, eCell)) && (eCell.bisy == false) && (canMove == true)) {
          eCell.shot = true;
          eCell.color = "midnightblue";
          canMove = false;
        }

      }

    }

  }


  window.onmousemove = function (e) {
    mouse.x = e.pageX - cnv.offsetLeft;
    mouse.y = e.pageY - cnv.offsetTop;
  }


  setInterval(update, 60)

}
