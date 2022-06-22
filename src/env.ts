import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

function loadEnviromentFactory() {
    let loaded = false;
    return () => {
        if (!loaded) {
            Logger.log(
                `Load enviroment from  ${process.env.NODE_ENV || 'env'}.env file`,
                'loadEnviroment',
            );
            dotenv.config({
                path: `.${process.env.NODE_ENV || 'dev'}.env`,
            });

            // Replace \\n with \n to support multiline strings
            for (const envName of Object.keys(process.env)) {
                process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
            }
        }
        loaded = true;
    };
}

export const loadEnviroment = loadEnviromentFactory();
