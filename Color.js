var Color = function (r, g, b) {
    merge(this, Color.defaults, {
        r: r,
        g: g,
        b: b
    });
};
Color.defaults = {
    r: 0,
    g: 0,
    b: 0
};
Color.prototype = {
    clone: function () {
        return new Color(this.r, this.g, this.b);
    },
    asArray: function () {
        return [this.r, this.g, this.b];
    },
    setFrom: function () {
        if (arguments.length == 3) {
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
        } else if (arguments.length == 1 && arguments[0].hasOwnProperty('h')) {
            this.setFrom.apply(this, this._hslToRGB(arguments[0]));
        }
        return this;
    },
    toHexString: function () {
        return this.rgbToHex.apply(this, this.asArray());
    },
    _componentToHex: function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function (r, g, b) {
        return "#" + this.asArray().map(this._componentToHex).join("");
    },

    toHSL: function () {
        return this._rgbToHSL.apply(null, this.asArray());
    },

    shiftHue: function (degree) {
        var hsl = this.toHSL();
        hsl.h += degree;
        if (hsl.h > 360) {
            hsl.h -= 360;
        } else if (hsl.h < 0) {
            hsl.h += 360;
        }
        var newColor =  this.setFrom(hsl);
        console.log(newColor.toHexString());
        return newColor;
    },

    _rgbToHSL: function (r, g, b) {

        var r = r / 255,
            g = g / 255,
            b = b / 255,
            cMax = Math.max(r, g, b),
            cMin = Math.min(r, g, b),
            delta = cMax - cMin,
            l = (cMax + cMin) / 2,
            h = 0,
            s = 0;

        if (delta == 0) {
            h = 0;
        } else if (cMax == r) {
            h = 60 * (((g - b) / delta) % 6);
        } else if (cMax == g) {
            h = 60 * (((b - r) / delta) + 2);
        } else {
            h = 60 * (((r - g) / delta) + 4);
        }

        if (delta == 0) {
            s = 0;
        } else {
            s = (delta / (1 - Math.abs(2 * l - 1)))
        }

        return {
            h: h,
            s: s,
            l: l
        };
    },

    _hslToRGB: function (hsl) {
        var h = hsl.h,
            s = hsl.s,
            l = hsl.l,
            c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r, g, b;

        if (h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (h < 300) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }

        r = this._normalizeRGBValue(r, m);
        g = this._normalizeRGBValue(g, m);
        b = this._normalizeRGBValue(b, m);

        return [r, g, b];
    },

    _normalizeRGBValue: function (color, m) {
        color = Math.floor((color + m) * 255);
        if (color < 0) {
            color = 0;
        }
        return color;
    }
};