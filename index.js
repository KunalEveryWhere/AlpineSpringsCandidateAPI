const express = require('express');
const cors = require('cors');
const axios = require('axios');

const port = process.env.PORT || 3000;

let app = express(); app.use(cors()); app.use(express.json());

let DataAPIDeatils =  {
    "URLEndPoint": "https://data.mongodb-api.com/app/data-obada/endpoint/data/v1",
    "keyName": "KeyForCandidate",
    "APIKey": "BZm37rvAkTfhTx9v4UlBMiKUid2ngmQi61PvkduD7yadNLx2ljuvBuyU4Ae7js1P",
    "dataSource": "AlpineSprings",
    "database": "AlpineSpringsCandidate",
    "collection": "BasicInformation",
    "contentType": "application/json"
};

let routes= {
    "/routes": 
        {
            "method": "GET",
            "desc": "Lists all the routes available"
        },
    "/information": 
        {
            "method": "GET",
            "desc": "Description of the basic information about this API"
        },
    "/basicform": 
        {
            "method": "POST",
            "desc": "Takes the input as per the listed data schema and posts it to a database repository",
            "Database Schema":{
                "firstName": "Joe",
                "middleLastName": "Doe",
                "sexualOrientation": "Male", //options Male, Female, Others
                "emailAddress": "joedoe@mail.com",
                "dateOfBirth": "01/03/1981", //formart dd/mm/yyyy
                "addressFirstLine": "21st East Street",
                "addressSecondLine": "Wellington Road, Eastern District",
                "addressCity": "London",
                "addressCountry": "Great Britain",
                "addressPostalCode": "10001",
                "APIKey": "[will be given to you, kindly insert here]",
            }
        }
    
};

app.listen(port, () => {
    console.log("Server running on port 3000");
   });


app.get("/routes", (req, res, next) => {
    res.json(routes);
   });

app.get("/information", (req, res, next) => {
    res.send("This is an API which is targetted to be used by potential candiates applying for the intership position at Alpine Springs Co. Ltd.");
   });

app.post("/postinfo", (req, res) => {
    res.send("data: "+req.body.name);
})

app.post("/basicform", async (req, resp) => {
    let formData, APIKey;

    try {
        if(!req.body.firstName || !req.body.middleLastName || !req.body.sexualOrientation || !req.body.emailAddress || !req.body.dateOfBirth
            || !req.body.addressFirstLine || !req.body.addressSecondLine || !req.body.addressCity || !req.body.addressCountry
            || !req.body.addressPostalCode || !req.body.APIKey)
            {
                resp.send("Error. Data Schema is incorrect and could not be registered properly.");
                return;
            }

        formData = {
                "firstName": req.body.firstName,
                "middleLastName": req.body.middleLastName,
                "sexualOrientation":req.body.sexualOrientation, //options Male, Female, Others
                "emailAddress": req.body.emailAddress,
                "dateOfBirth": req.body.dateOfBirth, //formart dd/mm/yyyy
                "addressFirstLine": req.body.addressFirstLine,
                "addressSecondLine": req.body.addressSecondLine,
                "addressCity": req.body.addressCity,
                "addressCountry": req.body.addressCountry,
                "addressPostalCode": req.body.addressPostalCode,
        };
        APIKey = req.body.APIKey;
        
    } catch (error) {
        resp.send("Error. Data Schema is incorrect and could not be registered properly.");
        return;
    }

    if(APIKey !== DataAPIDeatils.APIKey) {
        resp.send("Incorrect APIKey")
        return;
    }

    let dataToSent = {
            "dataSource": DataAPIDeatils.dataSource,
            "database": DataAPIDeatils.database,
            "collection": DataAPIDeatils.collection,
            "document": formData,
         } 

    try {
        let fromAxios = await axios.post(DataAPIDeatils.URLEndPoint+"/action/insertOne", dataToSent, 
    { headers: {
        "Content-Type": DataAPIDeatils.contentType,
        "Access-Control-Request-Headers": "*",
        "api-key": APIKey,
            }
    });
    resp.send("Succuessdful Insertion. Kindly share this with the AlpineSprings Team \n"+JSON.stringify(fromAxios.data));   
    } catch (error) {
        resp.send("Error occured while Insertion Operation. Kindly contact the Alpine Springs Team");
    }

});
