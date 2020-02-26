const express = require('express')
const mongoose = require('mongoose')
const Shorter = require('./models/shorter')
const app = express()

mongoose.connect('mongodb://127.0.0.1:17017/shorter',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get('/', async (req,res) =>{
    const shorter = await Shorter.find()
    res.render('index',{ shorters:shorter})
})

app.post('/shorter', async (req,res) =>{
    console.log('url',req.body.fullUrl)
    await Shorter.create({full:req.body.fullUrl})
    res.redirect('/')
})

app.get('/:short', async (req,res) =>{
   const shortURL = await Shorter.findOne({ short: req.params.short})
   if(shortURL == null) return res.sendStatus(404)
   shortURL.clicks++
   shortURL.save()
   res.redirect(shortURL.full)

})

app.listen(process.env.PORT || 3000)