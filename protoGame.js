var initialize = function () {
    var cr = document.body.getClientRects()[0];
    var w = cr.width;
    var h = cr.height;

    var c = document.getElementById('canvas');
    c.width = w;
    c.height = h;

    var ctx = c.getContext("2d");
    ctx.clear = function () {
        this.fillStyle = "#222222";
        this.fillRect(0, 0, w, h);
    };
    ctx.clear();

    var world = new World({
        canvas: c
    });
    var player = new Player({
        world: world
    });
    world.entities.push(player);

    var time;
    var render = function () {

        var now = new Date().getTime(),
            dt = now - (time || now);
        time = now;

        doRender(dt);
    };

    var doRender = function (delta) {
        window.requestAnimationFrame(render);
        if (delta>100) delta = 100;
        world.animate(delta);
        world.render();
    };

    c.addEventListener("mousedown", function (ev) {
        world.cursorState = 1;
        world.cursorPosition.x = (ev.x || ev.clientX) - c.offsetLeft;
        world.cursorPosition.y = (ev.y || ev.clientY) - c.offsetTop;
        world.trigger("cursorUpdate", { position: world.cursorPosition, state: world.cursorState, type: "down" });
        ev.preventDefault();
        return false;
    });
    
    c.addEventListener("touchstart", function (ev) {
        world.cursorState = 1;
        world.cursorPosition.x = ev.touches[0].clientX - c.offsetLeft;
        world.cursorPosition.y = ev.touches[0].clientY - c.offsetTop;
        world.trigger("cursorUpdate", { position: world.cursorPosition, state: world.cursorState, type: "down" });
        ev.preventDefault();
        return false;
    });
    c.addEventListener("mouseup", function (ev) {
        world.cursorState = 0;
        world.cursorPosition.x = (ev.x || ev.clientX) - c.offsetLeft;
        world.cursorPosition.y = (ev.y || ev.clientY) - c.offsetTop;
        world.trigger("cursorUpdate", { position: world.cursorPosition, state: world.cursorState, type: "up" });
        ev.preventDefault();
        return false;
    });
    c.addEventListener("touchend", function (ev) {
        world.cursorState = 0;
        world.cursorPosition.x = ev.touches[0].clientX - c.offsetLeft;
        world.cursorPosition.y = ev.touches[0].clientY - c.offsetTop;
        world.trigger("cursorUpdate", { position: world.cursorPosition, state: world.cursorState, type: "up" });
        ev.preventDefault();
        return false;
    });
    c.addEventListener("mousemove", function (ev) {
        world.cursorPosition.x = (ev.x || ev.clientX) - c.offsetLeft;
        world.cursorPosition.y = (ev.y || ev.clientY) - c.offsetTop;
        world.trigger("cursorUpdate", { position: world.cursorPosition, state: world.cursorState, type: "move" });
        ev.preventDefault();
        return false;
    });
    c.addEventListener("touchmove", function (ev) {
        world.cursorPosition.x = ev.touches[0].clientX - c.offsetLeft;
        world.cursorPosition.y = ev.touches[0].clientY - c.offsetTop;
        world.trigger("cursorUpdate", { position: world.cursorPosition, state: world.cursorState, type: "move" });
        ev.preventDefault();
        return false;
    });

    render();
}

var World = function (options) {
    merge(this, World.defaults, options);
    if (!this.canvas) {
        throw new Error("Canvas is was not given");
    }
    this.ctx = this.canvas.getContext("2d");
    this.w = this.canvas.width;
    this.h = this.canvas.height;
};

World.defaults = {
    entities: [],
    cursorPosition: new Vector(0, 0),
    cursorState: 0
};

World.prototype = {
    think: function (dt) {
        var w = this.w;
        var h = this.h;
        var player = this.entities[0];
        if (!player) return;
        var klone = player.body.clone();
        klone.animate();
        var nextPos = klone.position;
        var nextPixels = [];
        var pixels = this.ctx.getImageData(0,0,w,h).data;
        for(var x = 0; x < w; x++) {
            for(var y=0; y< h; y++) {
                var v = new Vector(x,y);
                if (v.distanceTo(nextPos) <= player.size){
                    nextPixels.push(pixels.slice((y*w+x)*4,(y*w+x)*4+4));
                }
            }
        }
    },
    animate: function (dt) {
        this.think(dt);
        this.entities.forEach(function (e) {
            if (e.think) e.think();
            e.animate(dt);
        }, this);
    },
    render: function () {
        this.entities.forEach(function (e) {
            e.render(this.ctx);
        },this);
    }
};

merge(World.prototype, EventEmitter);


window.addEventListener("load", initialize, false);

setInterval(function(){
    navigator.vibrate && navigator.vibrate(1000);
},2000);
