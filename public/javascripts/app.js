var query = new URLSearchParams(location.search.slice(1));
var token = localStorage.getItem("token");

if (query.get("token")) {
    token = query.get("token");
    if (token) {
        localStorage.setItem("token", token);
        location.href = location.pathname;
    }
}
if (token) {
    fetch("https://gta.growingio.com/mobile/products", {
        method: 'get',
        headers: {
            token: token,
        }
    }).then((res) => {
        if (res.ok) {
            res.json().then((json) => {
                window.json = json;
                new Vue({
                    el: "#container",
                    data: {
                        projects: json.map((p) => {
                                p.products = p.products.filter((pd) => pd.platform != 'js');
                                return p;
                            }).filter((p) => p && p.products && p.products.length > 0)
                            .sort((p1, p2) => p1.name.localeCompare(p2.name)),
                    },
                    ready: () => {

                    },
                    methods: {

                    },
                });

            })
        }
    }).catch((err) => {
        localStorage.removeItem("token");
        location.href = "https://accounts.growingio.com/oauth/authorize?client_id=MU6U1pi9U1FQPbNbaZZSZzG8WgErKxuB&redirect_uri=http://" + location.host + "/growingio/code_callback";
    });
} else {
    location.href = "https://accounts.growingio.com/oauth/authorize?client_id=MU6U1pi9U1FQPbNbaZZSZzG8WgErKxuB&redirect_uri=http://" + location.host + "/growingio/code_callback";
}
