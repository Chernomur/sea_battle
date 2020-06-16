function draw() {

  let cnv = document.getElementById('MyCanvas');
  let ctx = cnv.getContext('2d');
  let ships = [];
  let field = [];
  cnv.width = 1300;
  cnv.height = 1000;

  ctx.strokeStyle = "black";
  ctx.lineWidth = 6;

  let Ship = function (x, y, w, h,) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selected = false;
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
    }
  };

  function doShips() {
    ships = [];


    ships.push(new Ship(500, 100, 30, 30))
    ships.push(new Ship(500 + 35, 100, 30, 30))
    ships.push(new Ship(500 + 70, 100, 30, 30))
    ships.push(new Ship(500 + 105, 100, 30, 30))

    ships.push(new Ship(500, 100 + 35, 60, 30))
    ships.push(new Ship(500 + 70, 100 + 35, 60, 30))
    ships.push(new Ship(500 + 140, 100 + 35, 60, 30))

    ships.push(new Ship(500, 100 + 2 * 35, 90, 30))
    ships.push(new Ship(500 + 105, 100 + 2 * 35, 90, 30))

    ships.push(new Ship(500, 100 + 3 * 35, 120, 30))
    update();

  }

  let selected = false;

  let mouse = {
    x: 0,
    y: 0,

  }

  class Menu {
    constructor(elem) {
      this._elem = elem;
      elem.onclick = this.onClick.bind(this); // (*)
    }

    doField(matrix) {
      field = [];
      for (let i = 0; i < matrix; i++) {
        for (let j = 0; j < matrix; j++) {
          field.push(new Cell(10 + j * 35, 10 + i * 35, 30, 30))
        }
      }
      update();
    }

    onClick(event) {
      let action = event.target.dataset.action;
      if (action) {
        this["doField"](action);
        doShips();

      }
    };
  }

  new Menu(menu);

  let Cell = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selected = false;
  };

  let fillRect = (x, y, w, h) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, w, h)
  }
  let fillShip = (x, y, w, h) => {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, w, h);
  }

  let strokeRect = (x, y, w, h) => {
    ctx.strokeRect(x, y, w, h)
  }
  let strokeShip = (x, y, w, h) => {
    ctx.strokeRect(x, y, w, h)
  }


  Cell.prototype = {
    draw: function () {
      fillRect(this.x, this.y, this.w, this.h)
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

  cnv.onclick = function (e) {
    let x = e.clientX - cnv.offsetLeft;
    let y = e.clientY - cnv.offsetTop;
    for (let cell in field) {
      if (isCursorInCell(x, y, field[cell])) {
        field[cell].select();
      }
    }
    update();
  }

  let isCursorInShip = function (ship) {
    return mouse.x > ship.x && mouse.x < ship.x + ship.w &&
        mouse.y > ship.y && mouse.y < ship.y + ship.h;
  }

  function update() {

    ctx.clearRect(0, 0, cnv.width, cnv.height)
    for (let i in field) {
      field[i].draw();
      if (field[i].selected) {
        field[i].stroke()
      }
    }

    for (let ship in ships) {
      ships[ship].draw();

      if (isCursorInShip(ships[ship])) {
        ships[ship].stroke();
      }

      if (selected) {
        selected.x = mouse.x - selected.w / 2
        selected.y = mouse.y - selected.h / 2
      }
    }


  }

  window.onmousedown = function () {

    if (!selected) {
      for (let ship in ships) {
        if (isCursorInShip(ships[ship])) {
          selected = ships[ship]
        }
      }

    }
  }

  window.onmouseup = function () {

    selected = false;
    update()
  }


  window.onmousemove = function (e) {
    mouse.x = e.clientX - cnv.offsetLeft;
    mouse.y = e.clientY - cnv.offsetTop;
  }


  setInterval(update, 30)

}