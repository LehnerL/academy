const fs = require('fs');
const readline = require('readline');
const httpJSONRequest = require('./httpJSONRequest');
const internal_storage = {};

// const options = {
//     hostname: 'localhost',
//     path: 'http://localhost:3000/students/',
//     method: 'POST',
//     port: '3000',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': data.length
//     },    
// };

async function processLineByLine(file_name) {
    const rs = fs.createReadStream(file_name);
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    const rl = readline.createInterface({
        input: rs,
        crlfDelay: Infinity
    });
    for await (const raw_line of rl) {
        var line = raw_line.trim();
        if (!line || line.startsWith('//')) {
            continue;
        }
        // Ok, we have a non-empty non-comment line, let's see what command it is.
        // We split the line into an array of string tokens (parts of the line). 
        const params = raw_line.split(/[ \t]+/);
        let add_command = params[0];
        let add_data = params[1];
        let saveas = params[2];
        let saveasname = params[3];

        // The first token must be the command name
        switch (add_command) {
            case 'add_student':
                // handle adding a student 
                async function run() {
                    let reply;
                    let data = add_data;
                    reply = await httpJSONRequest('post', 'http://localhost:3000/students/add', data);
                    internal_storage[saveasname] = JSON.parse(data);
                    // console.log(internal_storage);
                    console.log('student added', JSON.parse(add_data));
                }
                run().catch(err => console.log(err));
                break;

            case 'get_students':
                // handle retrieving students
                async function gets() {
                    let query = '';
                    let reply;
                    const get_data = JSON.parse(add_data);
                    Object.keys(get_data).forEach(key => {
                        if (query) {
                            query += "&" + key + "=" + get_data[key]
                        }
                        else {
                            query += key + "=" + get_data[key]
                        }
                    });
                    reply = await httpJSONRequest('get', 'http://localhost:3000/?'+query);
                    console.log(reply);
                }
                gets().catch(err => console.log(err));
                break;

            case 'update_student':
                // handle updating students
                async function updt() {
                    let reply;
                    let data = JSON.parse(add_data);
                    //console.log(data);
                    reply = await httpJSONRequest('post', 'http://localhost:3000/students/update/'+data.id, add_data);
                    //const the_doc_id = internal_storage[saveasname].id;
                    console.log(reply);
                }
                updt().catch(err => console.log(err));
                break;

            case 'add_course':
                async function addcourse() {
                    let reply;
                    let data = JSON.parse(add_data);
                    //console.log(data);
                    reply = await httpJSONRequest('post', 'http://localhost:3000/students/update/'+data.id+'/addcourse/', add_data);
                    console.log(reply);
                }
                addcourse().catch(err => console.log(err));
                break;

            case 'del_student':
                async function deletes() {
                    let reply;
                    // console.log(internal_storage);
                    reply = await httpJSONRequest('post', 'http://localhost:3000/students/delete/'+add_data);
                    console.log(reply);
                }
                deletes().catch(err => console.log(err));
                break;

            case 'del_all':
                async function del_all() {
                    let reply;
                    reply = await httpJSONRequest('post', 'http://localhost:3000/students/deleteall');
                    console.log(reply);
                }
                del_all().catch(err => console.log(err));
                break;

            default:
                console.log("Unrecognized command (ignored):", line);
        }
    }
}
// For this app. to work, here you should call processLineByLine(..) 
// and give it the name of the input file.

// processLineByLine('client_test.txt');
