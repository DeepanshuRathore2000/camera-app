let videoElem = document.querySelector("video");
let recordBtn = document.querySelector(".record");
let captureImgBtn = document.querySelector(".click-img");
let filterArr = document.querySelectorAll(".filter");
let filterOverlay = document.querySelector(".filter_overlay");
let isRecording = false;
let filterColor = "";
// user requirement send
let constraint = {
audio: true, video: true
}
//represent future recording
let recording = [];
let mediarecordingObjectForCurrStream;
// getusermedia promise dega usey then mein stream krwa lenge
// document represents -> html page
// window represents -> tab page
// navigator represents -> browser page
let usermediaPromise = navigator.mediaDevices.getUserMedia(constraint);          //getUserMedia inbuilt functiom hai navigator ApI ka jisse media get krte hai browser ke through 
 // stream coming from required
usermediaPromise.
    then(function (stream){
        //uI stream
        videoElem.srcObject = stream;                                    //video and audio just stream hogi UI pe
        //browser
        mediarecordingObjectForCurrStream = new MediaRecorder(stream);          // recording start hogi  // MediaRecorder is an Api which stores the stream in an object iss api par onstop,onstart methoda lagaa kr recording on/off kra skte hai
        // camera recording add ->recording array
        mediarecordingObjectForCurrStream.ondataavailable = function (e){       //recording array me data(recording chunks) push hoga 
            recording.push(e.data);
        }
        mediarecordingObjectForCurrStream.onstop = function(){          // or we can write like:- mediarecordingObjectForCurrStream.onstop = function(){
            //recording -> url convert
            // type-> MIME type;
            const blob = new Blob(recording,{ type:'video/mp4' }); //video ko url me convert krne ke liye blob use
            const url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = "file.mp4";             // to download video
            a.href = url;
            a.click();
            recording = [];          // recording array empty krna hoga after video download
        }       
               
    })
    .catch (function (err){
        console.log(err)
        alert("please allow both mic and cam");
    });
 recordBtn.addEventListener("click",function () {                          // agar user allow nhi krta device ko to ye msg show hoga usey
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("first select the device");
        return;
    }
    if(isRecording == false) {
        mediarecordingObjectForCurrStream.start();
        recordBtn.innerText = "Recording...";
    }
    else{
        mediarecordingObjectForCurrStream.stop();
        recordBtn.innerText = "Record";       
    }
    isRecording = !isRecording;            //recording ki state change krne ke liye
 })
 captureImgBtn.addEventListener("click",function () {
     //canvas create
     let canvas = document.createElement("canvas");
     canvas.height = videoElem.videoHeight;
     canvas.width = videoElem.videoWidth;
     let tool = canvas.getContext("2d");
     tool.drawImage(videoElem,0,0);
     if(filterColor){
         tool.fillStyle=filterColor;
         tool.fillRect(0,0,canvas.width,canvas.height);
     }
     let url = canvas.toDataURL();
     let a= document.createElement("a");
     a.download = "file.png";
     a.href = url;
     a.click();
     a.remove();

 })
 // to add filter on ui
 // filter array
 for (let i=0;i<filterArr.length;i++){
     filterArr[i].addEventListener("click", function(){
         filterColor = filterArr[i].style.backgroundColor;
         filterOverlay.style.backgroundColor = filterColor;
     })
 }