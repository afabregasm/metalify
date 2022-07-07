const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Metalify server listening on port http://localhost:${PORT} 🤘`);
});
