function _1(md){return(
md`# HW05 Simple baseline`
)}

function _2(md){return(
md`## 實作Force-directed tree呈現小組情況(1pt)`
)}

function _tree1(createForceDirectedTree){return(
createForceDirectedTree()
)}

function _4(md){return(
md`## 使節點可以被拖拉移動(1pt)`
)}

function _tree2(createForceDirectedTree){return(
createForceDirectedTree({
  draggable: true
})
)}

function _6(md){return(
md`## 將個人圖片放入節點圓圈中(1pt)`
)}

function _tree3(createForceDirectedTree){return(
createForceDirectedTree({
  draggable: true,
  withImage: true
})
)}

function _data(FileAttachment){return(
FileAttachment("scored-output.json").json()
)}

function _drag(d3){return(
simulation => {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended); 
}
)}

function _createForceDirectedTree(d3,data,drag,invalidation){return(
function createForceDirectedTree(options) {
  const draggable = options && options.draggable || false;
  const withImage = options && options.withImage || false;
  
  // 指定圖表的尺寸。
  const width = 1500;
  const height = 1000;
  
  // 計算圖形並啟動力模擬。
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();
  
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
  
  // 創建容器 SVG。
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  
  // 添加連結。
  const link = svg.append("g")
    .attr("stroke", "#771db2")
    .attr("stroke-opacity", 0.8)
    .selectAll("line")
    .data(links)
    .join("line");
  
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000) // 增加連結的距離
    .strength(1); // 可選：設定連結的強度
  
  // 設定節點的顏色，根據階層關係選擇不同的顏色
  const colorScaleStroke = d3.scaleOrdinal(d3.schemeSet1);
  const colorScaleFill = d3.scaleOrdinal(d3.schemePastel1);
  
  // 添加節點。
  const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`) // 定位節點
    .call(draggable ? drag(simulation) : (selection) => selection);
  
  // 添加節點外框
  const circleRadius = 20; // 調整圓圈半徑大小
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", d => colorScaleFill(d.depth))
    .attr("stroke", d => colorScaleStroke(d.depth))
    .attr("stroke-width", 3);

  if (withImage) {
    // 設定圖片大小
    const size_offset = 1.3;
  
    // 計算偏移量
    const offset = size_offset / 2; // 控制內圖片放置位置的偏移量
  
    // 添加內圖
    node.append("image")
      .attr("x", -(circleRadius * offset))
      .attr("y", -(circleRadius * offset))
      .attr("width", circleRadius * size_offset)
      .attr("height", circleRadius * size_offset)
      .attr("href", d => d.data.image_url);
  }
  
  // 設定節點初始位置在畫布的中間
  nodes.forEach(node => {
    node.x = 0;
  });
  
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  });
  
  invalidation.then(() => simulation.stop());
  
  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["scored-output.json", {url: new URL("./files/419d812616a63ad7595ec42504df24a3c9eb611bf1f3adc6568e70dee6a0f666cb51aecfd9e93ad3559a9829c7de402706208605b432168287edb3688f890d8a.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("tree1")).define("tree1", ["createForceDirectedTree"], _tree1);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("tree2")).define("tree2", ["createForceDirectedTree"], _tree2);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("tree3")).define("tree3", ["createForceDirectedTree"], _tree3);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer("createForceDirectedTree")).define("createForceDirectedTree", ["d3","data","drag","invalidation"], _createForceDirectedTree);
  return main;
}
