async function addTheCat(){
    try{
        var kitty = new Cat({ name: 'Zildjian' });
        await kitty.save();
        console.log("meow!");
    }
    catch(err){
        console.log(err);
    }
}

async function addCat(catName){

    let cat = await Cat.findOne({ name : catName });
    if (!cat){
        var kitty = new Cat({ name: catName });
        await kitty.save();
        return kitty;
    }
    return null;
}

async function findCat(catName){
    var kitty = await Cat.findOne({ name: catName });
    return kitty;
}

async function findAll(){
    var kitty = await Cat.find({});
    return kitty;
}

(async function(){
    await addCat("Garfield");
    let cat = await findCat("Garfield");
    console.log(cat);
    let cats = await findAll();
    console.log(cats);
    mongoose.connection.close();
})()
