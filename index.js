'use strict';

const http=require('http');
const url=require('url');
const fs=require('fs'); // filesystem reader
const path=require('path');

const port=process.env.PORT || 3000;
const host=process.env.HOST || 'localhost';

const hakusivunPolku=path.join(__dirname,'hakusivu.html');
//  __dirname = (kaksi alaviivaa) määrittää absoluuttisen polun (toimii windows/linux)
const tyyliPolku=path.join(__dirname,'tyylit.css');

const palvelin=http.createServer((request, response)=>{
    const urlData=url.parse(request.url, true);
    const polku=urlData.pathname;
    //localhost:3000
    if(polku==='/'){ 
        fs.readFile(hakusivunPolku,'utf8',(err,data)=>{
            if(err) {
                response.statusCode=404;
                response.end(err.message);
            }
            else {
                response.writeHead(200, {
                    'Content-Type':'text/html',
                    'Content-Length':Buffer.byteLength(data,'utf8')
                });
                response.end(data);
            }
        });
    }
    //reitti tyylitiedoston lataamiseen
    else if(polku.startsWith('/tyylit')) {
        fs.readFile(tyyliPolku,'utf8',(err,data)=>{
            if(err) {
                response.statusCode=404;
                response.end(err.message);
            }
            else {
                response.writeHead(200, {
                    'Content-Type':'text/css',
                    'Content-Length':Buffer.byteLength(data,'utf8')
                });
                response.end(data);
            }
        });
    }
    else { //jos osoite /jotainMuuta
        response.setHeader(
            'Content-Type','text/plain; charset=utf-8'
        );
        response.statusCode=404;
        response.end('Sivua ei löytynyt');
    }

});

palvelin.listen(port,host, ()=>
    console.log(`Palvelin ${host} palvelee portissa ${port}`)
);