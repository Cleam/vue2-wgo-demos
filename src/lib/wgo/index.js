import WGo from './wgo';
import SGF from './SgfParser';
import InvalidMoveError from './InvalidMoveError';
import KNode from './KNode';
import Kifu from './Kifu';
import KifuReader from './KifuReader';

// WGo.InvalidMoveError = InvalidMoveError;
// WGo.SGF = SGF;
// WGo.KNode = KNode;

export { SGF, InvalidMoveError, KNode, Kifu, KifuReader };

export default WGo;
