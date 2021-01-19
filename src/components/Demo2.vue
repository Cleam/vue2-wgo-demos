<template>
  <div class="demo2">
    <div ref="board"></div>
    <div>
      <hr />
      <div class="ctrl-wrap">
        <button @click="first">开始位置</button>
        <button @click="multiPrev">后退10步</button>
        <button @click="prev">后退1步</button>
        <input v-model="inputValue" type="number" />
        <button @click="next">前进1步</button>
        <button @click="multiNext">前进10步</button>
        <button @click="last">最后一步</button>
      </div>
      <hr />
      <button @click="reset">重置</button>
    </div>
  </div>
</template>

<script>
import WGo, { Kifu, KNode, KifuReader } from '@/lib/wgo';
import bgImg from '@/assets/wood_1024.jpg';
export default {
  data() {
    return {
      inputValue: 0,
    };
  },
  mounted() {
    this.clickLastIndex = 0;
    this.init();
  },
  watch: {
    inputValue(val, oldVal) {
      oldVal = parseInt(oldVal);
      val = parseInt(val);
      if (oldVal !== val) {
        console.log('val', val);
        this.goTo(val);
      }
    },
  },
  methods: {
    init() {
      const kf = Kifu.fromSgf(
        '(;FF[4]GM[1]SZ[19]CA[UTF-8]SO[gokifu.com]BC[cn]WC[cn]PB[Gu Li]BR[9p]PW[Shi Yue]WR[5p]KM[7.5]DT[2012-10-21]RE[B+R];B[qd];W[dd];B[pq];W[dq];B[fc];W[cf];B[kc];W[qn];B[qp];W[pj];B[qh];W[on];B[pm];W[pn];B[mq];W[od];B[pf];W[qc];B[rc];W[of];B[og];W[pc];B[qk];W[pk];B[qj];W[ql];B[nf];W[rb];B[rd];W[mc];B[do];W[co];B[dp];W[cp];B[eq];W[cn];B[dr];W[cq];B[fp];W[dn];B[fn];W[jp];B[mo];W[gq];B[ho];W[iq];B[jn];W[lp];B[lq];W[kn];B[nm];W[om];B[km];W[in];B[io];W[jo];B[jm];W[lo];B[mp];W[lm];B[ll];W[kq];B[mm];W[ln];B[nk];W[qi];B[ri];W[pi];B[rj];W[op];B[oq];W[ok];B[el];W[dk];B[fj];W[dl];B[rl];W[nj];B[rm];W[mk];B[nl];W[qm];B[kk];W[ph];B[pg];W[mi];B[dg];W[df];B[db];W[eg];B[ei];W[eb];B[fb];W[cb];B[dc];W[cc];B[ed];W[da];B[ec];W[di];B[cd];W[bd];B[de];W[ce];B[dj];W[dh];B[fr];W[gr];B[cj];W[ek];B[ej];W[fk];B[gk];W[gl];B[hk];W[hl];B[il];W[hm];B[im];W[gp];B[fo];W[em];B[hn];W[ic];B[mb];W[nb];B[md];W[lb];B[lc];W[ma];B[kb];W[gg];B[ff];W[fg];B[gi];W[he];B[hd];W[id];B[ie];W[je];B[if];W[jf];B[hf];W[hc];B[nc];W[mb];B[nd];W[gd];B[gf];W[fe];B[ob];W[oc];B[pb];W[oa];B[ee];W[ef];B[ig];W[jg];B[ih];W[qb];B[jd];W[gb];B[jc];W[gc];B[ge];W[fd];B[ea];W[ca];B[ib];W[ga];B[hb];W[fa];B[ha];W[eb];B[kr];W[jr];B[ea];W[rh];B[hd];W[];B[tt])'
      );
      console.log('[SGF解析结果]', kf, kf.toJGO());
      this.kf = kf.clone();
      // this.originalReader.goTo(this.kifuReader.path);
      this.kifuReader = new KifuReader(kf, true);
      console.log('[kifuReader]', this.kifuReader);
      this.originalReader = new KifuReader(kf.clone(), true);
      this.board = new WGo.Board(this.$refs.board, {
        size: 19,
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
      });
      this.initBoardEvent();
      this.last();
    },
    reset() {
      this.originalReader.goTo(this.kifuReader.path);
      const posDiff = function(old_p, new_p) {
        const size = old_p.size;
        const add = [];
        const remove = [];
        for (let i = 0; i < size * size; i++) {
          if (old_p.schema[i] && !new_p.schema[i])
            remove.push({ x: Math.floor(i / size), y: i % size });
          else if (old_p.schema[i] != new_p.schema[i])
            add.push({ x: Math.floor(i / size), y: i % size, c: new_p.schema[i] });
        }
        return {
          add: add,
          remove: remove,
        };
      };
      this.originalReader.change = posDiff(
        this.kifuReader.getPosition(),
        this.originalReader.getPosition()
      );
      this.kifuReader = this.originalReader;
      this.last();
      this.originalReader = new KifuReader(this.kf.clone(), true);
    },
    first() {
      // console.log('first');
      this.kifuReader.first();
      this.update();
    },
    last() {
      // console.log('last');
      this.kifuReader.last();
      this.update();
    },
    multiPrev() {
      const p = WGo.clone(this.kifuReader.path);
      p.m -= 10;
      this.goTo(p);
    },
    multiNext() {
      const p = WGo.clone(this.kifuReader.path);
      p.m += 10;
      this.goTo(p);
    },
    goTo(move) {
      let path;
      if (typeof move == 'number') {
        path = WGo.clone(this.kifuReader.path);
        path.m = move || 0;
      } else {
        path = move;
      }
      // console.log('multiPrev');
      this.kifuReader.goTo(path);
      this.update();
    },
    prev() {
      // console.log('prev');
      this.kifuReader.previous();
      this.update();
    },
    next() {
      // console.log('next');
      this.kifuReader.next(this.kifuReader.node.children.length - 1);
      this.update();
    },
    boardClick(x, y) {
      if (!this.kifuReader.game.isValid(x, y)) return;
      const kn = new KNode({
        move: {
          x: x,
          y: y,
          c: this.kifuReader.game.turn,
        },
        _edited: true,
      });
      kn.addMarkup({
        x: x,
        y: y,
        type: 'LB',
        text: ++this.clickLastIndex,
        // _c: -this.kifuReader.game.turn,
      });
      this.kifuReader.node.appendChild(kn);
      this.next();
    },
    update() {
      // 更新棋谱
      const kr = this.kifuReader;
      // update board's position
      if (kr.change) this.board.update(kr.change);
      if (this.clickStack) this.board.removeObject(this.clickStack);
      let add = [];
      let krNode = kr.node;
      console.log('[krNode]', krNode, kr.change);
      while (krNode.markup) {
        add = add.concat(krNode.markup);
        krNode = krNode.parent;
      }
      // 标记已经吃掉的棋子
      if (kr.change && kr.change.remove.length > 0) {
        for (let i = 0; i < add.length; i++) {
          kr.change.remove.forEach(rm => {
            if (rm.x == add[i].x && rm.y == add[i].y) {
              add[i]._captrued = true;
              add[i]._m = kr.path.m;
              // add.splice(i, 1);
            }
          });
        }
      }
      add = add.filter(s => !(s._captrued && s._m <= kr.path.m));
      this.board.addObject(add);
      this.clickStack = add;
      if (this.clickStack.length > 0) {
        this.clickLastIndex = parseInt(this.clickStack[0].text);
      }
      // 更新计数器
      this.inputValue = this.kifuReader.path.m;
    },
    initBoardEvent() {
      // 添加鼠标点击事件
      this.board.addEventListener('click', (x, y) => {
        this.boardClick(x, y);
      });
      // 鼠标移入&移出事件
      let _last_mark;
      this.board.addEventListener('mousemove', (x, y) => {
        if (_last_mark) {
          this.board.removeObject(_last_mark);
        }
        if (x != -1 && y != -1 && this.kifuReader.game.isValid(x, y)) {
          _last_mark = {
            type: 'outline',
            x: x,
            y: y,
            c: this.kifuReader.game.turn, // 1： 黑子，-1： 白子
          };
          this.board.addObject(_last_mark);
        } else {
          _last_mark = null;
        }
      });
    },
  },
};
</script>

<style></style>
