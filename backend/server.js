const dotenv = require("dotenv");
dotenv.config();
const {app} = require("./app")

async function start()
{
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server started at port: ${process.env.PORT}`);
    } )
}
start().catch(error => {console.error(error); process.exit(1)})