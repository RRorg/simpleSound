var simpleSound = new function() {

	this.extension = "";
	this.contextAPI = undefined;
	this.APIbuffers = {};
	this.APIinitQueue = [];
	this.APIplayQueue = [];

	this.tagID = 0;
	this.tagList = {};

	this.loadAPI=function(url) {
		var req = new XMLHttpRequest();
		req.open('GET', url + this.extension, true);
		req.responseType = 'arraybuffer';

		req.onload = function() {
		    	simpleSound.contextAPI.decodeAudioData(req.response, function(buffer) {
				simpleSound.APIbuffers[url] = buffer;
				simpleSound.APIinitQueue.push(url);
			}, function(e) {
				console.log("[simpleSound] Error on file load: "+e);
			});
		}
		req.send();
	}

	this.playAPI=function(url) {
		if(simpleSound.APIbuffers[url] === undefined)
			return;

		var source = simpleSound.contextAPI.createBufferSource();
		source.buffer = simpleSound.APIbuffers[url];
		source.connect(simpleSound.contextAPI.destination);
		if (typeof(source.noteOn) === "function")
			source.noteOn(0);
		else
			source.start();
	}

	this.initAPI=function(url) {
		if(simpleSound.APIinitQueue.length == 0)
            return;
        for (i = 0; i < simpleSound.APIinitQueue.length; i++) {
            var buffer = simpleSound.APIbuffers[simpleSound.APIinitQueue[i]];
			if(buffer === undefined)
		    	continue;

			var source = simpleSound.contextAPI.createBufferSource();
            var gainNode = simpleSound.contextAPI.createGain();
            gainNode.gain.value=0.0;
			source.buffer = buffer;
			source.connect(gainNode);
	        gainNode.connect(simpleSound.contextAPI.destination);
			if (typeof(source.noteOn) === "function")
				source.noteOn(0);
			else
				source.start();

            lowLag.APIinitQueue.splice(i--,1);
        }
	}

	this.loadTag=function(url) {
		var id = "simpleSound_"+simpleSound.tagID++;
		simpleSound.tagList[url] = id;

		var tag = '<audio id="'+id+'" preload="auto" autobuffer>';
			tag += '  <source src="'+url+'.ogg" type="audio/ogg" />';
			tag += '  <source src="'+url+'.mp3" type="audio/mpeg" />';
			tag += '</audio>';
		document.body.innerHTML += tag;
	}

	this.playTag=function(url) {
		if(simpleSound.tagList[url] === "undefined")
			return;

		var clone = document.getElementById(simpleSound.tagList[url]).cloneNode(true);
		clone.id=clone.id+'_clone_'+Math.floor(Math.random()*1000);
		document.body.appendChild(clone);
		setTimeout(function(){
			document.getElementById(clone.id).play();
			setTimeout(function(){
				document.body.removeChild(document.getElementById(clone.id));
					delete clone;
				},clone.duration*1000);
		},10);
	}

	if(typeof(AudioContext) !== "undefined") {
		this.load= this.loadAPI;
		this.play = this.playAPI;
		this.contextAPI = new AudioContext();
        document.addEventListener('touchstart',function(){simpleSound.initAPI();});
	}
	else {
		this.load= this.loadTag;
		this.play = this.playTag;
	}

	var a = document.createElement('audio');
	if(!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
		this.extension=".mp3";
	else
		this.extension=".ogg";
	delete a;
}