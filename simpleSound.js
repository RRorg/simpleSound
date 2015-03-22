var simpleSound = new function() {
	this.tagCheckInterval=100; //time between cloned audio tag status checks

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
				for (var i = 0; i < simpleSound.APIplayQueue.length; i++) {
		            if(simpleSound.APIplayQueue[i]!==url)
		            {
		            	continue;
		            }
		            simpleSound.play(url);
		            simpleSound.APIplayQueue.splice(i--,1);
		        }
			});
		};
		req.send();
	};

	this.playAPI=function(url) {
		if(simpleSound.APIbuffers[url] === undefined)
		{
			simpleSound.APIplayQueue.push(url);
			return;
		}
		var source = simpleSound.contextAPI.createBufferSource();
		source.buffer = simpleSound.APIbuffers[url];
		source.connect(simpleSound.contextAPI.destination);
		if (typeof(source.noteOn) === "function")
		{
			source.noteOn(0);
		}
		else
		{
			source.start();
		}
	};

	this.initAPI=function() {
		if(simpleSound.APIinitQueue.length === 0)
		{
            return;
		}
        for (var i = 0; i < simpleSound.APIinitQueue.length; i++) {
            var buffer = simpleSound.APIbuffers[simpleSound.APIinitQueue[i]];
			if(buffer === undefined)
			{
		    	continue;
			}

			var source = simpleSound.contextAPI.createBufferSource();
            var gainNode = simpleSound.contextAPI.createGain();
            gainNode.gain.value=0.0;
			source.buffer = buffer;
			source.connect(gainNode);
	        gainNode.connect(simpleSound.contextAPI.destination);
			if (typeof(source.noteOn) === "function")
			{
				source.noteOn(0);
			}
			else
			{
				source.start();
			}

            simpleSound.APIinitQueue.splice(i--,1);
        }
	};

	this.loadTag=function(url) {
		var id = "simpleSound_"+simpleSound.tagID++;
		simpleSound.tagList[url] = id;

		var tag = '<audio id="'+id+'" preload="auto" autobuffer>';
			tag += '  <source src="'+url+'.ogg" type="audio/ogg" />';
			tag += '  <source src="'+url+'.mp3" type="audio/mpeg" />';
			tag += '</audio>';
		document.body.innerHTML += tag;
	};

	this.checkTag=function(clone) {
		if(!clone.paused) {
			setTimeout(function(){simpleSound.checkTag(clone);},simpleSound.tagCheckInterval);
		}
		else {
			document.body.removeChild(document.getElementById(clone.id));
		}
	};

	this.playTag=function(url) {
		if(simpleSound.tagList[url] === "undefined")
		{
			return;
		}

		var clone = document.getElementById(simpleSound.tagList[url]).cloneNode(true);
		clone.id="simpleSound_clone_"+simpleSound.tagID++;
		document.body.appendChild(clone);
		setTimeout(function(){
			document.getElementById(clone.id).play();
			setTimeout(function(){simpleSound.checkTag(clone);},simpleSound.tagCheckInterval);
		},10);
	};

	if(typeof(AudioContext) !== "undefined" || typeof(window.webkitAudioContext) !== "undefined") {
		this.load= this.loadAPI;
		this.play = this.playAPI;
		if(typeof(AudioContext) !== "undefined")
		{
			this.contextAPI = new window.AudioContext();
		}
		else
		{
			 this.contextAPI = new window.webkitAudioContext();
		}
        document.addEventListener('touchstart',function(){simpleSound.initAPI();});
	}
	else {
		this.load= this.loadTag;
		this.play = this.playTag;
	}

	var a = document.createElement('audio');
	if(!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
	{
		this.extension=".mp3";
	}
	else
	{
		this.extension=".ogg";
	}
}();