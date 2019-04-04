//index.js
//获取应用实例
import {
    IMyApp
} from '../../app';

const app = getApp<IMyApp>();

export class Index extends WxPage<any> {
    data: any;

    onLoad() {
        app.globalData;
    }
}

Page(new Index());

