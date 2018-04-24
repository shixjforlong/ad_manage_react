
# 启动服务

package.json配置的启动命令  npm start

代理配置在 .webpackrc 文件里设置 

备注： .webpackrc已替换 .roadhogrc 文件


# 国际化使用
(使用方法地址：https://github.com/alibaba/react-intl-universal)
```javascript
import intl from 'react-intl-universal';

// 方法一：
<Tab key="mobile" tab={intl.get('common.phone_login')} />  
 // 带变量的方式:
  国际化 —— desc: 'This is a { name }, so, care for { who }.'
   使用 —— intl.get('common.phone_login', { name:'pig', who:'Monkey' })
// 方法二： 
——国际化配置文件在 src/locale 里
common: {...}：存放通用国际化
其他的国际化采用分模块化，例如现场管理模块 sitemanage: { site: '现场' }
```


# 提示信息



# 表单校验



# 加载数据等待



# es6 对象的 Null 传导运算符 ?. (该提案在项目里不能编译通过?)
    
    const name = message?.body?.user?.name || 'defaultValue';
    如果?.其中一个是null或undefined，就不会继续往后运算，而是返回undefined。
    所以上面的表达式意思是：当?.的表达式都存在，则name = message.body.user.name；如果?.其中一个是null或undefined，则name = 'defaultValue'；



# 本地静态资源使用
    <img src={require('../assets/picture.png')} />
    !注意:
         1. public/ 下可以存放全局的 js文件  或 css文件等, 然后再index.ejs中引用后，则全局生效。
         2. src/assets/ 下可以存放图片等静态资源
    
# 样式文件
    全局样式文件定义地方: 
    
    方式一：
        src/common.less ： 
        :global {
          .classname1 {
            ...
          }
          .classname2 {
            ...
          }
    }
    
    方式二：
        直接在 public/styles.css 里添加
        
     ！建议最好采用第一种方式， 在common.less里添加全局样式，或则在common.less里引入其他less文件
    
    src/utils/utils.less ： 定义全局less工具方法
    
    src/utils/utils.js ： 定义全局工具方法


# 阿里图标库的使用
 在jsx中使用：
 ```javascript
 /**
  * 不在使用class方式，以后统一使用组件方式
  * 
        <i className="iconfont icon-xxxxxx" />
        //或者
        <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-xxxxxx" />
        </svg>
   */ 
   import BizIcon from 'components/BizIcon'; //相对路径
   <BizIcon type="weixiu" style={{ color: 'red', fontSize: '20px' }}/> 
    //多个图标组合 则需将BizIcon组件加在className为bi-layersd的标签中，且BizIcon组件要 和layer，transform为缩放成都
    <span className="bi-layers">
        <BizIcon type="correct" layer style={{ fontSize: '28' }} />
        <BizIcon type="weixiu" layer transform="3" style={{ fontSize: '28', color: 'white' }} />
    </span>
  ```

# 下载组件
1.引用
```javascript
import { filedownload } from 'utils/filedownload'; //相对路径
 ```
 2.调用
 ```javascript
 /**
 * 参数说明
 * data 要下载的对象内容
 * filename  文件名称
 * mime  Content-Type
 * url: 下载地址  
 * url下载时 data和filename可以为null
 **/
 filedownload(data, filename, mime, url); 
 eg：
    filedownload(data, filename); //前端下载可省略url
    //url下载
    filedownload(null, filename, null, 'http://test.shebeiyun.net/apps/DN4App/android/DeviceNetwork.apk');
        
 ```


# 
