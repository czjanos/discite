

const { app, render, csrf_valid, login, register, is_authenticated, start_server } = require('./server_n_db');

start_server();


app.get("/", async (req, res) => {
  console.log("index");
  render(req, res, "pages/index");
});
app.get("/index", async (req, res) => {
  console.log("index");
  render(req, res, "pages/index");
});

app.get("/login-form", (req, res) => {
  console.log(req.query)
  if (csrf_valid(req, res)) {
    if (req.query.action == "login") {
      console.log("login");
      login(req, res);
    } else if (req.query.action == "register") {
      console.log("register");
      register(req, res);
    } else if (req.query.action == "try") {
      console.log("try");
      req.query.username = "try_account"
      req.query.password = "try_account"
      login(req, res);
    } else{
      render(req, res, "pages/index");
    }
  }
});

app.get("/logout", (req, res) => {
  console.log("logout");
  if (csrf_valid(req, res)) {
    req.session.destroy();
    res.redirect("/");
  }
});

app.get("/main", async (req, res) => {
  console.log("main");
  if (is_authenticated(req, res)) {
    render(req, res, "pages/main");
  };
});

app.get("/game_1", async (req, res) => {
  console.log("game_1");
  if (is_authenticated(req, res)) {
    render(req, res, "pages/game_1");
  };
});
