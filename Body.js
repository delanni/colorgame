/**
 * Physical body type
 * @param {Object} opts Options object
 */
var Body = function (opts) {
    merge(this, Body.defaults, opts);
};
Body.defaults = {
    speed: new Vector(0, 0),
    position: new Vector(0,0),
    acceleration: new Vector(0, 0),
    friction: 0.9,
    //maxSpeed: 0.2
};
Body.prototype = {
    animate: function (dt) {
        this.speed.addInPlace(this.acceleration.scale(dt / 1000));
        //this.speed.clamp(this.maxSpeed);
        this.speed.scaleInPlace(1-this.friction);
        this.position.addInPlace(this.speed.scale(dt));
    },
    clone: function () {
        return new Body({
            speed: this.speed.clone(),
            position: this.position.clone(),
            acceleration: this.acceleration.clone()
        });
    }
};