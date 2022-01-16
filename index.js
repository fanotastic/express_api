const e = require('express');
const express = require('express'); // import module express js
const app = express(); // untuk mengaktifkan/menjalankan fungsi module express
const fs = require('fs') // singkatan dari file system maka msh data buffer

// req method patch put delete, id melalui req.param bukan req.query 

const PORT = 2500;

// import data json
let data = JSON.parse(fs.readFileSync('./db.json'))

// konfigurasi untuk dapat menerima data req.body dari user/client/front-end
app.use(express.json());

// untuk menerima req dari client
app.get("/", (req, res) => {
    res.status(200).send('<h1>Welcome to Express API</h1>')
    console.log("Enjoy the API :)")
})

// next utk sambungkan middleware dgn api beda
// :id utk request param
app.get("/users/:id", (req, res) => {
    console.log("dapet data", data.users)
    console.log("data dari req.query: ", req.query.id)
    console.log("data dari req.body: ", req.body)
    console.log("data dari req.body: ", req.params)
    res.status(200).send({
        id: 1,
        username: "Nakajima"
    })
})

// 1. untuk get products
app.get("/products", (req, res) => {

    const filterData = data.products.filter((value) => {
        let valid = true;
        console.log(req.query)
        for (let props in req.query) {
            valid = valid && value[props] == req.query[props]
            console.log(valid, value[props], req.query[props])
        }
        console.log("ini hasil valid", valid)
        return valid

    });

    res.status(200).send(filterData)

    // for (let props in req.query)
    // if (req.query.id) {
    //     let filterData = data.products.filter((val) => req.query.id == val.id)
    //     res.status(200).send(
    //         filterData
    //     )
    // } else {
    //     res.status(200).send(
    //         data.products
    //     )
    // }

})

app.get("/users", (req, res) => {

    const filterData = data.users.filter((value) => {
        let valid = true;
        console.log(req.query)
        for (let props in req.query) {
            valid = valid && value[props] == req.query[props]
            console.log(valid, value[props], req.query[props])
        }
        console.log("ini hasil valid", valid)
        return valid

    });

    res.status(200).send(filterData)
})

app.delete("/products/:id", (req, res) => {
    let idx = data.users.findIndex(val => parseInt(req.params.id) == val.id)
    if (idx) {
        data.products.splice(idx - 1, 1)
        fs.writeFileSync('./db.json', JSON.stringify(data))
        res.status(201).send(data.products)
        
    } else{
        res.end('data not found')
    }
})

app.delete("/users/:id", (req, res) => {
    let idx = data.users.findIndex(val => parseInt(req.params.id) == val.id)
    console.log("ini idx delet", idx)
    if (idx) {
        data.users.splice(idx, 1)
        fs.writeFileSync('./db.json', JSON.stringify(data))
        res.status(201).send(data.users)
    } else{
        res.end('data not found')
    }
})

app.post("/products", (req, res) => {
    req.body.id = data.products[data.products.length - 1].id + 1
    data.products.push(req.body)
    fs.writeFileSync('./db.json', JSON.stringify(data))
    res.status(201).send(data.products)
})

app.patch("/products/:id", (req, res) => {
    let idx = data.products.findIndex(val => parseInt(req.params.id) == val.id)
    data.products[idx] = {
        ...data.products[idx],
        ...req.body
    }
    fs.writeFileSync('./db.json', JSON.stringify(data))
    res.status(201).send(data.products)
})

app.patch("/users/:id", (req, res) => {
    let idx = data.users.findIndex(val => parseInt(req.params.id) == val.id)
    console.log("hasil", req.params.id, req.body)
    data.users[idx] = {
        ...data.users[idx],
        ...req.body
    }
    fs.writeFileSync('./db.json', JSON.stringify(data))
    res.status(201).send(data.users)
})

app.put("/products/:id", (req, res) => {
    let idx = data.products.findIndex(val => parseInt(req.params.id) == val.id)
    data.products[idx] = {
        id: data.products[idx].id,
        ...req.body
    }
    fs.writeFileSync('./db.json', JSON.stringify(data))
    res.status(201).send(data.products)
})

app.put("/users/:id", (req, res) => {
    let idx = data.users.findIndex(val => parseInt(req.params.id) == val.id)
    data.users[idx] = {
        id: data.users[idx].id,
        ...req.body
    }
    fs.writeFileSync('./db.json', JSON.stringify(data))
    res.status(201).send(data.users)
})


const HomeScreen = () => {

    console.log("Home :")
    console.log(`http://localhost:${PORT}\n`)

    console.log("Resources: ")
    for (let props in data) {
        console.log(`http://localhost:${PORT}/${props}`)
    }

    console.log("Enjoy the API :)")
}

// mengaktifkan koneksi express api agar bisa menerima request
app.listen(PORT, HomeScreen)
