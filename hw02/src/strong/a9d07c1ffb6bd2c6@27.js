function _1(md){return(
md`# HW2 Strong baseline`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _constellationChinese(){return(
["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"]
)}

function _barChartData(createBarData){return(
createBarData()
)}

function _histogramTipsOrder(createHistogramOrder){return(
createHistogramOrder()
)}

function _createBarData(constellationChinese,data){return(
function createBarData() {
  var array = [];
  for (var i = 0; i < constellationChinese.length; i++) {
    array.push({constellation: constellationChinese[i], gender: "male", count: 0});
    array.push({constellation: constellationChinese[i], gender: "female", count: 0});
  }
  data.forEach(item => {
    var categoryIndex = item.Constellation*2 + (item.Gender == "男" ? 0 : 1);
    array[categoryIndex].count++;
  });
  return array;
}
)}

function _createHistogramOrder(barChartData,constellationChinese){return(
function createHistogramOrder() {
  var orderObject = {constellation:[], gender:[]};
  var i = 1;
  while(i !== barChartData.length) {
    var barChartItem = barChartData[i];
    if (barChartItem.count !== 0) {
      var convertedIndex = Math.floor(i/2);
      orderObject.constellation.push(constellationChinese[convertedIndex]);
      orderObject.gender.push(`${barChartItem.gender == "female" ? "女" : "男"} (${barChartItem.count})`);
    }
    i += 2;
    if (i > barChartData.length) {
      i = 0;
    }
  }
  return orderObject;
}
)}

function _8(Plot,constellationChinese,data,histogramTipsOrder){return(
Plot.plot({
  x: { 
    grid: true,
    tickSpacing: 35,
    tickFormat: (d) => constellationChinese[d]
  },
  y: {
    grid: true,
    label: "Count"
  },
  marks: [
    Plot.rectY(data, Plot.binX(
      { 
        y: "count" 
      }, 
      {
        x: "Constellation", 
        interval: 1, 
        fill: "Gender",
        channels: {
          constellation: {
            value: histogramTipsOrder.constellation,
            label: "Constellation"
          },
          gender: {
            value: histogramTipsOrder.gender,
            label: "gender"
          }
        },
        tip: {
          format: {
            y: false,
            x: false,
            fill: false
          }
        }
      }
    ))
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("./files/2259824662fb612853b8873b8814ace51e8cbac39ba881850d66e26df63f1897b01d1bd3459af6529669fd912da9dd607a30666a93278d7fdfa10bbe22b8913d.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("constellationChinese")).define("constellationChinese", _constellationChinese);
  main.variable(observer("barChartData")).define("barChartData", ["createBarData"], _barChartData);
  main.variable(observer("histogramTipsOrder")).define("histogramTipsOrder", ["createHistogramOrder"], _histogramTipsOrder);
  main.variable(observer("createBarData")).define("createBarData", ["constellationChinese","data"], _createBarData);
  main.variable(observer("createHistogramOrder")).define("createHistogramOrder", ["barChartData","constellationChinese"], _createHistogramOrder);
  main.variable(observer()).define(["Plot","constellationChinese","data","histogramTipsOrder"], _8);
  return main;
}
