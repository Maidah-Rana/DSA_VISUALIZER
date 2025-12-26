/* ===================== DOM ===================== */
const algorithmList = document.getElementById("algorithmList");
const arraySizeInput = document.getElementById("arraySize");
const speedInput = document.getElementById("speed");

const algoTitle = document.getElementById("algoTitle");
const descriptionEl = document.getElementById("description");
const timeEl = document.getElementById("time");
const spaceEl = document.getElementById("space");
const algoEl = document.getElementById("algo");

const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");

const barsContainer = document.getElementById("barsContainer");
const treeCanvas = document.getElementById("treeCanvas");
const graphCanvas = document.getElementById("graphCanvas");

/* ===================== STATE ===================== */
let currentAlgo = null;
let array = [], initialArray = [];
let speed = 100, comparisons = 0, swaps = 0;
let stopFlag = false;

/* ===================== ALGORITHMS ===================== */
const algorithms = {
  sorting: [
    {
        name: "Bubble Sort",
        id: "bubble",
        desc: "Bubble Sort repeatedly swaps adjacent elements if they are in wrong order.",
        time: "O(n^2)",
        space: "O(1)",
        algo: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the list is sorted."
    },
    {
        name: "Selection Sort",
        id: "selection",
        desc: "Selection Sort repeatedly selects the minimum element and moves it to the beginning.",
        time: "O(n^2)",
        space: "O(1)",
        algo: "Finds the minimum element from the unsorted part of the array and swaps it with the first unsorted element. Repeats this process, moving the boundary of the sorted array forward each time."
    },
    {
        name: "Insertion Sort",
        id: "insertion",
        desc: "Insertion Sort builds the sorted array one element at a time.",
        time: "O(n^2)",
        space: "O(1)",
        algo: "Takes elements one by one and inserts them into the correct position in the already sorted part of the array, shifting larger elements to the right."
    },
    {
        name: "Merge Sort",
        id: "merge",
        desc: "Merge Sort divides the array into halves, sorts them, and merges back.",
        time: "O(n log n)",
        space: "O(n)",
        algo: "Divides the array into two halves, recursively sorts each half, and then merges the sorted halves back together."
    },
    {
        name: "Quick Sort",
        id: "quick",
        desc: "Quick Sort picks a pivot and partitions the array around it.",
        time: "O(n log n)",
        space: "O(log n)",
        algo: "Selects a pivot element, partitions the array so that elements smaller than the pivot are on the left and larger are on the right, then recursively sorts the subarrays."
    },
    {
        name: "Heap Sort",
        id: "heap",
        desc: "Heap Sort converts the array into a heap and repeatedly extracts the max/min.",
        time: "O(n log n)",
        space: "O(1)",
        algo: "Builds a max-heap from the array, repeatedly swaps the first element with the last unsorted element, reduces the heap size, and heapifies the root to maintain the heap property."
    }
],

searching: [
    {
        name: "Linear Search",
        id: "linear",
        desc: "Linear Search checks each element sequentially until target is found.",
        time: "O(n)",
        space: "O(1)",
        algo: "Checks each element of the array one by one until the target element is found or the end of the array is reached."
    },
    {
        name: "Binary Search",
        id: "binary",
        desc: "Binary Search repeatedly divides sorted array to find the target.",
        time: "O(log n)",
        space: "O(1)",
        algo: "Divides the sorted array in half repeatedly, comparing the target with the middle element to eliminate half of the search space each time."
    }
],

tree: [
    {
        name: "Preorder",
        id: "preorder",
        desc: "Root-Left-Right traversal of a binary tree.",
        time: "O(n)",
        space: "O(h)",
        algo: "Visits the root node first, then recursively traverses the left subtree, followed by the right subtree."
    },
    {
        name: "Inorder",
        id: "inorder",
        desc: "Left-Root-Right traversal of a binary tree.",
        time: "O(n)",
        space: "O(h)",
        algo: "Recursively traverses the left subtree, visits the root node, then traverses the right subtree. Produces sorted order for BSTs."
    },
    {
        name: "Postorder",
        id: "postorder",
        desc: "Left-Right-Root traversal of a binary tree.",
        time: "O(n)",
        space: "O(h)",
        algo: "Recursively traverses the left subtree, then the right subtree, and finally visits the root node."
    },
    {
        name: "Level Order",
        id: "levelorder",
        desc: "Traverses tree level by level from top to bottom.",
        time: "O(n)",
        space: "O(n)",
        algo: "Uses a queue to traverse the tree level by level, visiting all nodes of each level before moving to the next."
    }
],

graph: [
    {
        name: "BFS",
        id: "bfs",
        desc: "Breadth First Search visits nodes level by level.",
        time: "O(V+E)",
        space: "O(V)",
        algo: "Starts from a source node and explores all its neighbors first before moving to the next level neighbors, typically implemented using a queue."
    },
    {
        name: "DFS",
        id: "dfs",
        desc: "Depth First Search visits nodes using recursion/stack.",
        time: "O(V+E)",
        space: "O(V)",
        algo: "Starts from a source node and explores as far as possible along each branch before backtracking, typically implemented using recursion or a stack."
    }
]

};

/* ===================== VISUALIZER SWITCH ===================== */
function switchVisualizer(category) {
  barsContainer.classList.add("hidden");
  treeCanvas.classList.add("hidden");
  graphCanvas.classList.add("hidden");

  if (category === "sorting" || category === "searching") {
    barsContainer.classList.remove("hidden");
  }
  if (category === "tree") {
    treeCanvas.classList.remove("hidden");
    renderTreeStatic();
  }
  if (category === "graph") {
    graphCanvas.classList.remove("hidden");
    renderGraphStatic();
  }
}

/* ===================== CATEGORY ===================== */
function loadCategory(category) {
  algorithmList.innerHTML = "";
  algorithms[category].forEach(algo => {
    const btn = document.createElement("button");
    btn.textContent = algo.name;
    btn.onclick = () => loadAlgorithm({ ...algo, category });
    algorithmList.appendChild(btn);
  });
}

/* ===================== LOAD ALGORITHM ===================== */
function loadAlgorithm(algo) {
  currentAlgo = algo;
  algoTitle.textContent = algo.name;
  descriptionEl.textContent = algo.desc;
  timeEl.textContent = algo.time;
  spaceEl.textContent = algo.space;
  algoEl.textContent = algo.algo;
  switchVisualizer(algo.category);
  if (algo.category === "sorting" || algo.category === "searching") generateArray();
}

/* ===================== ARRAY ===================== */
function generateArray() {
  stopFlag = true;
  const size = parseInt(arraySizeInput.value);
  array = Array.from({length:size}, ()=>Math.floor(Math.random()*100)+1);
  initialArray = [...array];
  renderArray(array);
  comparisons = swaps = 0;
  comparisonsEl.textContent = swapsEl.textContent = "0";
}

function renderArray(arr, comparing=[], swapping=[], sorted=[]) {
  barsContainer.innerHTML = "";
  const max = Math.max(...arr);
  arr.forEach((v,i)=>{
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = (v/max*100)+"%";
    bar.style.width = (100/arr.length)+"%";
    if(comparing.includes(i)) bar.style.backgroundColor="rgb(230, 184, 0)";
    if(swapping.includes(i)) bar.style.backgroundColor="rgb(230, 184, 0);";
    if(sorted.includes(i)) bar.style.backgroundColor="#00f1e5";
    barsContainer.appendChild(bar);
  });
}

/* ===================== TREE ===================== */
function renderTreeStatic() {
  barsContainer.classList.add("hidden"); // hide bars
  treeCanvas.innerHTML = "";
  const nodes = [
    { id: 1, x: 300, y: 40 },
    { id: 2, x: 180, y: 120 },
    { id: 3, x: 420, y: 120 },
    { id: 4, x: 120, y: 220 },
    { id: 5, x: 240, y: 220 },
    { id: 6, x: 360, y: 220 },
    { id: 7, x: 480, y: 220 }
  ];
  const edges = [[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]];

  edges.forEach(([a,b])=>{
    const from = nodes.find(n=>n.id===a);
    const to = nodes.find(n=>n.id===b);
    treeCanvas.innerHTML+=`<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#9ca3af"/>`;
  });
  nodes.forEach(n=>{
    treeCanvas.innerHTML+=`<circle cx="${n.x}" cy="${n.y}" r="18" fill="#6366f1"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle" fill="white">${n.id}</text>`;
  });
  return nodes;
}

/* ===================== GRAPH ===================== */
function renderGraphStatic() {
  barsContainer.classList.add("hidden"); // hide bars
  graphCanvas.innerHTML = "";
  const nodes = [
    { id: 1, x: 100, y: 100 },
    { id: 2, x: 300, y: 50 },
    { id: 3, x: 500, y: 100 },
    { id: 4, x: 200, y: 200 },
    { id: 5, x: 400, y: 200 }
  ];
  const edges = [[1,2],[1,4],[2,3],[4,5],[3,5]];
  edges.forEach(([a,b])=>{
    const from = nodes.find(n=>n.id===a);
    const to = nodes.find(n=>n.id===b);
    graphCanvas.innerHTML+=`<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#9ca3af"/>`;
  });
  nodes.forEach(n=>{
    graphCanvas.innerHTML+=`<circle cx="${n.x}" cy="${n.y}" r="18" fill="#34d399"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle" fill="white">${n.id}</text>`;
  });
  return nodes;
}

/* ===================== START ALGORITHM ===================== */
async function startAlgorithm() {
  if(!currentAlgo) return;
  stopFlag=false;

  // Searching
  if(currentAlgo.category==="searching"){
    let target = prompt("Enter the number to search:");
    if(target===null) return;
    target = parseInt(target);
    if(currentAlgo.id==="linear") await linearSearch(target);
    if(currentAlgo.id==="binary") await binarySearch(target);
    return;
  }

  // Sorting
  if(currentAlgo.category==="sorting") {
    switch(currentAlgo.id){
      case "bubble": await bubbleSort(); break;
      case "selection": await selectionSort(); break;
      case "insertion": await insertionSort(); break;
      case "merge": await mergeSort(); break;
      case "quick": await quickSort(); break;
      case "heap": await heapSort(); break;
    }
  }

  // Tree traversal
  if(currentAlgo.category==="tree"){
    const nodes = renderTreeStatic();
    if(currentAlgo.id==="preorder") await treeTraversal(nodes, "preorder");
    if(currentAlgo.id==="inorder") await treeTraversal(nodes, "inorder");
    if(currentAlgo.id==="postorder") await treeTraversal(nodes, "postorder");
    if(currentAlgo.id==="levelorder") await treeTraversal(nodes, "levelorder");
  }

  // Graph traversal
  if(currentAlgo.category==="graph"){
    const nodes = renderGraphStatic();
    if(currentAlgo.id==="bfs") await graphTraversal(nodes, "bfs");
    if(currentAlgo.id==="dfs") await graphTraversal(nodes, "dfs");
  }
}

/* ===================== TREE TRAVERSAL ===================== */
async function treeTraversal(nodes, type) {
  let result = [];
  const tree = {
    1:{left:2,right:3},2:{left:4,right:5},3:{left:6,right:7},4:{},5:{},6:{},7:{}
  };

  function preorder(id){ if(id){ result.push(id); preorder(tree[id].left); preorder(tree[id].right); } }
  function inorder(id){ if(id){ inorder(tree[id].left); result.push(id); inorder(tree[id].right); } }
  function postorder(id){ if(id){ postorder(tree[id].left); postorder(tree[id].right); result.push(id); } }
  function levelorder(){ 
    let q=[1];
    while(q.length){ let n=q.shift(); result.push(n); if(tree[n].left) q.push(tree[n].left); if(tree[n].right) q.push(tree[n].right); } 
  }

  if(type==="preorder") preorder(1);
  if(type==="inorder") inorder(1);
  if(type==="postorder") postorder(1);
  if(type==="levelorder") levelorder();

  for(let id of result){
    if(stopFlag) return;
    nodes.forEach(n=>{
      const circle = treeCanvas.querySelector(`circle:nth-of-type(${n.id})`);
      if(n.id===id) circle.setAttribute("fill","#facc15"); // yellow for visited
      else circle.setAttribute("fill","#6366f1");
    });
    await sleep(speed*2);
  }
}

/* ===================== GRAPH TRAVERSAL ===================== */
async function graphTraversal(nodes, type){
  const adj = {1:[2,4],2:[1,3],3:[2,5],4:[1,5],5:[3,4]};
  let visited = new Set();
  let queue = [];

  if(type==="bfs") queue.push(1);
  function dfs(id){
    if(stopFlag) return;
    visited.add(id);
    nodes.forEach(n=>{
      const circle = graphCanvas.querySelector(`circle:nth-of-type(${n.id})`);
      if(visited.has(n.id)) circle.setAttribute("fill","#facc15"); // yellow
      else circle.setAttribute("fill","#34d399");
    });
    for(let nb of adj[id]) if(!visited.has(nb)) dfs(nb);
  }

  while(queue.length){
    if(stopFlag) return;
    let node = queue.shift();
    if(!visited.has(node)){
      visited.add(node);
      nodes.forEach(n=>{
        const circle = graphCanvas.querySelector(`circle:nth-of-type(${n.id})`);
        if(visited.has(n.id)) circle.setAttribute("fill","#facc15");
        else circle.setAttribute("fill","#34d399");
      });
      await sleep(speed*2);
      for(let nb of adj[node]) if(!visited.has(nb)) queue.push(nb);
    }
  }

  if(type==="dfs") dfs(1);
}


/* ===================== SEARCHING ===================== */
async function linearSearch(target){
  let a = [...array];
  for(let i=0;i<a.length;i++){
    if(stopFlag) return;
    renderArray(a,[i]);
    comparisons++; comparisonsEl.textContent=comparisons;
    await sleep(speed);
    if(a[i]===target){
      renderArray(a,[],[],[i]);
      alert(`Found ${target} at index ${i}`);
      return;
    }
  }
  alert(`${target} not found`);
}

async function binarySearch(target){
  let a = [...array].sort((x,y)=>x-y);
  let l=0, r=a.length-1;
  renderArray(a);
  while(l<=r){
    if(stopFlag) return;
    let mid = Math.floor((l+r)/2);
    renderArray(a,[mid]);
    comparisons++; comparisonsEl.textContent=comparisons;
    await sleep(speed);
    if(a[mid]===target){ renderArray(a,[],[],[mid]); alert(`Found ${target} at index ${mid}`); return; }
    else if(a[mid]<target) l=mid+1;
    else r=mid-1;
  }
  alert(`${target} not found`);
}
async function bubbleSort() {
  let a = [...array];
  for(let i=0;i<a.length;i++){
    if(stopFlag) return;
    for(let j=0;j<a.length-i-1;j++){
      if(stopFlag) return;
      renderArray(a,[j,j+1]);
      await sleep(speed);
      comparisons++; comparisonsEl.textContent=comparisons;
      if(a[j]>a[j+1]){
        [a[j],a[j+1]]=[a[j+1],a[j]];
        swaps++; swapsEl.textContent=swaps;
        renderArray(a,[],[j,j+1]);
        await sleep(speed);
      }
    }
  }
  array = [...a];
  renderArray(a,[],[],[...Array(a.length).keys()]);
}

async function selectionSort() {
  let a = [...array];
  for(let i=0;i<a.length;i++){
    if(stopFlag) return;
    let min = i;
    for(let j=i+1;j<a.length;j++){
      if(stopFlag) return;
      renderArray(a,[min,j]);
      await sleep(speed);
      comparisons++; comparisonsEl.textContent=comparisons;
      if(a[j]<a[min]) min=j;
    }
    if(min!==i){
      [a[i],a[min]]=[a[min],a[i]];
      swaps++; swapsEl.textContent=swaps;
      renderArray(a,[],[i,min]);
      await sleep(speed);
    }
  }
  array = [...a];
  renderArray(a,[],[],[...Array(a.length).keys()]);
}

async function insertionSort() {
  let a = [...array];
  for(let i=1;i<a.length;i++){
    if(stopFlag) return;
    let key = a[i], j=i-1;
    while(j>=0 && a[j]>key){
      if(stopFlag) return;
      a[j+1]=a[j];
      renderArray(a,[j,j+1]);
      await sleep(speed);
      comparisons++; comparisonsEl.textContent=comparisons;
      swaps++; swapsEl.textContent=swaps;
      j--;
    }
    a[j+1]=key;
    renderArray(a);
    await sleep(speed);
  }
  array = [...a];
  renderArray(a,[],[],[...Array(a.length).keys()]);
}

async function mergeSort() {
  let a = [...array];
  await mergeSortUtil(a,0,a.length-1);
  array = [...a];
  renderArray(a,[],[],[...Array(a.length).keys()]);
}

async function mergeSortUtil(a,l,r){
  if(stopFlag) return;
  if(l>=r) return;
  const m = Math.floor((l+r)/2);
  await mergeSortUtil(a,l,m);
  await mergeSortUtil(a,m+1,r);
  await merge(a,l,m,r);
}

async function merge(a,l,m,r){
  if(stopFlag) return;
  const left = a.slice(l,m+1);
  const right = a.slice(m+1,r+1);
  let i=0,j=0,k=l;
  while(i<left.length && j<right.length){
    if(stopFlag) return;
    renderArray(a,[k]);
    await sleep(speed);
    comparisons++; comparisonsEl.textContent=comparisons;
    if(left[i]<=right[j]) a[k++]=left[i++];
    else a[k++]=right[j++];
    swaps++; swapsEl.textContent=swaps;
  }
  while(i<left.length){ if(stopFlag) return; a[k++]=left[i++]; renderArray(a,[k-1]); await sleep(speed); swaps++; swapsEl.textContent=swaps; }
  while(j<right.length){ if(stopFlag) return; a[k++]=right[j++]; renderArray(a,[k-1]); await sleep(speed); swaps++; swapsEl.textContent=swaps; }
}

async function quickSort(){
  let a=[...array];
  await quickSortUtil(a,0,a.length-1);
  array=[...a];
  renderArray(a,[],[],[...Array(a.length).keys()]);
}

async function quickSortUtil(a,low,high){
  if(stopFlag) return;
  if(low<high){
    let p = await partition(a,low,high);
    await quickSortUtil(a,low,p-1);
    await quickSortUtil(a,p+1,high);
  }
}

async function partition(a,low,high){
  if(stopFlag) return;
  let pivot=a[high], i=low-1;
  for(let j=low;j<high;j++){
    if(stopFlag) return;
    renderArray(a,[j,high]);
    await sleep(speed);
    comparisons++; comparisonsEl.textContent=comparisons;
    if(a[j]<pivot){
      i++;
      [a[i],a[j]]=[a[j],a[i]];
      swaps++; swapsEl.textContent=swaps;
      renderArray(a,[],[i,j]);
      await sleep(speed);
    }
  }
  [a[i+1],a[high]]=[a[high],a[i+1]];
  swaps++; swapsEl.textContent=swaps;
  renderArray(a,[],[i+1,high]);
  await sleep(speed);
  return i+1;
}

async function heapSort(){
  let a=[...array], n=a.length;
  for(let i=Math.floor(n/2)-1;i>=0;i--){ if(stopFlag) return; await heapify(a,n,i);}
  for(let i=n-1;i>0;i--){
    if(stopFlag) return;
    [a[0],a[i]]=[a[i],a[0]];
    swaps++; swapsEl.textContent=swaps;
    renderArray(a,[],[0,i]);
    await sleep(speed);
    await heapify(a,i,0);
  }
  array=[...a];
  renderArray(a,[],[],[...Array(a.length).keys()]);
}

async function heapify(a,n,i){
  if(stopFlag) return;
  let largest=i,l=2*i+1,r=2*i+2;
  if(l<n && a[l]>a[largest]) largest=l;
  if(r<n && a[r]>a[largest]) largest=r;
  if(largest!==i){
    [a[i],a[largest]]=[a[largest],a[i]];
    swaps++; swapsEl.textContent=swaps;
    renderArray(a,[],[i,largest]);
    await sleep(speed);
    await heapify(a,n,largest);
  }
}

/* ===================== STOP/RESET ===================== */
function stopAlgorithm(){ stopFlag=true; }
function resetAlgorithm(){ stopFlag=true; array=[...initialArray]; renderArray(array); comparisons=swaps=0; comparisonsEl.textContent=swapsEl.textContent="0"; }

/* ===================== SLIDERS ===================== */
function updateArraySize(){ document.getElementById("arraySizeLabel").textContent=arraySizeInput.value; generateArray(); }
function updateSpeed(){ speed=105-parseInt(speedInput.value); document.getElementById("speedLabel").textContent=speedInput.value+"%"; }

/* ===================== HELPER ===================== */
function sleep(ms){ return new Promise(resolve=>setTimeout(resolve, ms)); }

generateArray();
