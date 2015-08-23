(function() {
    window.addEventListener('load', load, false);

    function load() {
        Demo.init();
        Demo.drawScreen();

        Demo.get('canvas').addEventListener("mousedown", Demo.mouseDown, false);
    }

    var Demo = {
        data: {},
        get: get,
        set: set,
        init: init,
        drawScreen: drawScreen,
        drawBackground: drawBackground,
        drawCircle: drawCircle,
        drawSquare: drawSquare,
        mouseDown: mouseDown,
        mouseMove: mouseMove,
        mouseUp: mouseUp
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

        var canvasWidth = canvas.width;
        Demo.set('circle', {
            x: canvasWidth / 2,
            y: canvasWidth / 2,
            radius: canvasWidth / 4,
            fillStyle: '#555',
            strokeStyle: '#222'
        });

        return Demo;
    }

    function drawScreen() {
        Demo.drawBackground();
        Demo.drawSquare();
        Demo.drawCircle();
    }

    function drawBackground() {
        var canvas = Demo.get('canvas');
        var context = Demo.get('context');
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawCircle() {
        var canvas = Demo.get('canvas');
        var context = Demo.get('context');
        var circle = Demo.get('circle');

        context.fillStyle = circle.fillStyle;
        context.lineWidth = 1;
        context.strokeStyle = circle.strokeStyle;
        context.stroke();

        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
    }

    function drawSquare() {
        var canvas = Demo.get('canvas');
        var context = Demo.get('context');

        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var width = 500;
        var height = 500;
        var x = (canvasWidth - width) / 2;
        var y = (canvasHeight - height) / 2;

        context.fillStyle = '#aaa';
        context.fillRect(x, y, width, height);
    }

    function mouseDown(event) {
        var canvas = Demo.get('canvas');
        var circle = Demo.get('circle');
        //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
        var bRect = canvas.getBoundingClientRect();
        mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
        mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);

        if (isHit(circle, mouseX, mouseY)) {
            Demo.set('dragging', true);
            dragHoldX = mouseX - circle.x;
            dragHoldY = mouseY - circle.y;
        }

        if (Demo.get('dragging')) {
            window.addEventListener("mousemove", Demo.mouseMove, false);
        }
        canvas.removeEventListener("mousedown", Demo.mouseDown, false);
        window.addEventListener("mouseup", Demo.mouseUp, false);

        //code below prevents the mouse down from having an effect on the main browser window:
        if (event.preventDefault) {
            event.preventDefault();
        } //standard
        else if (event.returnValue) {
            event.returnValue = false;
        } //older IE

        return false;

        function isHit(circle, mx, my) {
            var dx;
            var dy;
            dx = mx - circle.x;
            dy = my - circle.y;

            //a "hit" will be registered if the distance away from the center is less than the radius of the circular object
            return (dx * dx + dy * dy < circle.radius * circle.radius);
        }
    }

    function mouseUp(event) {
        Demo.get('canvas')
            .addEventListener("mousedown", Demo.mouseDown, false);

        window.removeEventListener("mouseup", Demo.mouseUp, false);
        if (Demo.get('dragging')) {
            Demo.set('dragging', false);
            window.removeEventListener("mousemove", Demo.mouseMove, false);
        }
    }

    function mouseMove(event) {
        var posX;
        var posY;
        var canvas = Demo.get('canvas');
        var circle = Demo.get('circle');
        var radius = circle.radius;
        var minX = radius;
        var maxX = canvas.width - radius;
        var minY = radius;
        var maxY = canvas.height - radius;
        //getting mouse position correctly
        var bRect = canvas.getBoundingClientRect();
        mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
        mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);

        //clamp x and y positions to prevent object from dragging outside of canvas
        posX = mouseX - dragHoldX;
        posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
        posY = mouseY - dragHoldY;
        posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

        circle.x = posX;
        circle.y = posY;

        Demo.set('circle', circle);
        Demo.drawScreen();
    }

})();