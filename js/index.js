var app = new Vue({
	el: "#app",
	data: {
		window:{
			width: 0,
			height: 0
		},
		name: "this is username",
		imageData: "",
		trueWidth: 0,
		trueHeight: 0,
		dragging: false,
		editing: false,
		notExceedingH: true,
		centerMargin: 1,
		scale: null,
		resized: false,
		lockAspect: "OFF",
		widthRatio: 1,
		heightRatio: 1,
		states:{
			resizing: false,
			cropping: false,
			adjusting: false,
			filtering: false,
			texting: false,
			saving: false
		},
		adjustments:{
			brightness: 1,
			contrast: 1,
			saturation: 1,
			hue: 0,
		},
		filters:{
			sepia: 0,
			grayscale: 0,
			blur: 0
		},
		saveName: "image",
		imgFormat: "image/jpeg",
		quality: '0.75',
		suffix: '.jpg',
		downloadTrigger: 0,
		href: '#',
		history:{
			resize: [],
			adjustmentsTweaks: [],
			filtersTweaks: []
		}

	},
  computed: {
		mappedBrightnessLevel: function(){
			return Math.round(this.adjustments.brightness*100)
		},
		mappedContrastLevel: function(){
			return Math.round(this.adjustments.contrast*100)
		},
		mappedSaturationLevel: function(){
			return Math.round(this.adjustments.saturation*100)
		},
		mappedHueLevel: function(){
			return Math.round(this.adjustments.hue) + '\xB0'
		},
		mappedSepiaLevel: function(){
			return Math.round(this.filters.sepia*100)
		},
		mappedGrayscaleLevel: function(){
			return Math.round(this.filters.grayscale*100)
		},
		mappedBlurLevel: function(){
			return Math.round(this.filters.blur*10)
		},
		mappedQualityLevel: function(){
			return Math.round(this.quality*100)
		}
	},
	created: function(){
   window.addEventListener('resize', this.handleResize)
	 this.handleResize();
	},

	methods: {

		 previewImage: function(event) {
		  var input = event.target;
			if(input.files && input.files[0]){
				var reader = new FileReader();
				reader.onload = (e) => {
					this.imageData = e.target.result;
				};
				reader.readAsDataURL(input.files[0]);
			}
		},

		loadImage: function(e){
			var self = this;
			var img = new Image();
			img.onload = function() {
				self.trueWidth = img.width;
				self.trueHeight = img.height;
					if((img.width > (self.window.width))||(img.height > self.window.height)){
					var iw = img.width;
					var ih = img.height;
					var scale = Math.min(((self.window.width-300) / iw),(self.window.height / ih));
					this.scale = scale;
					var iwScaled = iw*scale;
					var ihScaled = ih*scale;
					img.width = iwScaled ;
					img.height = ihScaled ;
				}
				self.drawCanvas(img);
			}

			img.src = self.imageData;
		},

		drawCanvas: function(img){
			var canvas = this.$refs.imageCanvas;
				canvas.width = img.width;
				canvas.height = img.height;
				this.pushInit(img.width, img.height);
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, img.width,img.height);
				this.reposition();
		},

		handleResize: function(){
			this.window.width = window.innerWidth;
			this.window.height = window.innerHeight;
		},

		resizeImg: function(width, height){
			var self = this;
			this.resized = true;
			var wH = this.window.height;
			var canvas = this.$refs.imageCanvas;
      this.trueWidth = width;
			this.trueHeight = height;
			if(height > wH){
				this.notExceedingH = false;
			}else{
				this.notExceedingH = true;
			}
			img = new Image();
			img.onload = function(){
				img.width = width;
				img.height = height;
				canvas.width = width;
				canvas.height = height;
				if((width > (self.window.width - 275))||(height > self.window.height)){
					var iw = img.width;
					var ih = img.height;
					var scale = Math.min(((self.window.width-300) / iw),(self.window.height / ih));
					this.scale = scale;
					var iwScaled = iw*scale;
					var ihScaled = ih*scale;
					img.width = iwScaled;
					img.height = ihScaled;
					canvas.width = iwScaled;
					canvas.height = ihScaled;
		   	}
				var ctx = canvas.getContext('2d');

				ctx.drawImage(img, 0, 0,img.width,img.height);
				self.reposition(1);
			}
			img.src = this.imageData;
		},

		cropImg: function(width, height){

		},

		toggleState: function(state){

      var canvas = this.$refs.imageCanvas;
			var s;
			if(this.states[state] == true){
				this.states[state] = false;
				this.reposition(0);
			}else{
				for(s in this.states){
							if(s == 'saving'){
		               if(this.states[s] == true){
										 this.downloadTrigger--;
									 }
							}
						this.states[s] = false;
					}
					this.states[state] = true;
					this.reposition(1);
				}
			},
		toggleRatio: function(){
			if(this.lockAspect == "ON"){
				this.lockAspect = "OFF";
			}else{
				this.lockAspect = "ON";
				this.widthRatio = this.trueWidth / this.trueHeight;
				this.heightRatio = this.trueHeight / this.trueWidth;
			}
		},

		adjustWidth: function(){
			if(this.lockAspect == "ON"){
			this.trueWidth = Math.round(this.trueHeight * this.widthRatio);
	   	}
		},
		adjustHeight: function(){
			if(this.lockAspect == "ON"){
			this.trueHeight = Math.round(this.trueWidth * this.heightRatio);
		}
	},
			loadOriginal: function(){
	 		 self = this;
	 		 img = new Image();
	 		 img.onload = function(){
	 			self.processImage(img);
	 			 }
	 			 img.src = this.imageData;
	 	 },

			processImage: function(img){
				var self = this;
				var canvas = document.createElement('canvas');
				var canvas1 = this.$refs.imageCanvas;
				var w = this.trueWidth;
				var h = this.trueHeight;
				var q = parseFloat(this.quality);
        var cssFilter = getComputedStyle(canvas1).filter;
				ctx = canvas.getContext('2d');
				canvas.width = w; img.width = w;
				canvas.height = h; img.height = h;

				ctx.filter = cssFilter;
				if(this.imgFormat == 'image/jpeg'){
						ctx.drawImage(img, 0, 0,w,h);
						canvas.toBlob(function(blob) {
			      var url = URL.createObjectURL(blob);
	          self.href = url;
					},'image/jpeg',q);
				}else{
	          ctx.drawImage(img, 0, 0,w,h);
						canvas.toBlob(function(blob) {
						      var url = URL.createObjectURL(blob);
				          self.href = url;
				   	},'image/png');
				}

			},

		formatInName: function(name, suffix){
			var s = name;
			s = s.slice(0, -4);
			this.saveName = s + suffix;
		},

		reposition: function(type){
			var canvas = this.$refs.imageCanvas;
			var x , y, z;
				x = canvas.width;
				if(type == 1){
				y = this.window.width - 275;
			}else{
				y = this.window.width - 55;
			}
				z = (y - x) / 2;
			this.centerMargin = z + 'px';
		},

		getQuality: function(){
			return this.quality;
		},

		apply: function(state){
			if(state == 'resize'){
				var w = this.trueWidth;
				var h = this.trueHeight;
				this.history.resize.push(w);
				this.history.resize.push(h);
				this.resizeImg(w, h);
			}
		},

		undo: function(state){
			if(state == 'resize'){
				    var arr = this.history.resize;
						if(arr[2] && arr[3]){
						arr.pop();
						arr.pop();
						var width = arr[arr.length-2];
						var height = arr[arr.length-1];
						this.resizeImg(width, height);
					}
			}
			if(state == 'adjusting'){
				console.log(state);
				var arr = this.history.adjustmentsTweaks;
				if(arr.length > 1){
					var lastTweak = arr[arr.length-1];
					if(lastTweak == 'brightness'){
						this.adjustments.brightness = 1;
					}else if(lastTweak == 'contrast'){
						this.adjustments.contrast = 1;
					}else if(lastTweak == 'saturation'){
						this.adjustments.saturation = 1;
					}else{
						this.adjustments.hue = 0;
					}
					console.log('lastTweak');
					arr.pop();
				}else{
					lastTweak = arr[0];
					if(lastTweak == 'brightness'){
						this.adjustments.brightness = 1;
					}else if(lastTweak == 'contrast'){
						this.adjustments.contrast = 1;
					}else if(lastTweak == 'saturation'){
						this.adjustments.saturation = 1;
					}else{
						this.adjustments.hue = 0;
					}
				}
			}
			if(state == 'filtering'){
				console.log(state);
				var arr = this.history.filtersTweaks;
				if(arr.length > 1){
					var lastTweak = arr[arr.length-1];
					if(lastTweak == 'sepia'){
						this.filters.sepia = 0;
					}else if(lastTweak == 'grayscale'){
						this.filters.grayscale = 0;
					}else{
						this.filters.blur = 0;
					console.log('lastTweak');
				}
					arr.pop();
			 	}else{

					lastTweak = arr[0];
					if(lastTweak == 'sepia'){
						this.filters.sepia = 0;
					}else if(lastTweak == 'grayscale'){
						this.filters.grayscale = 0;
					}else{
						this.filters.blur = 0;
					}
				}
			}

		},

		reset: function(state){
			if(state == 'adjust'){
				var arr = this.adjustments;
				arr.brightness = 1;
				arr.contrast = 1;
				arr.saturation = 1;
				arr.hue = 0;
			}
			if(state == 'filters'){
				var arr = this.filters;
				arr.sepia = 0;
				arr.grayscale = 0;
				arr.blur = 0;
			}
		},

		pushInit: function(w,h){
			this.history.resize.push(w);
			this.history.resize.push(h);
		},

		pushTweak: function(source, tweak){
			if(source == 'adjust'){
				var arr = this.history.adjustmentsTweaks;
				if(arr.length > 0){
					if(arr[arr.length-1] !== tweak){
				  this.history.adjustmentsTweaks.push(tweak);
					console.log(tweak);
		    	}
		  	}else{
				this.history.adjustmentsTweaks.push(tweak);
				console.log(tweak);
		  	}
	   	}
			if(source == 'filters'){
				var arr = this.history.filtersTweaks;
				if(arr.length > 0){
					if(arr[arr.length-1] !== tweak){
				  this.history.filtersTweaks.push(tweak);
					console.log(tweak);
		    	}
		  	}else{
				this.history.filtersTweaks.push(tweak);
				console.log(tweak);
		  	}
	   	}
		}

	},

	watch: {

	}
});
