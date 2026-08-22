require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/DB_Connection/db")
const port = process.env.PORT || 8000

connectDB();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
