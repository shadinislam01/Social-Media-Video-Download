async function downloadVideo(){

const url = document.getElementById("url").value;
const loader = document.getElementById("loader");
const result = document.getElementById("result");

if(url === ""){
alert("Paste Video URL");
return;
}

loader.style.display = "block";
result.innerHTML = "";

const response = await fetch("/download", {

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
url
})

});

const data = await response.json();

loader.style.display = "none";

if(data.success){

document.getElementById("videoSource").src = data.file;

document.getElementById("preview").load();

document.getElementById("downloadBtn").href = data.file;

result.innerHTML = `
<h3>
Download Ready
</h3>
`;

loadHistory();

}else{

result.innerHTML = "Download Failed";

}

}

async function loadHistory(){

const response = await fetch("/history");
const data = await response.json();

const history = document.getElementById("history");

history.innerHTML = "";

data.forEach(item => {

history.innerHTML += `

<div class="history-item">

<p>${item.url}</p>

<br>

<a href="${item.file}" download>
Download Again
</a>

</div>

`;

});

}

loadHistory();