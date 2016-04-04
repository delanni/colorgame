var Vector = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype = {
    add: function (other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    ,
    subtract: function (other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    ,
    addInPlace: function (other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    ,
    scale: function (scaler) {
        return new Vector(this.x * scaler, this.y * scaler);
    }

    ,
    scaleInPlace: function (scaler) {
        this.x *= scaler;
        this.y *= scaler;
        return this;
    }

    ,
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    ,
    normalize: function (v) {
        var v = v || 1;
        this.scaleInPlace(1 / this.length() * v);
        return this;
    }

    ,
    clamp: function (limit) {
        if (this.length() > limit) {
            this.normalize(limit);
        }
        //            if (min > max) throw new Error("Inverse ranges");
        //            if (this.x > max) {
        //                this.x = max;
        //            } else if (this.x < min) {
        //                this.x = min;
        //            }
        //            if (this.y > max) {
        //                this.y = max;
        //            } else if (this.y < min) {
        //                this.y = min;
        //            }
        return this;
    }

    ,
    scalar: function (other) {
        return other.x * this.x + other.y * this.y;
    }

    ,
    clone: function () {
        return this.scale(1);
    },

    distanceTo: function (other) {
        return other.subtract(this).length();
    }
};
Vector.random = function (scaleX, scaleY) {
    if (arguments.length == 0) {
        scaleX = scaleY = 1;
    } else if (arguments.length == 1) {
        scaleY = scaleX;
    }

    return new Vector((Math.random() - 0.5) * scaleX, (Math.random() - 0.5) * scaleY);
};