import { createLogger, transports, format } from 'winston';
import appRootPath from 'app-root-path';

const options = {
    file: {
        level: 'info',
        filename: `${appRootPath}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    transports: [new transports.File(options.file), new transports.Console(options.console)],
    exitOnError: false, // do not exit on handled exceptions
});

export class LoggerStream {
    write(message: string) {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
}

export default logger;
