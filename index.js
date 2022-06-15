const express = require('express');
const service = require('./Service.js');
const path = require('path')
const hbs = require('hbs')

const app = express();
const port = process.env.PORT || 8080;

const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.static(publicDirectoryPath))

app.use(express.json());


// HTML Pages Rendering
app.get('', (req, res) => {
    res.render('index', {
        title: 'Home Page'
    })
})

app.get('/connectorspage', (req, res) => {
    res.render('connectors.hbs', {
        title: 'Connectors'
    })
})

app.get('/individualstatus', (req, res) => {
    res.render('individual.hbs', {
        title: 'Connector Status'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About'
    })
})

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        title: 'Help'
    })
})

//Backend Logic requests
app.get('/connectors', (req, res) => {
    service.connectorNameandNo().then((response)=>{
        res.json({
            "data": response
          })
    }).catch((e) => {
        res.status(500).json({"error": e});
    })
})

app.get('/connectorsstatusdetails', (req, res) => {
    service.allConnectorsStatusDetails().then((response)=>{
        res.json({
            "data": response
          })
    }).catch((e) => {
        res.status(500).json({"error": e});
    })
})

app.get('/allconnectorstatus', (req, res) => {
    service.status().then((response)=>{
        //console.log(response);
        res.json({
            "data": response
          })
    }).catch((e) => {
        res.status(500).json({"error": e});
    })
})


app.listen(port, () => {
 console.log('Server is up on port ' + port);
})
 
