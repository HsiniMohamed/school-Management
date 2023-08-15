//import app
const app = require("./backend/app");

//start server on :http://localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'écoute sur le port ${PORT}`);
});
