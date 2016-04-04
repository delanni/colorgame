// Event Emitter

var EventEmitter = {
    on: function (eventName, callback) {
        if (!this._eventListeners) {
            this._eventListeners = {};
        }
        if (!this._eventListeners[eventName]){
            this._eventListeners[eventName] = [];
        }
        this._eventListeners[eventName].push(callback);
    },
    off: function (eventName, callback) {
        if (!this._eventListeners) return;
        
        var listeners = this._eventListeners[eventName];
        if (listeners && listeners.indexOf(callback) >= 0){
            listeners.splice(listeners.indexOf(callback),1);
        } else if (listeners && !callback){
            listeners = [];
        }
    },
    trigger: function (eventName) {
        var args = [].slice.call(arguments);
        var eventName = args.shift();
        if (this._eventListeners && this._eventListeners.hasOwnProperty(eventName)) {
            var listeners = this._eventListeners[eventName];
            listeners.forEach(function (listener) {
                listener.apply(this, args);
            }, this);
        }
    }
};