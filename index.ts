/// <reference path="typings/node/node.d.ts" />

import http = require("http");
import zlib = require("zlib");
import fs = require("fs");

var cdn = [
    {
        url: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/css/themes/infragistics/infragistics.theme.css",
        filename: "infragistics.theme.css"
    },
    {
        url: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/css/structure/infragistics.css",
        filename: "infragistics.css"
    },
    {
        url: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/js/infragistics.core.js",
        filename: "infragistics.core.js"
    },
    {
        url: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/js/infragistics.dv.js",
        filename: "infragistics.dv.js"
    },
    {
        url: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/js/infragistics.lob.js",
        filename: "infragistics.lob.js"
    }
];

if (!fs.existsSync('igniteui'))
    fs.mkdir('igniteui', (err) => {
        if (err)
            console.log("Unable to create directory. Check permissions.")
        else {
            fs.mkdir('igniteui/js', () => {
                fs.mkdir('igniteui/css', () => {
                    cdn.forEach((link) =>{
                        console.log(link);
                        http.get(link.url, function(res) {
                            var buffer = [];
                            var gunzip = zlib.createGunzip();
                            res.pipe(gunzip);

                            gunzip.on('data', function(data) {
                                //Decompression chunk ready, add it to the buffer

                                buffer.push(data.toString())
                            }).on("end", function() {
                                //Response and decompression complete, join the buffer and return
                                var output = buffer.join("");
                                if (link.filename.split(".").pop() === "css")
                                    fs.writeFile('igniteui/css/' + link.filename, output);
                                else
                                    fs.writeFile('igniteui/js/' + link.filename, output);
                            }).on("error", function(err) {
                                console.log(err);
                            })
                        });
                    });
                });
            });
        }
    });