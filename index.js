import express from "express";
import bodyParser from "body-parser";

const app=express();
const port=4000;

const blogs_list=new Map();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{

    res.render("index.ejs",{
        by:"by ",
        blogs_list:blogs_list,
    });
})

app.get("/create",(req,res)=>{
    res.render("create.ejs");
})

app.post("/create/submit",(req,res)=>{
    if(blogs_list.has(req.body["heading"])==true && blogs_list.get(req.body["heading"]).has(req.body["author"])==true){
        res.render("editing.ejs",{
            te_xt:"Already a blog is present with the given topic ,moving on to the edit section if you want to make some changes",
            heading:req.body["heading"],
            b_body:blogs_list.get(req.body["heading"]).get(req.body["author"]),
            author:req.body["author"],
        });
    }
    else{
        if(blogs_list.has(req.body["heading"])==false){
            const temp=new Map();
            temp.set(req.body["author"],req.body["b_body"]);
            blogs_list.set(req.body["heading"],temp);
            console.log(blogs_list.size);
            console.log(blogs_list.get(req.body["heading"]).get(req.body["author"]));
        }
        else{
            blogs_list.get(req.body["heading"]).set(req.body["author"],req.body["b_body"]);
        }
        res.render("next.ejs",{
            te_xt:"Posted your Blog successfully",
        });
    }
})

app.get("/edit",(req,res)=>{
    res.render("edit.ejs");
})

app.post("/edit/submit",(req,res)=>{
    if(blogs_list.has(req.body["heading"])==false || blogs_list.get(req.body["heading"]).has(req.body["author"])==false){
        res.render("create.ejs",{
            te_xt:"There is no such blog with the given topic and author please create a new blog.",
        })
    }
    else{
        res.render("editing.ejs",{
            heading:req.body["heading"],
            b_body:blogs_list.get(req.body["heading"]).get(req.body["author"]),
            author:req.body["author"],
        });
    }
})

app.post("/editing/submit",(req,res)=>{
    blogs_list.get(req.body["heading"]).delete(req.body["author"]);
    blogs_list.get(req.body["heading"]).set(req.body["author"],req.body["b_body"]);
    res.render("next.ejs",{
        te_xt:"Your blog has been edited successfully",
    })
})

app.get("/delete",(req,res)=>{
    res.render("delete.ejs");
})

app.post("/delete/submit",(req,res)=>{
    if(blogs_list.has(req.body["heading"])==false || blogs_list.get(req.body["heading"]).has(req.body["author"])==false){
        res.render("delete.ejs",{
            te_xt:"Blog not found . Please enter correct details",
        })
    }
    else{
        blogs_list.get(req.body["heading"]).delete(req.body["author"]);
        if(blogs_list.get(req.body["heading"]).size==0){
            blogs_list.delete(req.body["heading"]);
        }
        res.render("next.ejs",{
            te_xt:"Blog has been successfully deleted",
        })
    }
})

app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
})

app.listen(port,()=>{
    console.log("Running in port 4000");
})