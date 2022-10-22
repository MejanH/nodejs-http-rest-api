import http from "node:http";
import { readFile } from "node:fs/promises";
import { Buffer } from "node:buffer";

const todos = [
  {
    id: 1,
    title: "Check Emails",
  },
  {
    id: 2,
    title: "Buy Rice",
  },
];

const sendTodosReposne = (res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(todos));
};

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/todos":
      if (req.method === "GET") {
        sendTodosReposne(res);
      } else {
        let reqBody = [];
        req
          .on("data", (chunk) => {
            reqBody.push(chunk);
          })
          .on("end", () => {
            reqBody = JSON.parse(Buffer.concat(reqBody).toString());
            if (req.method === "POST") {
              todos.push({
                id: todos[todos.length - 1].id + 1,
                title: reqBody.title,
              });
              sendTodosReposne(res);
            } else if (req.method === "DELETE") {
              const indexOfTodo = todos.findIndex(
                (todo) => todo.id === reqBody.id
              );
              todos.splice(indexOfTodo, 1);
              sendTodosReposne(res);
            }
          });
      }
      break;
    case "/":
      const filePath = new URL("./index.html", import.meta.url);
      readFile(filePath, { encoding: "utf8" }).then((htmlContent) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlContent);
      });
  }
});

server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
