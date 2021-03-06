var token = localStorage.getItem("token");
var isAndroid = navigator.userAgent.indexOf('Android') != -1;
var connectUrl = "https://accounts.growingio.com/oauth/authorize?client_id=MU6U1pi9U1FQPbNbaZZSZzG8WgErKxuB&redirect_uri=" + location.origin + location.pathname + "/growingio/code_callback";

function getJsonFromUrl() {
    var s = location.search.substr(1);
    var result = {};
    s.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}
var query = getJsonFromUrl();
if (query["token"]) {
    token = query["token"];
    if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", query["refreshToken"]);
        history.pushState(null, null, "/");
    }
}
if (token) {
    fetch("https://gta.growingio.com/mobile/products", {
        method: 'GET',
        headers: {
            token: token,
        }
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function(json) {
                window.json = json;
                new Vue({
                    el: "body",
                    data: {
                        projects: json.map(function(p) {
                            p.products = p.products.filter(function(pd) {
                                return pd.platform != 'js' && ((isAndroid && pd.platform == 'android') || (!isAndroid && pd.platform == 'ios'));
                            });
                            return p;
                        }).filter(function(p) {
                            return p && p.products && p.products.length > 0;
                        }).sort(function(p1, p2) {
                            return p1.name.localeCompare(p2.name);
                        }),
                    },
                    ready: function() {
                        document.querySelector("#container").style.display = "block";
                        document.querySelector("#splash").style.display = "none";
                    },
                    methods: {
                        startCircle: function(event) {
                            var elem = event.currentTarget;
                            var target = elem.href;
                            event.preventDefault();
                            fetch("/dynamic-token", {
                                method: 'get',
                                headers: {
                                    token: localStorage.getItem("token"),
                                    refreshToken: localStorage.getItem("refreshToken"),
                                }
                            }).then(function(res) {
                                if (res.ok) {
                                    res.json().then(function(newToken) {
                                        localStorage.setItem("token", newToken.accessToken);
                                        localStorage.setItem("refreshToken", newToken.refreshToken);
                                        location.href = target += "&loginToken=" + newToken.loginToken;
                                    })
                                }
                            })
                        },
                        logout: function() {
                            localStorage.removeItem("token");
                            location.href = connectUrl;
                        }
                    },
                });

            })
        } else {}
    }).catch(function(err) {
        alert('fetch failed' + err);
        localStorage.removeItem("token");
        window.onerror("fetch products failed. " + err);
        location.href = connectUrl;
    });
} else {
    location.href = connectUrl;
}
