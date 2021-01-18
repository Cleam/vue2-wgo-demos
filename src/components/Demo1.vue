<template>
  <div class="demo1">
    <!-- Dropdown menu for selecting tool -->
    <select ref="tool" style="display: block; margin-bottom: 10px">
      <option value="black" selected>黑子</option>
      <option value="white">白子</option>
      <option value="SQ">正方形</option>
      <option value="TR">三角形</option>
      <option value="CR">圆形</option>
      <option value="plane">飞机</option>
      <option value="remove">删除</option>
    </select>
    <button @click="addStone">addStone</button>
    <div ref="board">
      <!-- board will go here -->
    </div>
  </div>
</template>

<script>
import WGo from './lib/wgo';
import bgImg from './assets/wood_1024.jpg';
export default {
  data() {
    return {
      cur: WGo.B,
    };
  },
  mounted() {
    console.log(WGo.DIR);
    const game = (this.game = new WGo.Game());
    const board = (this.board = new WGo.Board(this.$refs.board, {
      // size: 19,
      width: 600,
      background: bgImg,
      section: {
        top: -0.5,
        left: -0.5,
        // top: 12,
        // left: 6,
        right: -0.5,
        bottom: -0.5,
      },
    }));
    const plane = {
      // draw on stone layer
      stone: {
        // draw function is called in context of CanvasRenderingContext2D, so we can paint immediately using this
        draw: function(args, board) {
          const xr = board.getX(args.x), // get absolute x coordinate of intersection
            yr = board.getY(args.y), // get absolute y coordinate of intersection
            sr = board.stoneRadius; // get field radius in px
          console.log(xr, yr, sr);
          // if there is a black stone, draw white plane
          if (board.obj_arr[args.x][args.y][0].c == WGo.B) {
            this.strokeStyle = 'white';
          } else {
            this.strokeStyle = 'black';
          }

          this.lineWidth = 3;

          this.beginPath();

          this.moveTo(xr - sr * 0.8, yr);
          this.lineTo(xr + sr * 0.5, yr);
          this.lineTo(xr + sr * 0.8, yr - sr * 0.25);
          this.moveTo(xr - sr * 0.4, yr);
          this.lineTo(xr + sr * 0.3, yr - sr * 0.6);
          this.moveTo(xr - sr * 0.4, yr);
          this.lineTo(xr + sr * 0.3, yr + sr * 0.6);

          this.stroke();
        },
      },
    };
    console.log(plane);
    const tool = this.$refs.tool; // get the <select> element
    console.log(tool);
    // 添加鼠标点击事件
    board.addEventListener('click', (x, y) => {
      console.log(x, y);
      // if (tool.value == 'black') {
      //   board.addObject({
      //     x: x,
      //     y: y,
      //     c: WGo.B,
      //   });
      // } else if (tool.value == 'white') {
      //   board.addObject({
      //     x: x,
      //     y: y,
      //     c: WGo.W,
      //   });
      // } else if (tool.value == 'remove') {
      //   board.removeObjectsAt(x, y);
      // } else if (tool.value == 'plane') {
      //   board.addObject({
      //     x: x,
      //     y: y,
      //     type: plane,
      //   });
      // } else {
      //   board.addObject({
      //     x: x,
      //     y: y,
      //     type: tool.value,
      //   });
      // }
      // 数据
      // 视图
      board.addObject({
        x: x,
        y: y,
        c: game.turn,
      });
      console.log('[game.turn]', game.turn);
      game.play(x, y);
      // console.log(game.play(x, y, this.cur));
      // this.cur = this.cur === WGo.B ? WGo.W : WGo.B;

      // 获取当前棋盘状态
      // console.log('[getState]', board.getState());
      // board.restoreState(state);
      console.log('[getPosition]', game.getPosition());
    });
    // 鼠标移入&移出事件
    let _last_mark;
    board.addEventListener('mousemove', (x, y) => {
      // if (timer) {
      //   clearTimeout(timer);
      // }
      // timer = setTimeout(() => {}, 30);
      // console.log('[mousemove]', x, y);
      // game.play(x, y);
      // if (pos && pos.x >= 0 && pos.y >= 0) {
      //   board.removeObjectsAt(pos.x, pos.y);
      // }
      // pos = { x, y };
      // board.addObject({ x, y, type: 'outline' });

      if (_last_mark) {
        board.removeObject(_last_mark);
      }
      if (x != -1 && y != -1 && game.isValid(x, y)) {
        _last_mark = {
          type: 'outline',
          x: x,
          y: y,
          c: game.turn, // 1： 黑子，-1： 白子
        };
        board.addObject(_last_mark);
      } else {
        _last_mark = null;
      }
    });
    // board.addEventListener('mouseout', (x, y) => {
    //   console.log('[mouseout]', x, y);
    // });
    // board.removeEventListener(name, callback)

    var coordinates = {
      // draw on grid layer
      grid: {
        draw: function(args, board) {
          var ch, t, xright, xleft, ytop, ybottom;

          this.fillStyle = 'rgba(0,0,0,0.7)';
          this.textBaseline = 'middle';
          this.textAlign = 'center';
          this.font = board.stoneRadius + 'px ' + (board.font || '');

          xright = board.getX(-0.75);
          xleft = board.getX(board.size - 0.25);
          ytop = board.getY(-0.75);
          ybottom = board.getY(board.size - 0.25);

          for (var i = 0; i < board.size; i++) {
            ch = i + 'A'.charCodeAt(0);
            if (ch >= 'I'.charCodeAt(0)) ch++;

            t = board.getY(i);
            this.fillText(board.size - i, xright, t);
            this.fillText(board.size - i, xleft, t);

            t = board.getX(i);
            this.fillText(String.fromCharCode(ch), t, ytop);
            this.fillText(String.fromCharCode(ch), t, ybottom);
          }

          this.fillStyle = 'black';
        },
      },
    };
    // 添加自定义canvas对象到棋盘
    board.addCustomObject(coordinates);
    // 删除自定义对象
    // board.removeCustomObject(handler, args)
    // // 获取棋盘section配置
    // console.log(board.getSection()); // {top: -0.5, left: -0.5, right: -0.5, bottom: -0.5}
    // // 根据棋盘坐标位置获取canvas坐标位置
    // console.log(board.getX(11)); // 11: 代表第12列，size为19时，取值范围就是0~18
    // console.log(board.getY(0)); // 0: 代表第1行
    // // 添加对象到棋盘指定位置
    // board.addObject([
    //   { x: 0, y: 0, c: WGo.B },
    //   { x: 1, y: 1, type: 'MA' },
    //   { x: 5, y: 1, type: 'LB', text: 'Hello' },
    //   { x: 5, y: 2, c: WGo.W },
    //   { x: 5, y: 2, type: 'LB', text: 'World' },
    //   { x: 2, y: 2, type: 'SL' },
    //   { x: 3, y: 2, type: 'MONO' },
    //   { x: 4, y: 3, type: 'GlOW' },
    //   { x: 2, y: 4, type: 'PAINTED' },
    //   { x: 2, y: 3, type: 'outline' },
    //   { x: 2, y: 1, type: 'mini' },
    // ]);
    // // 删除棋盘指定位置上的对象
    // board.removeObjectsAt(0, 0);

    // const pos2 = new WGo.Position();
    // pos2.set(0, 2, { name: 'xxxx' });
    // console.log(pos2.get(0, 2));

    // const game = new WGo.Game();
    console.log(game.size); // 19
    console.log(game.repeating); // KO
    console.log(game.turn); // 1
    console.log('[getPosition]', game.getPosition());
    // game.getStone(3, 12);
  },
  methods: {
    addStone() {
      // addStone和setStone唯一区别就是
      // addStone先判断位置上有没有内容，没有就添加，有就不添加。
      // setStone不做判断，直接添加。
      this.game.addStone(0, 0, 1);
      this.game.setStone(1, 1, -1);
      console.log(this.game.getPosition());
      console.log(this.game.position);
    },
  },
  setup() {},
};
</script>

<style></style>
