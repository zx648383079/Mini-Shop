/*! *****************************************************************************
Copyright (c) 2018 Tencent, Inc. All rights reserved. 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
***************************************************************************** */

declare namespace Page {

  interface ICustomShareContent {
    /** 转发标题。默认值：当前小程序名称 */
    title?: string
    /** 转发路径，必须是以 / 开头的完整路径。默认值：当前页面 path */
    path?: string
    /** 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4，最低基础库： `1.5.0`。默认值：使用默认截图 */
    imageUrl?: string
  }

  interface IPageScrollOption {
    /** 页面在垂直方向已滚动的距离（单位px） */
    scrollTop: number
  }

  interface IShareAppMessageOption {
    /** 转发事件来源。
     *
     * 可选值：
     * - `button`：页面内转发按钮；
     * - `menu`：右上角转发菜单。
     *
     * 最低基础库： `1.2.4`
     */
    from: 'button' | 'menu' | string
    /** 如果 `from` 值是 `button`，则 `target` 是触发这次转发事件的 `button`，否则为 `undefined`
     *
     * 最低基础库： `1.2.4` */
    target: any
    /** 页面中包含`<web-view>`组件时，返回当前`<web-view>`的url
     *
     * 最低基础库： `1.6.4`
     */
    webViewUrl?: string
  }

  interface ITabItemTapOption {
    /** 被点击tabItem的序号，从0开始，最低基础库： `1.9.0` */
    index: string
    /** 被点击tabItem的页面路径，最低基础库： `1.9.0` */
    pagePath: string
    /** 被点击tabItem的按钮文字，最低基础库： `1.9.0` */
    text: string
  }

  interface PageInstanceBaseProps<D extends IAnyObject = any> {
    /** 页面的初始数据
     * 
     * `data` 是页面第一次渲染使用的**初始数据**。
     * 
     * 页面加载时，`data` 将会以`JSON`字符串的形式由逻辑层传至渲染层，因此`data`中的数据必须是可以转成`JSON`的类型：字符串，数字，布尔值，对象，数组。
     * 
     * 渲染层可以通过 `WXML` 对数据进行绑定。
    */
    data?: D

    /** `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
     *
     * **注意：**
     *
     * 1. **直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致**。
     * 1. 仅支持设置可 JSON 化的数据。
     * 1. 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
     * 1. 请不要把 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题。
     */

    setData?<K extends keyof D>(
      /** 这次要改变的数据
       *
       * 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。
       *
       * 其中 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `array[2].message`，`a.b.c.d`，并且不需要在 this.data 中预先定义。
       */
      data: D | Pick<D, K> | IAnyObject,
      /** setData引起的界面更新渲染完毕后的回调函数，最低基础库： `1.5.0` */
      callback?: () => void
    ): void

    /** 到当前页面的路径，类型为`String`。最低基础库： `1.2.0` */
    route?: string
  }

  interface PageInstance<D extends IAnyObject = any, T extends IAnyObject = any> extends PageInstanceBaseProps<D> {
    /** 生命周期回调—监听页面加载
     *
     * 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
     */
    onLoad?(
      /** 打开当前页面路径中的参数 */
      query?: { [queryKey: string]: string }
    ): void
    /** 生命周期回调—监听页面显示
     *
     * 页面显示/切入前台时触发。
     */
    onShow?(): void
    /** 生命周期回调—监听页面初次渲染完成
     * 
     * 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
     * 
   
     * 注意：对界面内容进行设置的 API 如`wx.setNavigationBarTitle`，请在`onReady`之后进行。
    */
    onReady?(): void
    /** 生命周期回调—监听页面隐藏
     *
     * 页面隐藏/切入后台时触发。 如 `navigateTo` 或底部 `tab` 切换到其他页面，小程序切入后台等。
     */
    onHide?(): void
    /** 生命周期回调—监听页面卸载
     *
     * 页面卸载时触发。如`redirectTo`或`navigateBack`到其他页面时。
     */
    onUnload?(): void
    /** 监听用户下拉动作
     *
     * 监听用户下拉刷新事件。
     * - 需要在`app.json`的`window`选项中或页面配置中开启`enablePullDownRefresh`。
     * - 可以通过`wx.startPullDownRefresh`触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
     * - 当处理完数据刷新后，`wx.stopPullDownRefresh`可以停止当前页面的下拉刷新。
     */
    onPullDownRefresh?(): void
    /** 页面上拉触底事件的处理函数
     *
     * 监听用户上拉触底事件。
     * - 可以在`app.json`的`window`选项中或页面配置中设置触发距离`onReachBottomDistance`。
     * - 在触发距离内滑动期间，本事件只会被触发一次。
     */
    onReachBottom?(): void
    /** 用户点击右上角转发
     *
     * 监听用户点击页面内转发按钮（`<button>` 组件 `open-type="share"`）或右上角菜单“转发”按钮的行为，并自定义转发内容。
     *
     * **注意：只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮**
     *
     * 此事件需要 return 一个 Object，用于自定义转发内容
     */
    onShareAppMessage?(
      /** 分享发起来源参数 */
      options?: IShareAppMessageOption
    ): ICustomShareContent
    /** 页面滚动触发事件的处理函数
     *
     * 监听用户滑动页面事件。
     */
    onPageScroll?(
      /** 页面滚动参数 */
      options?: IPageScrollOption
    ): void

    /** 当前是 tab 页时，点击 tab 时触发，最低基础库： `1.9.0` */
    onTabItemTap?(
      /** tab 点击参数 */
      options?: ITabItemTapOption
    ): void
  }

  interface PageConstructor {
    <D extends IAnyObject, T extends IAnyObject & PageInstance>(
      options: PageInstance<D, T> & T
    ): void
  }

  interface GetCurrentPages {
    <D extends IAnyObject = {}, T extends IAnyObject = {}>(): (PageInstance<D, T> & T)[]
  }
}

declare interface IPage<T> extends Page.PageInstance<T>, wx.WxComponent {
  
}

declare const Page: Page.PageConstructor
declare const getCurrentPages: Page.GetCurrentPages

interface IComponentProperty {
    type?: Object | String | Number,
    value?: any,
    observer?: (newVal: any, oldVal: any, changedPath: string) => void
}

interface IComponentLefeTime {
    attached?: Function,
    moved?: Function,
    detached?: Function
}

interface IComponentPageLefeTime {
    show?: Function,
    hide?: Function,
    resize?: Function
}

interface IComponentRelation {
    type?: string,
    linked?: (target: any) => void,
    linkChanged?: (target: any) => void,
    unlinked?: (target: any) => void,
}

interface IBehaviorLefeTime {
    created?: Function,
}

declare interface IBehavior {
    behaviors?: IBehavior[],
    lifetimes?: IBehaviorLefeTime,
    definitionFilter?(defFields: any, definitionFilterArr: any): void,
}

declare const Behavior: (options: IBehavior) => IBehavior;

declare interface IMethod {
  [key: string]: (this: Page.PageInstance, e:any) => void
}

export declare function WxMethod(): MethodDecorator;

export declare function WxLifeTime(): MethodDecorator;
export declare function WxPageLifeTime(): MethodDecorator;

interface IPageJson {
  [key: string]: any;
  /**
   * 使用的自定义部件
   */
  usingComponents?: {[tag: string]: string},
  /**
   * 导航栏标题内容
   */
  navigationBarTitleText?: string,
  /**
   * 导航栏背景
   */
  navigationBarBackgroundColor?: string,
  /**
   * 导航栏字体颜色
   */
  navigationBarTextStyle?: string,
  /**
   * 导航栏样式
   */
  navigationStyle?: 'default' | 'custom',
  /**
   * 是否是自定义部件
   */
  component?: boolean,
  /**
   * 窗口的背景色
   */
  backgroundColor?: string,
  /**
   * 下拉 loading 的样式，仅支持 dark / light
   */
  backgroundTextStyle?: 'dark' | 'light',
  /**
   * 顶部窗口的背景色，仅 iOS 支持
   */
  backgroundColorTop?: string,
  /**
   * 底部窗口的背景色，仅 iOS 支持
   */
  backgroundColorBottom?: string,
  /**
   * 是否开启当前页面下拉刷新。
   */
  enablePullDownRefresh?: boolean,
  /**
   * 页面上拉触底事件触发时距页面底部距离，单位为px。
   */
  onReachBottomDistance?: number,
  /**
   * 屏幕旋转设置
   */
  pageOrientation?: 'auto' | 'portrait' | 'landscape',
  /**
   * 设置为 true 则页面整体不能上下滚动。 只在页面配置中有效，无法在 app.json 中设置
   */
  disableScroll?: boolean,
  /**
   * 禁止页面右滑手势返回
   */
  disableSwipeBack?: boolean,
}

export declare function WxJson(options: IPageJson): ClassDecorator;

declare interface IComponent<T> extends Page.PageInstance<T>, wx.WxComponent {
    /**
     * 组件的对外属性，是属性名到属性设置的映射表
     */
    properties?: {[key: string]: IComponentProperty|Object | String | Number},
    /**
     * 组件生命周期声明对象
     */
    lifetimes?: IComponentLefeTime,
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached?: Function,
    ready?: Function,
    options?: any,
    /**
     * 组件接受的外部样式类
     */
    externalClasses?: string|string[],
    /**
     * 组件所在页面的生命周期声明对象，支持页面的 show 、 hide 等生命周期
     */
    pageLifetimes?: IComponentPageLefeTime,
    /**
     * 定义段过滤器
     */
    definitionFilter?: Function,
    /**
     * 组件生命周期声明对象
     */
    methods?: IMethod,
    /**
     * 类似于mixins和traits的组件间代码复用机制
     */
    behaviors?: IBehavior[],
    /**
     * 组件数据字段监听器
     */
    observers?: {[key: string]: (args: any)=>void},
    /**
     * 组件间关系定义
     */
    relations?: {[key: string]: IComponentRelation},

    triggerEvent?(name: string, detail: any, options: any): void,
    createSelectorQuery?(): any,
    selectComponent?(selector: string): any,
    selectAllComponents?(selector: string): any,
    getRelationNodes?(relationKey: string): any,
    groupSetData?(callback: Function): any,
    getTabBar?(): any,
}

declare const Component: (options: IComponent<any>) => void;

declare class WxPage<T> implements IPage<T> {

  public data: T;
  public route: string;

  onLoad?(
    /** 打开当前页面路径中的参数 */
    query?: { [queryKey: string]: string }
  ): void
  /** 生命周期回调—监听页面显示
   *
   * 页面显示/切入前台时触发。
   */
  onShow?(): void
  /** 生命周期回调—监听页面初次渲染完成
   * 
   * 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
   * 
 
   * 注意：对界面内容进行设置的 API 如`wx.setNavigationBarTitle`，请在`onReady`之后进行。
  */
  onReady?(): void
  /** 生命周期回调—监听页面隐藏
   *
   * 页面隐藏/切入后台时触发。 如 `navigateTo` 或底部 `tab` 切换到其他页面，小程序切入后台等。
   */
  onHide?(): void
  /** 生命周期回调—监听页面卸载
   *
   * 页面卸载时触发。如`redirectTo`或`navigateBack`到其他页面时。
   */
  onUnload?(): void
  /** 监听用户下拉动作
   *
   * 监听用户下拉刷新事件。
   * - 需要在`app.json`的`window`选项中或页面配置中开启`enablePullDownRefresh`。
   * - 可以通过`wx.startPullDownRefresh`触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
   * - 当处理完数据刷新后，`wx.stopPullDownRefresh`可以停止当前页面的下拉刷新。
   */
  onPullDownRefresh?(): void
  /** 页面上拉触底事件的处理函数
   *
   * 监听用户上拉触底事件。
   * - 可以在`app.json`的`window`选项中或页面配置中设置触发距离`onReachBottomDistance`。
   * - 在触发距离内滑动期间，本事件只会被触发一次。
   */
  onReachBottom?(): void
  /** 用户点击右上角转发
   *
   * 监听用户点击页面内转发按钮（`<button>` 组件 `open-type="share"`）或右上角菜单“转发”按钮的行为，并自定义转发内容。
   *
   * **注意：只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮**
   *
   * 此事件需要 return 一个 Object，用于自定义转发内容
   */
  onShareAppMessage?(
    /** 分享发起来源参数 */
    options?: Page.IShareAppMessageOption
  ): Page.ICustomShareContent
  /** 页面滚动触发事件的处理函数
   *
   * 监听用户滑动页面事件。
   */
  onPageScroll?(
    /** 页面滚动参数 */
    options?: Page.IPageScrollOption
  ): void

  /** 当前是 tab 页时，点击 tab 时触发，最低基础库： `1.9.0` */
  onTabItemTap?(
    /** tab 点击参数 */
    options?: Page.ITabItemTapOption
  ): void

  public setData<K extends keyof T>(
    data: T| Pick<T, K> | IAnyObject,
    callback?: () => void
  ): void;

  canvasGetImageData(option: wx.CanvasGetImageDataOption): void;
    /** [wx.canvasPutImageData(Object object, Object this)](wx.canvasPutImageData.md)
     *
     * 将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件
     *
     * 最低基础库： `1.9.0` */
    canvasPutImageData(option: wx.CanvasPutImageDataOption): void;
    /** [wx.canvasToTempFilePath(Object object, Object this)](wx.canvasToTempFilePath.md)
     *
     * 把当前画布指定区域的内容导出生成指定大小的图片。在 `draw()` 回调里调用该方法才能保证图片导出成功。 */
    canvasToTempFilePath(option: wx.CanvasToTempFilePathOption): void;
    /** [[CanvasContext]((CanvasContext)) wx.createCanvasContext(string canvasId, Object this)](wx.createCanvasContext.md)
     *
     * 创建 canvas 的绘图上下文 `CanvasContext` 对象 */
    createCanvasContext(
      /** 要获取上下文的 `<canvas>` 组件 canvas-id 属性 */
      canvasId: string,
    ): wx.CanvasContext;

    createAudioContext(
      /** `<audio/>` 组件的 id */
      id: string,
    ): wx.AudioContext;
    /** [[CameraContext]((CameraContext)) wx.createCameraContext()](wx.createCameraContext.md)
     *
     * 创建 `camera` 上下文 `CameraContext` 对象。
     *
     * 最低基础库： `1.6.0` */
    createCameraContext():  wx.CameraContext;
    /** [[InnerAudioContext]((InnerAudioContext)) wx.createInnerAudioContext()](wx.createInnerAudioContext.md)
     *
     * 创建内部 `audio` 上下文 `InnerAudioContext` 对象。
     *
     * 最低基础库： `1.6.0` */
    createInnerAudioContext():  wx.InnerAudioContext;
    /** [[LivePlayerContext]((LivePlayerContext)) wx.createLivePlayerContext(string id, Object this)](wx.createLivePlayerContext.md)
     *
     * 创建 `live-player` 上下文 `LivePlayerContext` 对象。
     *
     * 最低基础库： `1.7.0` */
    createLivePlayerContext(
      /** `<live-player/>` 组件的 id */
      id: string,
    ):  wx.LivePlayerContext;
    /** [[LivePusherContext]((LivePusherContext)) wx.createLivePusherContext()](wx.createLivePusherContext.md)
     *
     * 创建 `live-pusher` 上下文 `LivePusherContext` 对象。
     *
     * 最低基础库： `1.7.0` */
    createLivePusherContext():  wx.LivePusherContext;
    /** [[MapContext]((MapContext)) wx.createMapContext(string mapId, Object this)](wx.createMapContext.md)
     *
     * 创建 `map` 上下文 `MapContext` 对象。 */
    createMapContext(
      /** `<map/>` 组件的 id */
      mapId: string,
    ):  wx.MapContext;
    /** [[VideoContext]((VideoContext)) wx.createVideoContext(string id, Object this)](wx.createVideoContext.md)
     *
     * 创建 `video` 上下文 `VideoContext` 对象。 */
    createVideoContext(
      /** `<video/>` 组件的 id */
      id: string,
    ):  wx.VideoContext;

    public createIntersectionObserver(options: wx.CreateIntersectionObserverOption,
      ): wx.IntersectionObserver;
}

declare class WxComponent<T> extends WxPage<T> implements IComponent<T> {
    __wxExparserNodeId__: string;
      /**
     * 组件的对外属性，是属性名到属性设置的映射表
     */
    properties?: {[key: string]: IComponentProperty|Object | String | Number};
    /**
     * 组件生命周期声明对象
     */
    lifetimes?: IComponentLefeTime;
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached?(): void;
    ready?(): void;
    options?: any;
    /**
     * 组件接受的外部样式类
     */
    externalClasses?: string|string[];
    /**
     * 组件所在页面的生命周期声明对象，支持页面的 show 、 hide 等生命周期
     */
    pageLifetimes?: IComponentPageLefeTime;
    /**
     * 定义段过滤器
     */
    definitionFilter?(): void;
    /**
     * 组件生命周期声明对象
     */
    methods?: IMethod;
    /**
     * 类似于mixins和traits的组件间代码复用机制
     */
    behaviors?: IBehavior[];
    /**
     * 组件数据字段监听器
     */
    observers?: {[key: string]: (args: any)=>void};
    /**
     * 组件间关系定义
     */
    relations?: {[key: string]: IComponentRelation};

  public triggerEvent(name: string, detail?: any, options?: any): void;
  public createSelectorQuery(): any;
  public selectComponent(selector: string): any;
  public selectAllComponents(selector: string): any;
  public getRelationNodes<T>(relationKey: string): T[];
  public groupSetData(callback: Function): any;
  public getTabBar(): any;
}

declare interface BaseEvent {
  type:           string;
  timeStamp:      number;
  target:         Target;
  currentTarget:  Target;
}

declare interface CustomEvent extends BaseEvent {
  detail:         Detail;
}

declare interface InputEvent extends BaseEvent {
  detail:         any;
}

declare interface TouchEvent extends BaseEvent {
  touches:        Touch[] | CanvasTouch[];
  changedTouches: Touch[] | CanvasTouch[];
}

interface Touch {
  identifier: number;
  pageX:      number;
  pageY:      number;
  clientX:    number;
  clientY:    number;
}

interface CanvasTouch {
  identifier: number;
  x: number;
  y: number;
}

interface Target {
  id:      string| number;
  tagName: string;
  dataset: {[key: string]: string|number};
}

interface Detail {
  [key: string]: any,
  x: number;
  y: number;
}