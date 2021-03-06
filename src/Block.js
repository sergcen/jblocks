var helpers = require('./helpers');

/**
 * Block's constructor
 */
var Block = function(block) {
    var name = block.data('b');
    var params = block.data('p');
    var decl = helpers.decls[name];

    if (!decl) {
        throw new Error(name + ' block is not declared');
    }

    var info = {
        name: name,
        params: params,
        $node: block,
        _id: helpers.guid()
    };
    $.extend(this, info, decl.methods);

    this._addEvents();
    this._setInited();
    this._trigger('b-inited');
};

/**
 * Adds events to block's node according its decl
 */
Block.prototype._addEvents = function() {
    var decl = helpers.decls[this.name];
    var events = decl.events;

    for (var e in events) {
        if (events.hasOwnProperty(e)) {
            var p = e.split(' ',2);
            var handler = events[e];
            if (typeof handler === 'string') {
                handler = decl.methods[handler];
            }

            this.$node.on(p[0], p[1], handler.bind(this));
        }
    }
};

/**
 * Mark the block as inited
 */
Block.prototype._setInited = function() {
    this.$node.addClass('jb-inited');
};

/**
 * Triggers specified event
 */
Block.prototype._trigger = function(name) {
    this.$node.trigger(name);
};

/**
 * Removes block from cache and triggers b-destroy event
 */
Block.prototype.destroy = function() {
    helpers.cache[this._id] = null;
    this.$node.removeClass('jb-inited');
    this.$node.off();
    this._trigger('b-destroyed');
};

module.exports = Block;
