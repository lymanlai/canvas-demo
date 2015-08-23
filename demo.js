(function() {
    window.addEventListener("load", Demo.load, false);
    var Demo = {
        data: {

        },
        get: get,
        set: set,
        load: load
    };

    function get(key) {
        return Demo.data[key] || null;
    }

    function set(key, val) {
        Demo.data[key] = val;

        return Demo;
    }

    function load() {

    }
})();