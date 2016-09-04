var query = new URLSearchParams(location.search.slice(1));
var token = localStorage.getItem("token");
if (!token && query.get("token")) {
    console.log('token is ' + query.get("token"));
    token = query.get("token");
    if (token) {
        localStorage.setItem("token", token);
        location.search = '';
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
                document.write(JSON.stringify(json));
            })
        }
    })

}
