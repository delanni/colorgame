var Player = function (options) {
    merge(this, Player.defaults, options);
    if (!this.world) throw new Error("World parameter is mandatory");

    var player = this;
    this.world.on("cursorUpdate", function (args) {
        if (args.type == "down") {
            player.state = Player.WAITING;
            player.target = args.position;
        }
        if (args.type == "move") {
            if (player.state === Player.DRAWING || player.state === Player.WAITING) {
                player.target = args.position;
            } else {}
        }
        if (args.type == "up") {
            player.state = Player.NONE;
        }
    });
};

Player.defaults = {
    body: new Body(),
    target: new Vector(0, 0),
    lastKnownPosition: new Vector(0,0),
    size: 6,
    color: new Color(70, 137, 250),
    state: Player.NONE,
    hueFactor: 0.5,
    moveStack: []
};

Player.prototype = {
    chopDistanceUp: function (from, to) {
        var distance = from.distanceTo(to);
        if (true) {
            var directionVector = to.subtract(from).normalize(this.size/2);
            var i = 0;
            while (distance > 0) {
                this.moveStack.push(from.add(directionVector.scale(i++)));
                distance -= directionVector.length();
            }
        }
    },
    think: function () {

    },
    animate: function (dt) {
        if (this.state === Player.DRAWING || this.state === Player.WAITING) {
            var idealTarget = this.target.subtract(this.body.position);
            idealTarget.normalize(Math.pow(idealTarget.length(), 1));
            this.body.acceleration = idealTarget;//this.body.acceleration.scale(0.9).add(idealTarget.scaleInPlace(0.1));
            var positionBefore = this.body.position.clone();
            this.body.animate(dt);

            this.chopDistanceUp(positionBefore, this.body.position);
        }
    },
    render: function (ctx) {
        if (this.state === Player.DRAWING || this.state == Player.WAITING) {
            while (this.moveStack.length) {
                var move = this.moveStack.shift();
                ctx.save();
                ctx.fillStyle = this.color.toHexString();
                ctx.translate(move.x, move.y);
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                this.color.shiftHue(this.lastKnownPosition.distanceTo(move)/2);
                this.lastKnownPosition = move;
            }
            // ctx.save();
            // ctx.fillStyle = this.color.toHexString();
            // ctx.translate(this.body.position.x, this.body.position.y);
            // ctx.beginPath();
            // ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            // ctx.fill();
            // ctx.restore();
            // this.color.shiftHue(this.lastKnownPosition.distanceTo(this.body.position)/2);
            // this.lastKnownPosition = this.body.position.clone();
        }
    }
};

merge(Player.prototype, EventEmitter);

Player.NONE = 0;
Player.WAITING = 1;
Player.DRAWING = 2;