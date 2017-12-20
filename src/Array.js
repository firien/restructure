// Generated by CoffeeScript 1.12.2
(function() {
  var ArrayT, NumberT, utils;

  NumberT = require('./Number').Number;

  utils = require('./utils');

  ArrayT = (function() {
    function ArrayT(type, length1, lengthType) {
      this.type = type;
      this.length = length1;
      this.lengthType = lengthType != null ? lengthType : 'count';
    }

    ArrayT.prototype.decode = function(stream, parent) {
      var ctx, i, j, length, pos, ref, res, target;
      pos = stream.pos;
      res = [];
      ctx = parent;
      if (this.length != null) {
        length = utils.resolveLength(this.length, stream, parent);
      }
      if (this.length instanceof NumberT) {
        Object.defineProperties(res, {
          parent: {
            value: parent
          },
          _startOffset: {
            value: pos
          },
          _currentOffset: {
            value: 0,
            writable: true
          },
          _length: {
            value: length
          }
        });
        ctx = res;
      }
      if ((length == null) || this.lengthType === 'bytes') {
        target = length != null ? stream.pos + length : (parent != null ? parent._length : void 0) ? parent._startOffset + parent._length : stream.length;
        while (stream.pos < target) {
          res.push(this.type.decode(stream, ctx));
        }
      } else {
        for (i = j = 0, ref = length; j < ref; i = j += 1) {
          res.push(this.type.decode(stream, ctx));
        }
      }
      return res;
    };

    ArrayT.prototype.size = function(array, ctx) {
      var item, j, len, size;
      if (!array) {
        return this.type.size(null, ctx) * utils.resolveLength(this.length, null, ctx);
      }
      size = 0;
      if (this.length instanceof NumberT) {
        size += this.length.size();
        ctx = {
          parent: ctx
        };
      }
      for (j = 0, len = array.length; j < len; j++) {
        item = array[j];
        size += this.type.size(item, ctx);
      }
      return size;
    };

    ArrayT.prototype.encode = function(stream, array, parent) {
      var ctx, i, item, j, len, ptr;
      ctx = parent;
      if (this.length instanceof NumberT) {
        ctx = {
          pointers: [],
          startOffset: stream.pos,
          parent: parent
        };
        ctx.pointerOffset = stream.pos + this.size(array, ctx);
        this.length.encode(stream, array.length);
      }
      for (j = 0, len = array.length; j < len; j++) {
        item = array[j];
        this.type.encode(stream, item, ctx);
      }
      if (this.length instanceof NumberT) {
        i = 0;
        while (i < ctx.pointers.length) {
          ptr = ctx.pointers[i++];
          ptr.type.encode(stream, ptr.val);
        }
      }
    };

    return ArrayT;

  })();

  module.exports = ArrayT;

}).call(this);
