import WGo from './wgo';
// Class handling invalid moves in kifu
var InvalidMoveError = function(code, node) {
  this.name = 'InvalidMoveError';
  this.message = 'Invalid move in kifu detected. ';

  if (
    node.move &&
    node.move.c !== undefined &&
    node.move.x !== undefined &&
    node.move.y !== undefined
  ) {
    // var letter = node.move.x;
    // if (node.move.x > 7) letter++;
    // letter = String.fromCharCode(letter + 65);
    this.message +=
      'Trying to play ' +
      (node.move.c == WGo.WHITE ? 'white' : 'black') +
      ' move on ' +
      String.fromCharCode(node.move.x + 65) +
      '' +
      (19 - node.move.y);
  } else this.message += "Move object doesn't contain arbitrary attributes.";

  if (code) {
    switch (code) {
      case 1:
        this.message += ', but these coordinates are not on board.';
        break;
      case 2:
        this.message += ', but there already is a stone.';
        break;
      case 3:
        this.message += ', but this move is a suicide.';
        break;
      case 4:
        this.message += ', but this position already occured.';
        break;
    }
  } else this.message += '.';
};
InvalidMoveError.prototype = new Error();
InvalidMoveError.prototype.constructor = InvalidMoveError;

// WGo.InvalidMoveError = InvalidMoveError;
export default InvalidMoveError;
