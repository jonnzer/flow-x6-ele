<template>
  <div class="page-wrapper">
    <div class="controll-wrapper">
      <div class="size-control-wrapper">
        <el-button @click="addZoom"> + </el-button>
        <el-button @click="reduceZoom"> - </el-button>
        <el-button @click="restoreZoom"> reset </el-button>
        <el-button @click="save"> save </el-button>
        <el-button @click="addRect"> addRect </el-button>
        <el-button @click="updateNode1"> updateNode1 </el-button>
      </div>
    </div>
    <div class="dnd-wrap">
      <div data-type="rect" class="dnd-rect" @mousedown="startDrag">
        Rect
      </div>
      <div data-type="circle" class="dnd-circle" @mousedown="startDrag">
        Circle
      </div>
    </div>
    <div id="container" class="content-area-wrapper">
    </div>

    <div class="edit-wrapper"></div>
  </div>
</template>
<script>
import { Graph, Shape, ObjectExt } from '@antv/x6'
import { Dnd } from "@antv/x6-plugin-dnd";
export default {
  data() {
    return {
      graph: null,
      dnd: null
    }
  },
  methods: {
    init() {
      const data = {
        // 节点
        nodes: [
          {
            id: 'node1', // String，可选，节点的唯一标识
            shape: 'rect', // 使用 rect 渲染
            x: 40,       // Number，必选，节点位置的 x 值
            y: 40,       // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            ports: { // 端口
              groups: {
                group1: { // 分组 组件
                  attrs: {
                    circle: {
                      r: 6,
                      magnet: true,
                      stroke: '#31d0c6',
                      strokeWidth: 2,
                      fill: '#fff',
                    },
                  },
                },
              },
              items: [
                {
                  id: 'port1',
                  group: 'group1', // 指定分组名称
                  attrs: {
                    text: {          // 标签选择器
                      text: 'port1', // 标签文本
                    },
                  },
                },
                {
                  id: 'port2',
                  group: 'group1', // 指定分组名称
                },
                {
                  id: 'port3',
                  group: 'group1', // 指定分组名称
                },
              ],
            },
            attrs: {
              body: {
                fill: '#2ECC71',
                stroke: '#000',
                strokeDasharray: '10,2',
              },
              label: {
                text: 'Hello',
                fill: '#333',
                fontSize: 13,
              }
            },
            data: {
              a: 1
            }
          },
          {
            id: 'node2', // String，节点的唯一标识
            shape: 'ellipse', // 使用 ellipse 渲染
            x: 160,      // Number，必选，节点位置的 x 值
            y: 180,      // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            attrs: {
              body: {
                fill: '#F39C12',
                stroke: '#000',
                rx: 16,
                ry: 16,
              },
              label: {
                text: 'World',
                fill: '#333',
                fontSize: 18,
                fontWeight: 'bold',
                fontVariant: 'small-caps',
              },
            },
            data: {
              b: 2
            }
          },
        ],
        // 边
        edges: [
          {
            source: 'node1',
            target: 'node2',
            // vertices: [ // 经过的点
            //   { x: 100, y: 200 },
            //   { x: 300, y: 120 },
            // ],
            label: 'x6',
            shape: 'edge',
            attrs: {
              // line 是选择器名称，选中的边的 path 元素
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                targetMarker: 'classic'
                // sourceMarker: "block", // 实心箭头
                // targetMarker: {
                //   name: "ellipse", // 椭圆
                //   rx: 10, // 椭圆箭头的 x 半径
                //   ry: 6, // 椭圆箭头的 y 半径
                // },
              },
            },
          },
        ],
      };

      this.graph = new Graph({
        container: document.getElementById('container'),
        width: 800,
        height: 600,
        grid: {
          visible: true,
          type: 'doubleMesh',
          args: [
            {
              color: '#eee', // 主网格线颜色
              thickness: 1, // 主网格线宽度
            },
            {
              color: '#ddd', // 次网格线颜色
              thickness: 1, // 次网格线宽度
              factor: 4, // 主次网格线间隔
            },
          ],
        },
        panning: true, // 是否启用画布平移
        mousewheel: true
      });
     
      this.graph.fromJSON(data) // render draw
      this.graph.centerContent()
      this.dnd = new Dnd({
        target: this.graph,
        scaled: false,
        dndContainer: document.querySelector('.dnd-wrap'),
      });
    },
    addZoom() {
      // 偏移歪了
      this.graph.zoom(0.1).centerContent()
    },
    reduceZoom() {
      this.graph.zoom(-0.1).centerContent()
    },
    restoreZoom () {
      this.graph.zoomTo(1).centerContent()
    },
    save () {
      console.debug(this.graph.toJSON())
    },
    updateNode1() {
      console.debug(this.graph.getNodes())
      const node = this.graph.getCellById('node1')
      node.attr('label/text', 'hello update')
    },
    startDrag (e) {
      const type = e.currentTarget.dataset.type
      const node =
        type === 'rect'
          ?  this.graph.createNode({
            shape: "rect",
            width: 100,
            height: 40,
          })
          : this.graph.createNode({
              width: 60,
              height: 60,
              shape: 'circle',
              label: 'Circle',
              attrs: {
                body: {
                  stroke: '#8f8f8f',
                  strokeWidth: 1,
                  fill: '#fff',
                },
              },
            })
        this.dnd.start(node, e)
    },
    addRect () {
      const rect = this.graph.addNode({
        x: 100,
        y: 100,
        rx: 5,
        ry: 10,
        label: 'rect',
      })
      const node = this.graph.getCellById('node1')
      this.graph.addEdge({
        source: rect,
        target: { 
          cell: node, 
          port: 'port1', // 链接桩 ID
        },
      })
    },
    initShapeConfig() {
      // https://x6.antv.antgroup.com/tutorial/basic/node#:~:text=%7D-,%E5%AE%9A%E5%88%B6%E8%8A%82%E7%82%B9,-%E6%88%91%E4%BB%AC%E5%8F%AF%E4%BB%A5%E9%80%9A%E8%BF%87
      Shape.Rect.config({ // config 改变rect默认设置 ， 同修改全局的有个regiserNode
        width: 80,
        height: 40,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: { // 对应selector css
            fill: '#fff',
            stroke: '#000',
            strokeWidth: 2,
          },
          label: {
            fontSize: 14,
            fill: '#333',
            fontFamily: 'Arial, helvetica, sans-serif',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
          }
        },
        propHooks: { // 自定义选项
          label(metadata) {
            const { label, ...others } = metadata
            if (label) {
              ObjectExt.setByPath(others, 'attrs/text/text', label)
            }
            return others
          },
          rx(metadata) { 
            const { rx, ...others } = metadata
            if (rx != null) {
              ObjectExt.setByPath(others, 'attrs/body/rx', rx)
            }
            return others
          },
          ry(metadata) { 
            const { ry, ...others } = metadata
            if (ry != null) {
              ObjectExt.setByPath(others, 'attrs/body/ry', ry)
            }
            return others
          },
        },
      })
    }
  },
  created() {
  },
  mounted() {
    this.initShapeConfig()
    this.init()
  },
  destroyed () {
    this.graph.dispose()
  }
}
</script>
<style lang="scss">
.page-wrapper {
  width: 100vw;
  height: 100vh;

  // align-items: center;
  .content-area-wrapper {
    background-color: #f5f5f5;
    position: relative;
  }

  .size-control-wrapper {
    display: block;
    display: flex;
    justify-content: center;
  }

  .edit-wrapper {}
  .dnd-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    user-select: none;

    .dnd-rect {
      width: 100px;
      height: 40px;
      margin: 16px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #8f8f8f;
      border-radius: 6px;
      cursor: move;
    }

    .dnd-circle {
      width: 60px;
      height: 60px;
      margin: 16px;
      line-height: 60px;
      text-align: center;
      border: 1px solid #8f8f8f;
      border-radius: 100%;
      cursor: move;
    }
  }
}
</style>
  