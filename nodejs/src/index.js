

const { app, render, csrf_valid, login, logout, register, is_authenticated, start_server, upload_json } = require('./server_n_db');

const {stressTest} = require('./stress-test');

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
  if (csrf_valid(req, res, true)) {
    login(req, res);
  }
});
app.get("/register", async (req, res) => {
  console.log("register");
  if (csrf_valid(req, res, true)) {
    render(req, res, "pages/register");
  };
});
app.get("/register-form", (req, res) => {
  console.log("register form");
  console.log(req.query)
  if (csrf_valid(req, res, true)) {
      register(req, res);
  }
});
app.get("/try-out", (req, res) => {
  console.log(req.query)
  if (csrf_valid(req, res, true)) {
    console.log("try");
    req.query.username = "try_account"
    req.query.password = "try_account"
    login(req, res);
  }
});

app.get("/logout", (req, res) => {
  console.log("logout");
  if (csrf_valid(req, res, true)) {
    if (is_authenticated(req, res, true)) {
      logout(req, res);
    }
  }
});

app.get("/main", async (req, res) => {
  console.log("main");
  if (is_authenticated(req, res, true)) {
    render(req, res, "pages/main");
  };
});

app.get("/game_1", async (req, res) => {
  console.log("game_1");
  if (is_authenticated(req, res, true)) {
    render(req, res, "pages/game_1");
  };
});

app.get("/flag-quiz", async (req, res) => {
  console.log("flag-quiz");
  if (is_authenticated(req, res, true)) {
    render(req, res, "pages/flag-quiz");
  };
});

app.get("/fill-the-gap", async (req, res) => {
  console.log("flag-quiz");
  if (is_authenticated(req, res, true)) {
    render(req, res, "pages/flag-fill-the-gap");
  };
});

app.get("/server-stats", async (req, res) => {
  console.log("server-stats");
  render(req, res, "pages/server-stats");
});

app.get("/flag-memory", async (req, res) => {
  console.log("flag-memory");
  if (is_authenticated(req, res, true)) {
    render(req, res, "pages/flag-memory");
  };
});

app.get("/games", async (req, res) => {
  console.log("game-selector");
  if (is_authenticated(req, res, true)) {
    render(req, res, "pages/game-selector");
  };
});

app.get("/start-stress-test", async (req, res) => {
  console.log("start-stress-test");
  //if (is_authenticated(req, res, true)) {
    stressTest(req.query.instances, req.query.login_time, req.query.duration);
    res.status(200).send('Data received');
  //};
});

app.post("/upload_data", async (req, res) => {
  console.log("upload_data");
  const jsonData = req.body.json_data;
  console.log(jsonData);
  req.session.user.data = jsonData;
  upload_json(req, jsonData);
  res.status(200).send('Data received');
});
