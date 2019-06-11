import {config} from '../modules/config';
import AppService from '../modules/app.service';
import '../modules/header.component';
import '../sass/main.scss';
// import '../index.html';

let appservice = new AppService('running');
appservice.log();
console.log(config.key);
console.log('Hello world');