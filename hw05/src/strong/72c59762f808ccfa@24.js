function _1(md){return(
md`# HW05 Strong baseline`
)}

function _2(md){return(
md`## 利用蘋果成績圖環繞個人照片(小組)`
)}

function _selectedGroup(Inputs,classGroups){return(
Inputs.select(classGroups, {label: "選擇組別", value: "13"})
)}

function _tree(createForceDirectedTree){return(
createForceDirectedTree()
)}

function _data(FileAttachment){return(
FileAttachment("scored-output.json").json()
)}

function _svgScoreList(){return(
[
  "https://chiaoooo.github.io/vis2023f/hw01/apple/00.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/01.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/11.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/21.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/22.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/31.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/32.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/41.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/42.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/51.svg",
  "https://chiaoooo.github.io/vis2023f/hw01/apple/52.svg"
]
)}

function _classGroups(data)
{
  var groups = new Array();
  var nodes = JSON.parse(JSON.stringify(data));
  for (const group of nodes.children){
    groups.push(group.Group.toString())
  }
  return groups;
}


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

function _GetGroupData(data){return(
function GetGroupData(groupNumber) {
  var nodes = JSON.parse(JSON.stringify(data));
  for (const group of nodes.children){
    if (group.Group == groupNumber) {
      nodes.children = [group]
    }
  }
  return nodes;
}
)}

function _createForceDirectedTree(d3,GetGroupData,selectedGroup,drag,svgScoreList,invalidation){return(
function createForceDirectedTree() {
  // 指定圖表的尺寸。
  const width = 500;
  const height = 400;
  
  // 計算圖形並啟動力模擬。
  const root = d3.hierarchy(GetGroupData(selectedGroup));
  const links = root.links();
  const nodes = root.descendants();
  
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(d => (!d.source.depth) ? 200 : 100).strength(1))
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

  // 在節點外框周圍添加多個圖片
  const numImages = 10; // 圖片的數量
  const imageRadius = circleRadius + 10; // 圖片環繞外框的半徑
  const imageWidth = 20; // 圖片的寬度
  const imageHeight = 20; // 圖片的高度
  const imagesGroup = node.append("g"); // 新增一個 <g> 元素用於包裝圖片
  
  for (let i = 0; i < numImages; i++) {
      const angle = ((i / numImages) * 2 * Math.PI); // 逆時鐘排列，角度方向不變
      const x = imageRadius * Math.sin(angle); // 調整 x 座標的計算
      const y = -imageRadius * Math.cos(angle); // 調整 y 座標的計算
      imagesGroup.append("image")
          .attr("xlink:href", d => {
              if (d.data.leval == 3) { // 如果有子節點，顯示子節點的資訊
                  const score = parseInt(d.data[`Hw${i + 1}_score`]);
                  return svgScoreList[score];
              }
          })
          .attr("x", x - imageWidth / 2) // 調整 x 位置，使圖片居中
          .attr("y", y - imageHeight / 2) // 調整 y 位置，使圖片居中
          .attr("width", imageWidth)
          .attr("height", imageHeight);
  }

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

  // 點集節點切換展開/收起子節點
  node.on("click", ToggleNode);
  
  // 設定節點初始位置在畫布的中間
  nodes.forEach(node => {
    node.y = 0;
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
  main.variable(observer("viewof selectedGroup")).define("viewof selectedGroup", ["Inputs","classGroups"], _selectedGroup);
  main.variable(observer("selectedGroup")).define("selectedGroup", ["Generators", "viewof selectedGroup"], (G, _) => G.input(_));
  main.variable(observer("tree")).define("tree", ["createForceDirectedTree"], _tree);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("svgScoreList")).define("svgScoreList", _svgScoreList);
  main.variable(observer("classGroups")).define("classGroups", ["data"], _classGroups);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer("GetGroupData")).define("GetGroupData", ["data"], _GetGroupData);
  main.variable(observer("createForceDirectedTree")).define("createForceDirectedTree", ["d3","GetGroupData","selectedGroup","drag","svgScoreList","invalidation"], _createForceDirectedTree);
  return main;
}
