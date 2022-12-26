const express = require("express")
const app = require("./app")
const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`Server is up and running at http://localhost:${PORT}`)
})