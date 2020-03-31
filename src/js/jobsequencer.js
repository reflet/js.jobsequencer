window.JobSequencer = function () { return this.init.apply(this, arguments); };
JobSequencer.prototype = {
    init: function (params) {
        params = params || {};

        var self = this;
        self._queue   = [];
        self._stopped = false;
        self._count   = 0;
        self.interval = params.interval || 0;

        return self;
    },

    push: function (f, sec) {
        this._queue.push({ f: f, s: sec || this.interval });
    },

    shift: function () {
        return this._queue.shift();
    },

    start: function () {
        this._stopped = false;
        return this._exec();
    },

    stop: function () {
        this._stopped = true;
    },

    _exec: function () {
        var self = this;
        var f_this = arguments.callee;

        if ( self._stopped ) { return }

        var o = self.shift();
        if ( typeof o !== 'undefined' ) {
            var params = {
                id: ++self._count
            };

            setTimeout(function () {
                o.f(params);
                f_this.call(self, []);
            }, o.s);
        }
    }
};