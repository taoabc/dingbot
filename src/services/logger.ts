import winston from 'winston';
import fs from 'fs-extra';
import path from 'path';
import { FileTransportOptions } from 'winston/lib/winston/transports';

const logdir = path.resolve(__dirname, '../../logs');
fs.ensureDirSync(logdir);

function createFileTransport(dir: string, filename: string, level: string | null) {
  const filepath = path.resolve(dir, filename);
  const opt: FileTransportOptions = {
    filename: filepath,
    // maxsize: 2000,
    // maxFiles: 5,
    // zippedArchive: true
  };
  if (level) {
    opt.level = level;
  }
  return new winston.transports.File(opt);
}

const logger = winston.createLogger({
  level: 'info',
  transports: [
    createFileTransport(logdir, 'error.log', 'error'),
    createFileTransport(logdir, 'combined.log', null),
  ],
  exceptionHandlers: [
    createFileTransport(logdir, 'exceptions.log', null),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
