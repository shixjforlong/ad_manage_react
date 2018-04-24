业务图标 对阿里图标库做了封装，提供了BizIcon组件 实现了Font Class引用和symbol引用方式，支持svg
## 阿里图标库的使用
```  
import BizIcon from 'components/BizIcon'; //相对路径 
<BizIcon type="weixiu" style={{ color: 'red', fontSize: '20px' }}/> 

//多个图标组合 则需将BizIcon组件加在className为bi-layersd的标签中，且BizIcon组件要加上svg 和layer
<span className="bi-layers">
  <BizIcon type="correct" layer style={{ fontSize: '28' }} />
  <BizIcon type="weixiu" layer transform="3" style={{ fontSize: '28', color: 'white' }} />
</span>

```