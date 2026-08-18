const NS="http://www.w3.org/2000/svg";
const COLORS={1:"#4e79a7",2:"#f28e2b",3:"#59a14f",4:"#9c6bb0",5:"#d0494b"};

function el(name,attrs){const e=document.createElementNS(NS,name);
  for(const k in attrs)e.setAttribute(k,attrs[k]);return e;}

function renderGrid(svgId,cfg){
  const svg=document.getElementById(svgId);
  const W=44,H=40,GAP=5,GUT=66,TOP=30;
  const cols=cfg.steps, rows=cfg.rows.length;
  const width=GUT+cols*(W+GAP)+12;
  const dividerLabelH=cfg.divider?22:6;
  const height=TOP+rows*(H+GAP)+dividerLabelH;
  svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
  svg.setAttribute("width",width);

  for(let s=0;s<cols;s++){
    const t=el("text",{x:GUT+s*(W+GAP)+W/2,y:TOP-11,class:"stepnum"});
    t.textContent=s+1; svg.appendChild(t);
  }
  cfg.rows.forEach((row,r)=>{
    const ly=TOP+r*(H+GAP);
    const lbl=el("text",{x:6,y:ly+H/2+4,class:"lanelbl"});
    lbl.textContent=row.label; svg.appendChild(lbl);
    row.cells.forEach((c,s)=>{
      const x=GUT+s*(W+GAP);
      if(c===null){
        svg.appendChild(el("rect",{x,y:ly,width:W,height:H,rx:5,
          fill:"none",stroke:"var(--none)","stroke-width":1.5,"stroke-dasharray":"4 3"}));
        return;
      }
      if(c==="idle"){
        svg.appendChild(el("rect",{x,y:ly,width:W,height:H,rx:5,
          fill:"var(--idle)",stroke:"#c3c0b8","stroke-width":1}));
        const t=el("text",{x:x+W/2,y:ly+H/2+4,class:"cell-lbl idle"});
        t.textContent="idle"; svg.appendChild(t);
        return;
      }
      svg.appendChild(el("rect",{x,y:ly,width:W,height:H,rx:5,fill:COLORS[c]}));
      const t=el("text",{x:x+W/2,y:ly+H/2+5,class:"cell-lbl"});
      t.textContent="R"+c; svg.appendChild(t);
    });
  });
  if(cfg.divider){
    const dx=GUT+cfg.divider*(W+GAP)-GAP/2;
    svg.appendChild(el("line",{x1:dx,y1:TOP-6,x2:dx,y2:TOP+rows*(H+GAP),class:"divider"}));
    const t=el("text",{x:dx,y:TOP+rows*(H+GAP)+15,class:"dlabel"});
    t.textContent="◀ wave barrier ▶"; svg.appendChild(t);
  }
}

renderGrid("static",{
  steps:10, divider:6,
  rows:[
    {label:"lane A", cells:[1,1,"idle","idle","idle","idle",4,4,4,4]},
    {label:"lane B", cells:[2,2,2,2,2,2,5,5,"idle","idle"]},
    {label:"lane C", cells:[3,3,3,"idle","idle","idle",null,null,null,null]},
  ],
});

renderGrid("cont",{
  steps:6,
  rows:[
    {label:"lane A", cells:[1,1,4,4,4,4]},
    {label:"lane B", cells:[2,2,2,2,2,2]},
    {label:"lane C", cells:[3,3,3,5,5,null]},
  ],
});

// --- policy/mechanism sandwich ---
(function(){
  const svg=document.getElementById("arch");
  const w=620,h=210; svg.setAttribute("viewBox",`0 0 ${w} ${h}`); svg.setAttribute("width",w);
  function band(x,y,bw,bh,fill,stroke){return el("rect",{x,y,width:bw,height:bh,rx:9,fill,stroke,"stroke-width":1.5});}
  function txt(x,y,s,cls,size,fill){const t=el("text",{x,y,"text-anchor":"middle",
    "font-family":"var(--mono)","font-size":size||13,fill:fill||"#1c1c1e"});
    if(cls)t.setAttribute("font-weight",600);t.textContent=s;return t;}
  // policy band (violet)
  svg.appendChild(band(20,18,w-40,74,"#f0edfb","#6e57e0"));
  svg.appendChild(txt(w/2,40,"Scheduler  (policy — the part you write)",1,14,"#6e57e0"));
  ["1. admit waiting","2. decode batch","3. evict finished"].forEach((s,i)=>{
    const bx=40+i*((w-80)/3), bw=(w-80)/3-10;
    svg.appendChild(el("rect",{x:bx,y:54,width:bw,height:28,rx:6,fill:"#fff",stroke:"#b9a9f0"}));
    svg.appendChild(txt(bx+bw/2,72,s,0,11,"#33332f"));
  });
  // arrow
  svg.appendChild(el("line",{x1:w/2,y1:96,x2:w/2,y2:120,stroke:"#6b6b70","stroke-width":1.6,"marker-end":"url(#ar)"}));
  const defs=el("defs",{}); const m=el("marker",{id:"ar",markerWidth:8,markerHeight:8,refX:6,refY:3,orient:"auto"});
  m.appendChild(el("path",{d:"M0,0 L6,3 L0,6 Z",fill:"#6b6b70"})); defs.appendChild(m); svg.appendChild(defs);
  svg.appendChild(txt(w/2+92,113,"calls _decode(batch)",0,10.5,"#6b6b70"));
  // mechanism band
  svg.appendChild(band(20,124,w-40,68,"#1c1c1e","#1c1c1e"));
  svg.appendChild(txt(w/2,148,"Model execution  (mechanism — oblivious to which requests)",1,13,"#eaeaea"));
  svg.appendChild(txt(w/2,172,"forward pass · TOY: recompute  ·  vLLM: PagedAttention KV cache",0,11.5,"#d0494b"));
})();
