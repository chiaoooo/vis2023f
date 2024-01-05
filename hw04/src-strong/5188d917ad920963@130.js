function _1(md){return(
md`# HW4 Strong`
)}

function _artist(FileAttachment){return(
FileAttachment("artist-1.csv").csv()
)}

function _ARTIST(__query,artist,invalidation){return(
__query(artist,{from:{table:"artist"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"artist")
)}

function _C1key(artist){return(
Object.keys(artist[0])[3]
)}

function _C2key(artist){return(
Object.keys(artist[0])[10]
)}

function _C1(artist,C1key){return(
artist.map(row => row[C1key])
)}

function _C2(artist,C2key){return(
artist.map(row => row[C2key])
)}

function _scatterplotData(C1,C2){return(
C1.map((value, index) => {
    return { x: value, y: C2[index] };
})
)}

function _scatterplotData_counts(scatterplotData){return(
scatterplotData.reduce((counts, point) => {
    const key = `${point.x}-${point.y}`;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
}, {})
)}

function _finalData(scatterplotData_counts){return(
Object.keys(scatterplotData_counts).map((key) => {
    const [x, y] = key.split('-');
    return { x, y, count: scatterplotData_counts[key] };
})
)}

function _createSVG(d3,finalData)
{
  // 定義邊界大小，以及圖形的寬度和高度
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // X 軸的比例尺
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(finalData, (d) => +d.x) ]) // 根據 x 的值設定範圍
    .range([0, width]);

  // Y 軸的比例尺
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(finalData, (d) => +d.y) ]) // 根據 y 的值設定範圍
    .range([height, 0]);

  // 創建 SVG 元素
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 20);

  // 在 SVG 中添加一個包含所有內容的 g 元素
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // 定義半徑的比例尺
  const radiusScale = d3
    .scaleLinear()
    .domain([1, 10, 20, 30, 40, 50, 51]) // 根據 count 的區間設定
    .range([2, 4, 6, 8, 10, 12, 14]); // 對應的半徑值

  // 繪製點
g.selectAll("circle")
  .data(finalData)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(+d.x))
  .attr("cy", (d) => yScale(+d.y))
  .attr("r", (d) => radiusScale(d.count))
  .attr("fill", "#E98B2A")
  .on("mouseover", (event, d) => { // 添加滑鼠移入事件
    const tooltip = d3.select("#tooltip")
      .style("display", "block")
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 25) + "px");

    tooltip.html(`X: ${d.x}<br>Y: ${d.y}<br>Count: ${d.count}`); // 在 tooltip 中顯示更多資訊
  })
  .on("mouseout", () => { // 添加滑鼠移出事件
    d3.select("#tooltip").style("display", "none");
  })
  .append("title")
  .text((d) => `Count: ${d.count}`);

// 創建 tooltip 元素
const tooltipDiv = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("display", "none")
  .style("position", "absolute")
  .style("background-color", "white")
  .style("padding", "5px")
  .style("border", "1px solid #ddd")
  .style("border-radius", "3px")
  .style("pointer-events", "none"); // 避免 tooltip 影響滑鼠事件


  // X 軸
  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(5)); // 設定刻度數量

  // X 軸標籤
  g.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .style("text-anchor", "middle")
    .text("從1到5級距，您認為藝術產業的碳排放量在那個相對位置？");

  // Y 軸
  g.append("g").call(d3.axisLeft(yScale).ticks(5)); // 設定刻度數量

  // Y 軸標籤
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("您認為藝術跟台灣 2050 淨零排放政策的相關度為何？");

  // 顯示 SVG
  return svg.node();
}


function _12(md){return(
md`<h2>結論</h2>
<h3>從上圖中，我們可以看出：
  <ul>
    <li>大多數人都覺得藝術產業跟政策並沒有太大的關聯性</li>
    <li>大多數人都認為藝術產業排放量高且跟政策無關，覺得跟政策相關的人也認為排放量低，我覺得了解政策的人也相對了解真正的碳排放量。</li>
  </ul>
</h3>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artist-1.csv", {url: new URL("./files/50c5f49fe0be94803e1d055aaca895517461971b40fc91cc553044dee88321c73843858f823684904e961847c7cc5d3bb60f8ecd7cdfde293dd65a61d08e1e2d.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artist")).define("artist", ["FileAttachment"], _artist);
  main.variable(observer("ARTIST")).define("ARTIST", ["__query","artist","invalidation"], _ARTIST);
  main.variable(observer("C1key")).define("C1key", ["artist"], _C1key);
  main.variable(observer("C2key")).define("C2key", ["artist"], _C2key);
  main.variable(observer("C1")).define("C1", ["artist","C1key"], _C1);
  main.variable(observer("C2")).define("C2", ["artist","C2key"], _C2);
  main.variable(observer("scatterplotData")).define("scatterplotData", ["C1","C2"], _scatterplotData);
  main.variable(observer("scatterplotData_counts")).define("scatterplotData_counts", ["scatterplotData"], _scatterplotData_counts);
  main.variable(observer("finalData")).define("finalData", ["scatterplotData_counts"], _finalData);
  main.variable(observer("createSVG")).define("createSVG", ["d3","finalData"], _createSVG);
  main.variable(observer()).define(["md"], _12);
  return main;
}
