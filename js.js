function draw() {
  let cnv = document.getElementById('MyCanvas');
  let ctx = cnv.getContext('2d');
  let matrix = prompt('matrix');
  let field = [];

  ctx.fillStyle = "green";
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;

  let Cell = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.selected = false;
  };

  let fillRect = (x, y, w, h) => {
    ctx.fillRect(x, y, w, h)
  }

  let strokeRect = (x, y, w, h) => {
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

  for (let i = 0; i < matrix; i++) {
    for (let j = 0; j < matrix; j++) {
      field.push(new Cell(10 + j * 35, 10 + i * 35, 30, 30))
    }
  }

  let isCursorInCell = function (x, y, cell) {
    /*
        console.log(cell.x );
        console.log(cell.w );
    */
    return x > cell.x && x < cell.x + cell.w &&
        y > cell.y && y < cell.y + cell.h;
  };

  cnv.onclick = function (e) {
    let x = e.pageX - 8;
    let y = e.pageY - 8;
    /*    Сделать курсор по элементу */
    for (let cell in field) {
      if (isCursorInCell(x, y, field[cell])) {
        field[cell].select();
      }
    }

  }

  setInterval(function () {

    ctx.clearRect(0, 0, 1000, 1000)
    for (let i in field) {
      field[i].draw();
      if (field[i].selected) {
        field[i].stroke()
      }
    }
  }, 30)

}
