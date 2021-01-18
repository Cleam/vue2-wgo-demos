<template>
  <div class="demo2">
    <div ref="board"></div>
    <div>
      <button @click="first">开始位置</button>
      <button @click="multiPrev">后退5步</button>
      <button @click="prev">后退1步</button>
      <input v-model="inputValue" type="number" />
      <button @click="next">前进1步</button>
      <button @click="multiNext">前进5步</button>
      <button @click="last">最后一步</button>
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
    const kf = Kifu.fromSgf(
      '(;FF[4]GM[1]SZ[19]CA[UTF-8]SO[gokifu.com]BC[cn]WC[cn]PB[Gu Li]BR[9p]PW[Shi Yue]WR[5p]KM[7.5]DT[2012-10-21]RE[B+R];B[qd];W[dd];B[pq];W[dq];B[fc];W[cf];B[kc];W[qn];B[qp];W[pj];B[qh];W[on];B[pm];W[pn];B[mq];W[od];B[pf];W[qc];B[rc];W[of];B[og];W[pc];B[qk];W[pk];B[qj];W[ql];B[nf];W[rb];B[rd];W[mc];B[do];W[co];B[dp];W[cp];B[eq];W[cn];B[dr];W[cq];B[fp];W[dn];B[fn];W[jp];B[mo];W[gq];B[ho];W[iq];B[jn];W[lp];B[lq];W[kn];B[nm];W[om];B[km];W[in];B[io];W[jo];B[jm];W[lo];B[mp];W[lm];B[ll];W[kq];B[mm];W[ln];B[nk];W[qi];B[ri];W[pi];B[rj];W[op];B[oq];W[ok];B[el];W[dk];B[fj];W[dl];B[rl];W[nj];B[rm];W[mk];B[nl];W[qm];B[kk];W[ph];B[pg];W[mi];B[dg];W[df];B[db];W[eg];B[ei];W[eb];B[fb];W[cb];B[dc];W[cc];B[ed];W[da];B[ec];W[di];B[cd];W[bd];B[de];W[ce];B[dj];W[dh];B[fr];W[gr];B[cj];W[ek];B[ej];W[fk];B[gk];W[gl];B[hk];W[hl];B[il];W[hm];B[im];W[gp];B[fo];W[em];B[hn];W[ic];B[mb];W[nb];B[md];W[lb];B[lc];W[ma];B[kb];W[gg];B[ff];W[fg];B[gi];W[he];B[hd];W[id];B[ie];W[je];B[if];W[jf];B[hf];W[hc];B[nc];W[mb];B[nd];W[gd];B[gf];W[fe];B[ob];W[oc];B[pb];W[oa];B[ee];W[ef];B[ig];W[jg];B[ih];W[qb];B[jd];W[gb];B[jc];W[gc];B[ge];W[fd];B[ea];W[ca];B[ib];W[ga];B[hb];W[fa];B[ha];W[eb];B[kr];W[jr];B[ea];W[rh];B[hd];W[];B[tt])'
    );
    console.log('[SGF解析结果]', kf);
    this.kifuReader = new KifuReader(kf);
    console.log('[kifuReader]', this.kifuReader);
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
  watch: {
    inputValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.inputChange();
      }
    },
  },
  methods: {
    inputChange() {
      // 获取棋谱路径数据
      const path = WGo.clone(this.kifuReader.path);
      // 修改路径跳到指定位置
      path.m = this.inputValue || 0;
      // 更新到指定路径
      this.kifuReader.goTo(path);
      this.update();
    },
    first() {
      console.log('first');
      // this.dispatchUpdate();
      this.kifuReader.first();
      this.update();
    },
    multiPrev() {
      console.log('multiPrev');
      const p = WGo.clone(this.kifuReader.path);
      p.m -= 5;
      this.kifuReader.goTo(p);
      this.update();
    },
    prev() {
      console.log('prev');
      this.kifuReader.previous();
      this.update();
    },
    next() {
      console.log('next');
      this.kifuReader.next(this.kifuReader.node.children.length - 1);
      this.update();
    },
    multiNext() {
      console.log('multiNext');
      const p = WGo.clone(this.kifuReader.path);
      p.m += 5;
      this.kifuReader.goTo(p);
      this.update();
    },
    last() {
      console.log('last');
      // this.dispatchUpdate();
      this.kifuReader.last();
      this.update();
    },
    boardClick(x, y) {
      this.kifuReader.node.appendChild(
        new KNode({
          move: {
            x: x,
            y: y,
            c: this.kifuReader.game.turn,
          },
          _edited: true,
        })
      );
      // 更新数据
      this.kifuReader.next(this.kifuReader.node.children.length - 1);
      // console.log(this.kifuReader.change);
      // 更新棋谱
      this.update();
    },
    update() {
      // 更新计数器
      this.inputValue = this.kifuReader.path.m;
      // 更新棋谱
      this.board.update(this.kifuReader.change);
    },
    initBoardEvent() {
      // 添加鼠标点击事件
      this.board.addEventListener('click', (x, y) => {
        this.boardClick(x, y);
      });
      // 鼠标移入&移出事件
      // let timer = null;
      // let _lastX;
      // let _lastY;
      let _last_mark;
      this.board.addEventListener('mousemove', (x, y) => {
        // _lastX = x;
        // _lastY = y;
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
