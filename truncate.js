'use strict';

module.exports = function() {
    Number.prototype.truncate = function(n) {
        return Math.floor(this * Math.pow(10, n)) / Math.pow(10, n);
    };
};
