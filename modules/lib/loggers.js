module.exports = (function(){
    var log4js = require('log4js');
    log4js.configure({
        appenders: [
            {
                type: 'console'
            },
            {
                type: 'file',
                filename: 'logs/access.log',
                maxLogSize: 1024 * 1024 * 16,
                backups: 3,
                category: 'access'
            },
            {
                type: 'file',
                filename: 'logs/output.log',
                maxLogSize: 1024 * 1024 * 16,
                backups: 3,
                category: 'output'
            }
        ]
    });

    var outputLogger = log4js.getLogger('output');
    outputLogger.setLevel('DEBUG');

    var accessLogger = log4js.getLogger('access');
    accessLogger.setLevel('INFO');

    return {
        output: outputLogger,
        access: accessLogger
    };
}());
