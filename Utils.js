    var merge = function (where, what) {
        where = where || {};
        what = what || {};

        Object.keys(what).forEach(function (k) {
            if (typeof what[k] !== 'undefined') {
                if (what[k].clone) {
                    where[k] = what[k].clone();
                } else if (what[k].slice) {
                    where[k] = what[k].slice();
                } else {
                    where[k] = what[k];
                }
            }
        });
        if (arguments.length > 2) {
            var args = [].slice.call(arguments, 0);
            var base = args.shift();
            var consumed = args.shift();
            return merge.apply(null, [base].concat(args));
        }
        return where;
    };