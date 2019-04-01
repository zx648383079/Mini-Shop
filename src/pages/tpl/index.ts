//index.js
//获取应用实例
import {
    IMyApp
} from '../../app';

const app = getApp<IMyApp>();

class Index implements IPage {
    data: any;

    onLoad() {
        app.globalData;
    }
}

Page(new Index());