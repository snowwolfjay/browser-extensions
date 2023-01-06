var data = [];
var header = document.querySelector(".page-block-header .ace-line").innerHTML;
var box;
var sync = (ev) => {
  var el = document.querySelector(".render-unit-wrapper");
  if (!el) {
    return;
  }
  el.querySelectorAll(".block:not(.isEmpty)").forEach((el) => {
    const img = el.querySelector("img");
    let d;
    if (img) {
      d = {
        kind: "img",
        data: img.src,
        el: img,
      };
    } else {
      d = {
        kind: "html",
        data: el.querySelector(".ace-line").innerHTML,
      };
    }
    if (!d) {
      return;
    }
    const oi = data.findIndex((e) => e.kind === d.kind && e.data === d.data);
    if (oi === -1) {
      data.push(d);
    }
  });
};

const btn = document.createElement("button");
const btn2 = document.createElement("button");

btn.innerHTML = "下载";
btn2.innerHTML = "扫描";

btn.setAttribute(
  "style",
  "position:fixed;z-index:11111;right:20px;bottom:20px;padding:8px;font-size:14px;background-color: red;color:white;border-radius:8px;display:none;"
);
btn2.setAttribute(
  "style",
  "position:fixed;z-index:11111;right:20px;bottom:80px;padding:8px;font-size:14px;background-color: royalblue;color:white;border-radius:8px;"
);

document.body.appendChild(btn);
document.body.appendChild(btn2);
let durl;
btn.onclick = async () => {
  if (durl) {
    URL.revokeObjectURL(durl);
  }
  console.log(data);
  if (data.length === 0) {
    return;
  }
  let str = "";
  data.forEach((d) => {
    if (d.kind === "tag") {
      str += `<${d.tag}>${d.data}</${d.tag}>`;
    } else if (d.kind === "html") {
      str += `<p>${d.data}</p>`;
    } else if (d.kind === "img") {
      const cvs = document.createElement("canvas");
      const ctx = cvs.getContext("2d");
      cvs.width = d.el.width;
      cvs.height = d.el.height;
      ctx.drawImage(d.el, 0, 0);
      const src = cvs.toDataURL();
      str += `<br> <img style="max-width:100vw" src=${src}></br>`;
    }
  });
  console.log(data)
  const fsrc = `<html><head>
  <meta charset="utf-8" />
  <title>FeiQiuDoc</title>
</head><body>${str}</body></html>`;
  const blob = new Blob([fsrc], { type: "text/html" });
  durl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `doc_${Date.now()}.html`;
  a.href = durl;
  a.click();
};

let t;

btn2.onclick = async () => {
  if (t) {
    clearInterval(t);
  }
  initBox();
  const height = box.children[0].offsetHeight;
  if (!height) {
    return alert("内容区域还未就绪，稍后再试");
  }
  data.splice(0);
  data.push({ kind: "tag", tag: "h1", data: header });
  scrollCheck(height);
};
const initBox = () => {
  if (!box) {
    box = document.querySelector(".bear-web-x-container");
    box.onscroll = sync;
  }
};
const scrollCheck = (height) => {
  btn2.disabled = true;
  let i = 0;
  t = setInterval(() => {
    if (i < height) {
      i += 100;
      box.scrollTo({
        top: i,
        behavior: "smooth",
      });
    } else {
      clearInterval(t);
      t = null;
      btn.style.display = "block";
      btn2.disabled = false;
    }
  }, 200);
};
