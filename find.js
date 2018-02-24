const fs = require('fs');
const path = require('path');

const ffprobe = require('ffprobe'); // to get media info
const ffprobeStatic = require('ffprobe-static'); // needed for ffprobe to work
const yargs = require('yargs');

const utils = require('./utils');

const { argv } = yargs;

/* 
fs.readdir does not read files in subdirectories
the function below alows to do that by using fs.readdir recursively
it takes a directory as its first argument and pushes all filenames in a results array
the callback function done(err, results) allows to do something with those results
 */
const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const directories = ['E:\\nw\\_VR', 'F:\\NWVR']; // folders to search

console.log('_______________________________________________________________');

directories.forEach((dir) => {
  walk(path.normalize(dir), (err, results) => {
    if (err) throw err;
    results.forEach((result) => {
      if (path.parse(result).name.toLowerCase().includes(argv.s.toLowerCase())) {
        ffprobe(result, { path: ffprobeStatic.path })
          .then((info) => {
            console.log(path.parse(result).name);
            console.log(utils.secondsToHms(info.streams[0].duration));
            console.log(utils.formatFileSize(fs.statSync(result).size));
            console.log(path.parse(result).dir);
            console.log('_______________________________________________________________');
          })
          .catch(err => console.error(err));
      }
    });
  });
});
