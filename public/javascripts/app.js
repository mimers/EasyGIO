var query = new URLSearchParams(location.search.slice(1));
var token = localStorage.getItem("token");
if (!token && query.get("token")) {
    console.log('token is ' + query.get("token"));
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
            document.querySelector("#connect-button").style.display = 'none';
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
    })

}
