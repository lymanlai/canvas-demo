(function() {
    window.addEventListener('load', load, false);

    function load() {
        Demo.init();
        Demo.makeCircleA();
    }

    var Demo = {
        data: {},
        get: get,
        set: set,
        init: init,
        makeCircleA: makeCircleA
    };

    function get(key) {
        return Demo.data[key] || null;
    }

    function set(key, val) {
        Demo.data[key] = val;

        return Demo;
    }

    function init() {
        var canvas = document.getElementById('canvas-frame');
        Demo.set('canvas', canvas);
        Demo.set('context', canvas.getContext('2d'));
        Demo.set('canvasWidth', canvas.width);

        return Demo;
    }

    function makeCircleA() {
        var canvasWidth = Demo.get('canvasWidth');
        var x = canvasWidth / 2;
        var y = canvasWidth / 2;
        var radius = canvasWidth / 4;
        var fillStyle = '#555';
        var strokeStyle = '#222';

        var canvas = Demo.get('canvas');
        var context = Demo.get('context');

        context.fillStyle = fillStyle;
        context.lineWidth = 1;
        context.strokeStyle = strokeStyle;
        context.stroke();

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
    }

})();