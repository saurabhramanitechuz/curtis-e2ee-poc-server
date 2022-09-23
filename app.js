'use strict';
const appPackage = require(__dirname + '/package.json');
const Hapi = require('@hapi/hapi');
const colors = require('colors/safe');
const Config = require('config');
const utils = require('./services/utils/utils.js');
const db = require('./services/utils/db.js')
const Pack = require('./package');

async function start() {

    try {
        await db.connect();

        utils.addModels();

        const server = new Hapi.Server(Config.util.toObject(Config.get('server.connection')))

        await utils.addPolicies(server)

        const swaggerOptions = {
            info: {
                title: 'Test API Documentation',
                version: Pack.version,
            },
        };

        await server.register([
            require('./socket/base.socket'),
            require('@hapi/inert'),
            require('@hapi/vision'),
            {
                plugin: require('hapi-swagger'),
                options: swaggerOptions
            }
        ]);
        // await server.register(require('hapi-plugin-websocket'));

        utils.addRoute(server);

        await server.start()
        console.log(colors.green('%s %s started on %s'), appPackage.name, appPackage.version, server.info.uri);

        module.exports = server;

    } catch (err) {
        console.log(err)
        process.exit(0)
    }
}

start()