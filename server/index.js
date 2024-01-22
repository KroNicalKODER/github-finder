import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

app.get('/repos', async(req,res)=>{
    const {uname, limit, page} = req.query

    const repos = await fetch(`https://api.github.com/users/${uname}/repos`)
    const reposData = await repos.json()
    if(reposData.message==='Not Found'){
        return res.status(401).send('User not found')
    }

    const startIndex = (page-1)*limit;
    const endIndex = page * limit

    res.send({status: 200,message:'Success',data: reposData.slice(startIndex,endIndex)})
})



app.listen(8800, ()=>console.log('listening to port',8800))