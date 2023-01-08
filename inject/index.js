var data = [];
var header = document.querySelector(".page-block-header .ace-line").innerHTML;
var box;
const sleep = (ms) => new Promise(res => setTimeout(() => {
  res()
}, ms))
var sync = async () => {
  const root = box.querySelector(".page-block-children")
  for (const zone of root.querySelectorAll(".render-unit-wrapper>.block:not(.isEmpty)")) {
    for (const el of zone.querySelectorAll(".ace-line,img")) {
      let d;
      if (el instanceof HTMLImageElement) {
        d = {
          kind: "img",
          data: el.src,
          el: el,
          width: el.clientWidth,
          height: el.clientHeight
        };
      } else {
        d = {
          kind: "html",
          data: el.innerHTML,
        };
      }
      if (!d) {
        return;
      }
      const oi = data.findIndex((e) => e.kind === d.kind && e.data === d.data);
      if (oi === -1) {
        data.push(d);
      }
    }
  }
};

const btn = document.createElement("button");
const btn2 = document.createElement("button");
const btn3 = document.createElement("button");

btn.innerHTML = "下载";
btn2.innerHTML = "扫描";
btn3.innerHTML = "下载";

btn.setAttribute(
  "style",
  "position:fixed;z-index:11111;right:20px;bottom:20px;padding:8px;font-size:14px;background-color: red;color:white;border-radius:8px;display:none;"
);
btn2.setAttribute(
  "style",
  "position:fixed;z-index:11111;right:20px;bottom:80px;padding:8px;font-size:14px;background-color: royalblue;color:white;border-radius:8px;"
);
btn3.setAttribute(
  "style",
  "position:fixed;z-index:11111;right:20px;bottom:80px;padding:8px;font-size:14px;background-color: royalblue;color:white;border-radius:8px;"
);
const view = document.createElement("div");
view.setAttribute(
  "style",
  "position:fixed;z-index:11111;right:0;bottom:0;top:0;left:0;background:white;overflow-y:auth;display:none;"
);

document.body.appendChild(btn);
document.body.appendChild(btn2);
// document.body.appendChild(view);
let durl;
let isrc;
btn.onclick = async () => {
  if (durl) {
    URL.revokeObjectURL(durl);
  }
  if (data.length === 0) {
    return;
  }
  let str = "";
  btn.innerText = `共计${data.length}行数据待处理，请稍后`
  await sleep(10)
  for (const d of data) {
    if (d.kind === "tag") {
      str += `<${d.tag}>${d.data}</${d.tag}>`;
    } else if (d.kind === "html") {
      str += `<p>${d.data}</p>`;
    } else if (d.kind === "img") {
      const cvs = document.createElement("canvas");
      const ctx = cvs.getContext("2d");
      const w = cvs.width = d.el.width;
      const h = cvs.height = d.el.height;
      ctx.drawImage(d.el, 0, 0, w, h);
      const src = cvs.toDataURL("image/jpeg",0.8);
      str += `<br> <img style="max-width:100vw" src=${src}><br><a target=_blank src="${d.data}"><br> `;
    }
  }
  btn.innerText = "数据生成结束，准备下载"
  isrc = str;
  // view.innerHTML = str;
  // view.style.display = "block";
  // view.appendChild(btn3)
  download()
};

const download = () => {
  const fsrc = `<html><head>
  <meta charset="utf-8" />
  <title>FeiQiuDoc</title>
</head><body>${isrc}</body></html>`;
  const blob = new Blob([fsrc], { type: "text/html" });
  durl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `doc_${Date.now()}.html`;
  a.href = durl;
  a.click();
}
btn3.onclick = () => {
  download()
}
let t;

btn2.onclick = async () => {
  if (t) {
    clearTimeout(t);
  }
  initBox();
  box.scrollTop = 0;
  const height = box.children[0].offsetHeight;
  if (!height) {
    return alert("内容区域还未就绪，稍后再试");
  }
  data.splice(0);
  btn.innerText = "下载"
  btn2.disabled = true;
  btn2.innerText = `开始扫描(遇到卡顿，刷新页面即可)`
  data.push({ kind: "tag", tag: "h1", data: header });
  scrollCheck();
};
let sh = 100;
const initBox = () => {
  if (!box) {
    box = document.querySelector(".bear-web-x-container");
    sh = Math.floor(box.clientHeight / 2)
    // box.onscroll = sync;
  }
};
const scrollCheck = async (i = 0) => {
  const height = box.children[0].offsetHeight;
  box.scrollTo({
    top: i,
    behavior: "smooth",
  });
  await sync()
  i += sh;
  if (i < height) {
    btn2.innerText = `${Math.floor(i * 100 / height)}%已完成(遇到卡顿，刷新页面)`
    console.log(`checking ---`)
    t = setTimeout(() => {
      scrollCheck(i)
    }, 300);
  } else {
    console.log(`end check download`)
    t = null;
    btn.style.display = "block";
    btn2.disabled = false;
    btn2.innerText = "扫描完成，点击下方按钮下载，或重新扫描"
  }
};
