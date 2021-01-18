var no_add = function(arr, obj, key) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].x == obj.x && arr[i].y == obj.y) {
      arr[i][key] = obj[key];
      return;
    }
  }
  arr.push(obj);
};

var no_remove = function(arr, obj) {
  if (!arr) return;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].x == obj.x && arr[i].y == obj.y) {
      arr.splice(i, 1);
      return;
    }
  }
};

/**
 * Node class of kifu game tree. It can contain move, setup or markup properties.
 *
 * @param {object} properties
 * @param {KNode} parent (null for root node)
 */

var KNode = function(properties, parent) {
  this.parent = parent || null;
  this.children = [];
  // save all properties
  if (properties) for (var key in properties) this[key] = properties[key];
};

KNode.prototype = {
  constructor: KNode,

  /**
   * Get node's children specified by index. If it doesn't exist, method returns null.
   */

  getChild: function(ch) {
    var i = ch || 0;
    if (this.children[i]) return this.children[i];
    else return null;
  },

  /**
   * Add setup property.
   *
   * @param {object} setup object with structure: {x:<x coordinate>, y:<y coordinate>, c:<color>}
   */

  addSetup: function(setup) {
    this.setup = this.setup || [];
    no_add(this.setup, setup, 'c');
    return this;
  },

  /**
   * Remove setup property.
   *
   * @param {object} setup object with structure: {x:<x coordinate>, y:<y coordinate>}
   */

  removeSetup: function(setup) {
    no_remove(this.setup, setup);
    return this;
  },

  /**
   * Add markup property.
   *
   * @param {object} markup object with structure: {x:<x coordinate>, y:<y coordinate>, type:<type>}
   */

  addMarkup: function(markup) {
    this.markup = this.markup || [];
    no_add(this.markup, markup, 'type');
    return this;
  },

  /**
   * Remove markup property.
   *
   * @param {object} markup object with structure: {x:<x coordinate>, y:<y coordinate>}
   */

  removeMarkup: function(markup) {
    no_remove(this.markup, markup);
    return this;
  },

  /**
   * Remove this node.
   * Node is removed from its parent and children are passed to parent.
   */

  remove: function() {
    var p = this.parent;
    if (!p) throw new Error('Root node cannot be removed');
    for (var i in p.children) {
      if (p.children[i] == this) {
        p.children.splice(i, 1);
        break;
      }
    }
    p.children = p.children.concat(this.children);
    this.parent = null;
    return p;
  },

  /**
   * Insert node after this node. All children are passed to new node.
   */

  insertAfter: function(node) {
    for (var child in this.children) {
      this.children[child].parent = node;
    }
    node.children = node.children.concat(this.children);
    node.parent = this;
    this.children = [node];
    return node;
  },

  /**
   * Append child node to this node.
   */

  appendChild: function(node) {
    node.parent = this;
    this.children.push(node);
    return node;
  },

  /**
   * Get properties as object.
   */

  getProperties: function() {
    var props = {};
    for (var key in this) {
      // this.hasOwnProperty(key)
      // Object.prototype.hasOwnProperty.call(this, key);
      if (
        Object.prototype.hasOwnProperty.call(this, key) &&
        key != 'children' &&
        key != 'parent' &&
        key[0] != '_'
      )
        props[key] = this[key];
    }
    return props;
  },
};

export default KNode;
