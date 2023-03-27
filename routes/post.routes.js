const express = require("express")
const postModel = require("../models/post.model")
const postRouter = express.Router()
const jwt = require("jsonwebtoken")
postRouter.get("/",async(req,res)=>{
    const token  = req.headers.authorization
    const {userId} = jwt.verify(token,"user")
    const queryObj = {
        userId:userId
    }
    const limit = 3
    const {min,max,device1,device2,device,page} = req.query
    try {
        if(device){
            queryObj.device =device
        }
        if(device1&&device2){
            queryObj.device = [device1,device2]
        }
        if(min){
            queryObj.no_of_comments = {$gte:min}
        }
        if(max){
            queryObj.no_of_comments = {$lte:max}
        }
        if(min&&max){
            queryObj.no_of_comments = { $gte: min, $lte: max }
        }
        const data = await postModel.find(queryObj).skip((Number(page)-1)*limit).limit(3)
        res.status(200).send({"msg":"here is the all the posts data",data})
    } catch (error) {
        res.status(400).send({"msg":"error while fetching the requested data",error})
    }
})
// getting the single details
postRouter.get("/:id",async(req,res)=>{
    const token  = req.headers.authorization
    const {id} = req.params
    const {userId} = jwt.verify(token,"user")
    const notesData = await postModel.findOne({_id:id})
    const userId_in_note = notesData.userId
    try {
        if(userId===userId_in_note){
            res.status(200).send({msg:"single posts",data:notesData})
        }
    } catch (error) {
        res.status(400).send({msg:"error while fetching the posts data",error})
    }
})
postRouter.get("/top/:page",async(req,res)=>{
    const token  = req.headers.authorization
    const {userId} = jwt.verify(token,"user")
    const {page} = req.params
    const limit = 3
    try {
        const data = await postModel.find({userId}).sort({no_of_comments:-1}).skip((Number(page)-1)*limit).limit(3)
        res.status(200).send({"msg":"here is the all the posts data",data})
    } catch (error) {
        res.status(400).send({"msg":"error while fetching the requested data",error})
    }
})

// for adding the posts
postRouter.post("/add",async(req,res)=>{
    try {
        const postData = new postModel(req.body)
        await postData.save()
        res.status(200).send({msg:"Post has been added"})
    } catch (error) {
        res.status(400).send({msg:"failed to post"})
    }
})


// for updating the posts
postRouter.patch("/update/:post_id",async(req,res)=>{
    const token  = req.headers.authorization
    // getting the id
    const {userId} = jwt.verify(token,"user")
    const {post_id} = req.params
    // finding the note
    const noteData = await notesModel.findOne({_id:post_id})
    const noteData_id = noteData.userId
    console.log(userId)
    console.log(noteData_id)
    try {
        if(noteData_id===userId){
            console.log("hi")
            await notesModel.findByIdAndUpdate(post_id,req.body)
            res.status(200).send({msg:"note updated successfully"})    
        }
    } catch (error) {
        res.status(400).send({msg:"note can't be updated",error})
    }
})


// for deleting the posts
postRouter.delete("/delete/:post_id",async(req,res)=>{
    const token  = req.headers.authorization
    // getting the id
    const {userId} = jwt.verify(token,"user")
    const {post_id} = req.params
    // finding the note
    const noteData = await notesModel.findOne({_id:post_id})
    const noteData_id = noteData.userId
    try {
        if(noteData_id===userId){
            await notesModel.findByIdAndDelete(post_id)
            res.status(200).send({msg:"note deleted successfully"})
        }
    } catch (error) {
        res.status(400).send({msg:"note can't be deleted",error})
    }
})

module.exports = postRouter