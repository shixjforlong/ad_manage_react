// 全局 G2 设置
import { setTheme, Shape, track } from 'bizcharts';
import { getFillAttrs } from '../../utils/utils';

track(false);

const config = {
  defaultColor: '#1089ff',
  shape: {
    interval: {
      fillOpacity: 1,
    },
  },
};

Shape.registerShape('interval', 'borderRadius', {
  draw(cfg, container) {
    const { points } = cfg;
    const attrs = getFillAttrs(cfg);
    let path = [];
    path.push(['M', points[0].x, points[0].y]);
    path.push(['L', points[1].x, points[1].y]);
    path.push(['L', points[2].x, points[2].y]);
    path.push(['L', points[3].x, points[3].y]);
    path.push('Z');
    path = this.parsePath(path); // 将 0 - 1 转化为画布坐标
    const width = path[2][1] - path[1][1];
    let height = path[0][2] - path[1][2];
    const d = Math.max(0, width - height);
    height = Math.max(width, height);
    return container.addShape('rect', {
      attrs: {
        radius: width / 2, // half of width
        ...attrs,
        x: path[1][1], // start at left top corner
        y: path[1][2] - d,
        width,
        height,
      },
    });
  },
});

function getRectPath(points) {
  const path = [];
  for (let i = 0; i < points.length; i += 1) {
    const point = points[i];
    if (point) {
      const action = i === 0 ? 'M' : 'L';
      path.push([action, point.x, point.y]);
    }
  }
  const first = points[0];
  path.push(['L', first.x, first.y]);
  path.push(['z']);
  return path;
}

// 顶边带圆角
Shape.registerShape('interval', 'top', {
  draw(cfg, container) {
    const attrs = getFillAttrs(cfg);
    let path = getRectPath(cfg.points);
    path = this.parsePath(path); // 将 0 - 1 的值转换为画布坐标
    const width = path[2][1] - path[1][1];
    const height = path[0][2] - path[1][2];
    const radius = Math.min(width, height) / 2;
    const temp = [];
    temp.push(['M', path[0][1], path[0][2]]);
    temp.push(['L', path[1][1], path[1][2] + radius]);
    temp.push(['A', radius, radius, 90, 0, 1, path[1][1] + radius, path[1][2]]);
    temp.push(['L', path[2][1] - radius, path[2][2]]);
    temp.push(['A', radius, radius, 90, 0, 1, path[2][1], path[2][2] + radius]);
    temp.push(['L', path[3][1], path[3][2]]);
    temp.push(['Z']);
    return container.addShape('path', {
      attrs: {
        ...attrs,
        path: temp,
      },
    });
  },
});
// 底边带圆角
Shape.registerShape('interval', 'bottom', {
  draw(cfg, container) {
    const attrs = getFillAttrs(cfg);
    let path = getRectPath(cfg.points);
    path = this.parsePath(path);
    const width = path[2][1] - path[1][1];
    const height = path[0][2] - path[1][2];
    const radius = Math.min(width, height) / 2;
    const temp = [];
    temp.push(['M', path[0][1] + radius, path[0][2]]);
    temp.push(['A', radius, radius, 90, 0, 1, path[0][1], path[0][2] - radius]);
    temp.push(['L', path[1][1], path[1][2]]);
    temp.push(['L', path[2][1], path[2][2]]);
    temp.push(['L', path[3][1], path[3][2] - radius]);
    temp.push(['A', radius, radius, 90, 0, 1, path[3][1] - radius, path[3][2]]);
    temp.push(['Z']);
    return container.addShape('path', {
      attrs: {
        ...attrs,
        path: temp,
      },
    });
  },
});

setTheme(config);
