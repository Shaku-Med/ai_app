const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require("fs")
const store = require('store')
const { Configuration, OpenAIApi } = require("openai")
const CryptoJS = require('crypto-js')
// Configuring ai...

const configuration = new Configuration({ 
    organization: 'org-oAaVEXxINRHM1oyRCU8urJkU',
    apiKey: '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'
})

const openai = new OpenAIApi(configuration)



// Configurations...
app.use(express())

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST"]
}))

app.use(bodyParser.json() || bodyParser.urlencoded({ extended: false }))

// app.use(helmet({
//   frameguard: { action: 'SAMEORIGIN' },
// }))

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"]
  }
})



app.post("/auth", (req, res) => { 
    let token = CryptoJS.AES.decrypt(req.body.toks, "strongkey0187746?#?#*@$").toString(CryptoJS.enc.Utf8)
    store.set("token", token)
    res.status(200).send({ 
        success: req.body.toks
    })
})
app.post("/auth2", (req, res) => { 
    let token = CryptoJS.AES.decrypt(req.body.toks, "strongkey0187746?#?#*@$").toString(CryptoJS.enc.Utf8)
    store.set("auth2", token)
    res.status(200).send({ 
        success: "Good"
    })
})


app.post("/text", async (req, res) => { 
    if(store.get("token") === store.get("auth2")){ 
        let messageid = CryptoJS.AES.decrypt(req.body.messageid, "strongkey0187746?#?#*@$").toString(CryptoJS.enc.Utf8)
        let text = CryptoJS.AES.decrypt(req.body.text, "strongkey0187746?#?#*@$").toString(CryptoJS.enc.Utf8)
        
        try{ 
            const resp = await openai.createCompletion({ 
                model: "text-davinci-003",
                prompt: `${text}`,
                temperature: 0,
                max_tokens: 3000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            })

            res.status(200).send({ 
                bot: resp.data.choices[0].text,
                messageid: messageid
            })

            store.remove("token")
        }
        catch(er){ 
            res.status(404).send({ 
                success: "Your Message goes above our rule."
            })

            store.remove("token")
        }
    }
    else{ 
        res.status(404).send({ 
            success: "Your token is invalid..."
        })

        store.remove("token")
    }
})

app.post("/gen", async (req, res) => { 

    if(store.get("token") === store.get("auth2")){ 
        let messageid = CryptoJS.AES.decrypt(req.body.messageid, "strongkey0187746?#?#*@$").toString(CryptoJS.enc.Utf8)
        let text = CryptoJS.AES.decrypt(req.body.text, "strongkey0187746?#?#*@$").toString(CryptoJS.enc.Utf8)
        
        try{ 
            const resp = await openai.createImage({ 
               prompt: `${text}`,
               n: 1,
               size: '1024x1024'
            })

            res.status(200).send({ 
                bot: resp.data.data[0].url,
                messageid: messageid
            })

            store.remove("token")
        }
        catch(er){ 
            console.log("error")
            res.status(404).send({ 
                success: "Your Message goes above our rule."
            })

            store.remove("token")
        }
    }
    else{ 
        console.log("error")
        res.status(404).send({ 
            success: "Your token is invalid..."
        })

        store.remove("token")
    }

})


app.post("/file", async (req, res) => { 
    let path = "./Files/"

    console.log(req.body.desc)
})


app.get("/", (req, res) => { 
    res.send({ 
        message: "Welcome. This application works."
    })
})

server.listen(3001, () => { 
    console.log("App is listening...")
})