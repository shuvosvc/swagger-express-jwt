const express = require("express");
const swaggerUI = require("swagger-ui-express");
const fileUpload = require("express-fileupload");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./swagger/api.yaml");
const jwt = require("jsonwebtoken");
const app = express();

const fs = require("fs");

app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
app.use(fileUpload());

var users = [
  { id: 1, name: "Tom, Cruise" },
  { id: 2, name: "John Cena" },
];

app.get("/string", (req, res) => {
  console.log(req.headers);
  res.status(200).send("Users Route");
});

app.get("/user", (req, res) => {
  res.status(200).send({ id: 1, name: "Tom, Cruise" });
});

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.get("/users/:id", (req, res) => {
  res.status(200).send(users.find((x) => x.id === parseInt(req.params.id)));
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.name === "me" && req.body.pass === "123") {
      //..................generate token
      const token = jwt.sign(
        {
          userName: req.body.name,
        },
        "kkkkkkkkk"
        // { expiresIn: "24h" }
      );
      res.status(200).json({
        access_token: token,
        message: "Login successful!",
      });
    } else {
      res.status(401).json({
        error: "Authentication failed1",
      });
    }
  } catch {
    res.status(401).json({
      error: "Authentication failed2",
    });
  }
});

app.post("/create", (req, res) => {
  users = [req.body, ...users];
  res.send(users);
});

app.get("/usersQuery", (req, res) => {
  res.send(users.find((x) => x.id === parseInt(req.query.id)));
});

const dir = "upload";

fs.exists(dir, function (exists) {
  if (!exists) {
    fs.mkdirSync(dir);
  }
});

app.post("/upload", (req, res) => {
  const file = req.files.file;
  let uploadPath = __dirname + "/upload/" + "file" + Date.now() + ".jpg";
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.send(Err);
    }
  });
  res.send(200);
});

app.listen(1200, () =>
  console.log(`Example app listening at http://localhost:1200`)
);
