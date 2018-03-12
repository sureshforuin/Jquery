"use strict";

const rimraf = require('rimraf');

rimraf('../install/common', ouch);

function ouch(err) {
    if (err) {
        console.log(err);
    }
}
