

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


app.get("/login", (req, res) => {
  console.log("login");
  console.log(req.query)
  if (csrf_valid(req, res)) {
    login(req, res);
  }
});
app.get("/register", async (req, res) => {
  console.log("register");
  if (csrf_valid(req, res)) {
    render(req, res, "pages/register");
  };
});
app.get("/register-form", (req, res) => {
  console.log("register form");
  console.log(req.query)
  if (csrf_valid(req, res)) {
      register(req, res);
  }
});
app.get("/try-out", (req, res) => {
  console.log(req.query)
  if (csrf_valid(req, res)) {
    console.log("try");
    req.query.username = "try_account"
    req.query.password = "try_account"
    login(req, res);
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

app.get("/flag-quiz", async (req, res) => {
  console.log("flag-quiz");
  if (is_authenticated(req, res)) {
    render(req, res, "pages/flag-quiz");
  };
});

app.get("/flag-memory", async (req, res) => {
  console.log("flag-memory");
  if (is_authenticated(req, res)) {
    render(req, res, "pages/flag-memory");
  };
});

app.get("/games", async (req, res) => {
  console.log("game-selector");
  if (is_authenticated(req, res)) {
    render(req, res, "pages/game-selector");
  };
});


