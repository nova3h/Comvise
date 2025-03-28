// Shorthands
var log = console.log;

// Global
var Global_Css = 
`* { box-sizing:border-box; }`;

var Html_File = null;
var Css_File  = null;
var Html      = "";
var Css       = "";

//
function new_ele(Tag) {
    return document.createElement(Tag);
}

// 
function attr(Ele,Name){
    return Ele.getAttribute(Name);
}

// Utils
function d$(Sel){
    return document.querySelector(Sel);
}

//
function get_editing_html(){
    return d$("#Html-Edit").value;
}

//
function get_editing_css(){
    return d$("#Css-Edit").value;
}

// Write to iframe
// Ref: https://stackoverflow.com/a/998241/5581893
function write_iframe(Html){
    var ifrm = document.getElementById('Visual-Frame');
    ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write(Html);
    ifrm.document.close();
}

//
function recurse_for_items(List,Ele,depth){
    List.push({
        Tag:Ele.tagName, Id:attr(Ele,"id"), Classes:attr(Ele,"class"),
        depth
    });

    for (let Child of Ele.children)
        recurse_for_items(List,Child,depth+1);
}

//
function add_struct_item(Box,Item){
    var Pad = "";

    for (let _ of Array(Item.depth)) 
        Pad+=`<span style="display:inline-block; width:1.5rem;">&nbsp;</span>`;

    var Html = 
    `${Pad}${Item.Tag} #${Item.Id} .${Item.Classes}`;

    var Ele = new_ele("div");
    Ele.innerHTML = Html;

    Box.appendChild(Ele);
}

//
function show_dom_struct() {
    var Frame     = d$("#Visual-Frame");
    var Html      = Frame.contentWindow.document.body.innerHTML;
    var Ele       = new_ele("div");
    Ele.innerHTML = Html;

    var Items = [];
    recurse_for_items(Items,Ele,0);
    var Box = d$("#Struct-Box");
    Box.innerHTML = "";
    
    for (let Item of Items)
        add_struct_item(Box,Item);
}

// Show visual
function show_visual(){
    d$("#Caption").innerHTML = "Rendered as:";
    d$("#Visual-Box").style.display = "block";
    d$("#Html-Box").style.display = "none";
    d$("#Css-Box").style.display = "none";

    // Show contents
    var C = get_editing_css();
    var H = get_editing_html();
    var Html = 
    `<iframe id="Visual-Frame" frameBorder="0"
        style="width:calc(50vw - 3rem); height:calc(100vh - 9.5rem);
        outline:none; overflow:auto; overflow-x:hidden;">
    </iframe>`;
    d$("#Visual-Box").innerHTML = Html;

    var Comhtml = 
    `<style>${Global_Css}</style>
    <style>${C}</style>
    <body style="margin:0; padding:0;">${H}</body>`;
    write_iframe(Comhtml);

    show_dom_struct();
}

// Show html
function show_html(){
    d$("#Caption").innerHTML = "Edit HTML:";
    d$("#Visual-Box").style.display = "none";
    d$("#Html-Box").style.display = "block";
    d$("#Css-Box").style.display = "none";
}

// Show css
function show_css(){
    d$("#Caption").innerHTML = "Edit CSS:";
    d$("#Visual-Box").style.display = "none";
    d$("#Html-Box").style.display = "none";
    d$("#Css-Box").style.display = "block";
}

//
function show_status(Str){
    d$("#Status").innerHTML = Str;
}

// Read file
// NOTE: CODE FROM COPILOT
async function read_file() {    
    // Open the file picker
    const [fileHandle] = await window.showOpenFilePicker();
    // Get the file
    const file = await fileHandle.getFile();
    // Read the file content as text
    const content = await file.text();
    return [fileHandle,content];    
}

// Write file
// NOTE: CODE FROM COPILOT
async function write_to_file(Handle,Text) {
    const writable = await Handle.createWritable();
    // Write data to the file
    await writable.write(Text);
    // Close the stream
    await writable.close();
}

// Load html
async function load_html(Ev){
    var [F,H] = await read_file();

    if (F.name.match(/\.html$/)==null){
        alert("Must be .html file");
        return;
    }
    Html_File = F;
    Html      = H.replace(/\t/g, "\x20\x20\x20\x20").replace(/\r\n/g, "\n");
    log("HTML loaded:",F);
    d$("#Html-Edit").value = H;
    show_status("Loaded HTML, length: "+H.length);
    show_html();
}

// Load css
async function load_css(Ev){
    var [F,C] = await read_file();

    if (F.name.match(/\.css/)==null){
        alert("Must be .css file");
        return;
    }
    Css_File  = F;
    Css       = C.replace(/\t/g, "\x20\x20\x20\x20").replace(/\r\n/g, "\n");
    log("CSS loaded:",F);
    d$("#Css-Edit").value = C;
    show_status("Loaded CSS, length: "+C.length);
    show_css();
}

//
async function load_global_css(Ev){
    alert("Global CSS: box-sizing:border-box");
}

// Save html
async function save_html(){
    if (Html_File==null){
        alert("HTML file not loaded yet");
        return;
    }
    Html_File.requestPermission({mode:"readwrite"});
    await write_to_file(Html_File,d$("#Html-Edit").value);
    show_status("HTML written to file");
}

// Save css
async function save_css(){
    if (Css_File==null){
        alert("CSS file not loaded yet");
        return;
    }
    Css_File.requestPermission({mode:"readwrite"});
    await write_to_file(Css_File,d$("#Css-Edit").value);
    show_status("Css written to file");
}

function _____MAIN_____(){}

// Main
(async function main(){
})();
// EOF
