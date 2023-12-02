function _1(md){return(
md`# HW05 Medium baseline`
)}

function _2(md){return(
md`## 滑鼠移動過去顯示該成員相關資訊(1pt)`
)}

function _tree(createForceDirectedTree){return(
createForceDirectedTree()
)}

function _4(md){return(
md`## 滑鼠移動過去放大節點及圖片(2pt)`
)}

function _tree2(createForceDirectedTree){return(
createForceDirectedTree({scalable: true})
)}

function _6(md){return(
md`## 點擊節點可以展開或縮放(2pt)`
)}

function _tree3(createForceDirectedTree){return(
createForceDirectedTree({scalable: true, expandable: true})
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
  const scalable = options && options.scalable || false;
  const expandable = options && options.expandable || false;
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
    .call(drag(simulation));
  
  // 添加節點外框
  const circleRadius = 20; // 調整圓圈半徑大小
  node.append("circle")
    .attr("r", circleRadius)
    .attr("fill", d => colorScaleFill(d.depth))
    .attr("stroke", d => colorScaleStroke(d.depth))
    .attr("stroke-width", 3);
  
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

    // 添加節點Tooltip
  node.append("title")
    .html(d => {
      if (!d.depth) { // 根節點 (課程)
        return d.data.Name;
      } else if (d.depth == 1) { // 子節點 (組別)
        return `組別：${d.data.Group}\n組長：${d.data.Teamleadername}\n隊名：${d.data.Teamname}\n團隊里程數：${d.data.Team_Mileage}`
      } else if (d.depth == 2) { // 葉節點 (個人)
        var personInfo = `系所：${d.data.Department}\n學號：${d.data.Classnumber}\n姓名：${d.data.Name}\n個人里程數：${d.data.Personal_Mileage}`;
        for (let i = 1; i <= 10; i++) {
          personInfo += `\n作業 ${i} 成績：${d.data["Hw" + i + "_score"]}分`
        }
        return personInfo;
      }
    });

  // 碰觸縮放節點
  if (scalable) {
    node
      .on("mouseenter", (event, d) => {
        if (d.depth) {
          var scaleFactor = 4;
          var scaledCircleRadius = circleRadius * scaleFactor;
          d3.select(event.currentTarget)
            .select("circle")
            .attr("r", scaledCircleRadius);
          d3.select(event.currentTarget)
            .select("image")
            .attr("x", -(scaledCircleRadius * offset))
            .attr("y", -(scaledCircleRadius * offset))
            .attr("width", scaledCircleRadius * size_offset)
            .attr("height", scaledCircleRadius * size_offset);
        }
      })
      .on("mouseleave", (event, d) => {
        d3.select(event.currentTarget)
          .select("circle")
          .attr("r", circleRadius);
        d3.select(event.currentTarget)
          .select("image")
          .attr("x", -(circleRadius * offset))
          .attr("y", -(circleRadius * offset))
          .attr("width", circleRadius * size_offset)
          .attr("height", circleRadius * size_offset);
      });
  }

  // 點集節點切換展開/收起子節點
  if (expandable) {
    node.on("click", ToggleNode);
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

  function ToggleNode(event, d) {
    if (!d.depth) { // 根節點 (課程)
      var depthCollapsed = true;
      nodes.forEach(node => {
        if (node.depth == 1) {
          node.collapsed = !node.collapsed;
          depthCollapsed = node.collapsed;
        } else if (node.depth == 2 && depthCollapsed) {
          node.collapsed = depthCollapsed;
        } 
      });
    } else if (d.depth == 1) { // 子節點 (組別)
      var targetGroup = d.data.Group;
      nodes.forEach(node => {
        if (node.depth > 1 && node.data.Group == targetGroup) {
          node.collapsed = !node.collapsed;
        }
      });
    }
    UpdateNodes();
  }
  
  function UpdateNodes() {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node.style("display", d => d.collapsed ? "none" : null);
    link.style("display", d => d.target.collapsed ? "none" : null);
  }
  
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
  main.variable(observer("tree")).define("tree", ["createForceDirectedTree"], _tree);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("tree2")).define("tree2", ["createForceDirectedTree"], _tree2);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("tree3")).define("tree3", ["createForceDirectedTree"], _tree3);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer("createForceDirectedTree")).define("createForceDirectedTree", ["d3","data","drag","invalidation"], _createForceDirectedTree);
  return main;
}
