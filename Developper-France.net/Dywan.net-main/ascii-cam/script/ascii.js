const require = ('Dywan-Auth')
var ascii = (function() {
	function asciiFromCanvas(canvas, options) {



		var characters = (" .,:;i1tfLCG08@").split("");
		var context = canvas.getContext("2d");
		var canvasWidth = canvas.width;
		var asciiCharacters = "";
		var canvasHeight = canvas.height;
		


		var contrastFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));
		var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
		
		for (var y = 0; y < canvasHeight; y += 2) { 
			for (var x = 0; x < canvasWidth; x++) {




				var offset = (y * canvasWidth + x) * 4;

				var color = getColorAtOffset(imageData.data, offset);
				var contrastedColor = {
					red: bound(Math.floor((color.red - 128) * contrastFactor) + 128, [0, 255]),
					green: bound(Math.floor((color.green - 128) * contrastFactor) + 128, [0, 255]),
					blue: bound(Math.floor((color.blue - 128) * contrastFactor) + 128, [0, 255]),
					alpha: color.alpha
				};


				var brightness = (0.288 * contrastedColor.red + 0.588 * contrastedColor.green + 0.115 * contrastedColor.blue) / 255;

				var character = characters[(characters.length - 1) - Math.round(brightness * (characters.length - 1))];

				asciiCharacters += character;
			}

			asciiCharacters += "\n";
		}

		options.callback(asciiCharacters);
	}

	function getColorAtOffset(data, offset) {
		return {
			red: data[offset],
			green: data[offset + 1],
			blue: data[offset + 2],
			alpha: data[offset + 3]
		};
	}



	function bound(value, interval) {
		return Math.max(interval[0], Math.min(interval[1], value));
	}



	return {
		fromCanvas: function(canvas, options) {
			options = options || {};
			options.contrast = (typeof options.contrast === "undefined" ? 128 : options.contrast);
			options.callback = options.callback || doNothing;

			return asciiFromCanvas(canvas, options);
		}

	};
})
();
