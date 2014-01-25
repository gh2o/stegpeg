function JPEGException(message)
{
	this.name = 'JPEGException';
	this.message = message;
}

var JPEG = (function() {

	function QuantTableSection(data) { this.data = data; }
	function ExtensionSection(data) { this.data = data; }
	function FrameHeaderSection(data) { this.data = data; }
	function RestartIntervalSection(data) { this.data = data; }
	function HuffmanTableSection(data) { this.data = data; }
	function ScanSection(data) { this.data = data; }

	var SOF0 = 0xFFC0;
	var SOF1 = 0xFFC1;
	var SOF2 = 0xFFC2;
	var SOF3 = 0xFFC3;
	var DHT = 0xFFC4;
	var SOI = 0xFFD8;
	var EOI = 0xFFD9;
	var SOS = 0xFFDA;
	var DQT = 0xFFDB;
	var DRI = 0xFFDD;
	
	function JPEG() {
		this.qtables = [null, null, null, null];
	}

	JPEG.prototype.encode = function() {
	};

	JPEG.prototype.decode = function(buf) {

		var dv = new DataView(buf);
		var index = 0;
		function u16() { var x = dv.getUint16(index); index += 2; return x; }
		function u8() { var x = dv.getUint8(index); index += 1; return x; }

		function blk() {
			var l = u16() - 2;
			var x = new DataView(buf, index, l);
			index += l;
			return x;
		}

		if (u16() != SOI)
			throw new JPEGException("SOI not found");

		var sections = [];

		outer:
		while (true) {
			var marker = u16();
			switch (marker) {
				case EOI:
					break outer;
				case DQT:
					sections.push(new QuantTableSection(blk()));
					break;
				case SOF0:
					sections.push(new FrameHeaderSection(blk()));
					break;
				case SOF1:
				case SOF2:
				case SOF3:
					throw new JPEGException('only baseline JPEG is supported');
				case DRI:
					sections.push(new RestartIntervalSection(blk()));
					break;
				case DHT:
					sections.push(new HuffmanTableSection(blk()));
					break;
				case SOS:
					sections.push(new ScanSection(blk()));
					break;
				default:
					if (marker >= 0xFFE0 && marker <= 0xFFFD)
						sections.push(new ExtensionSection(blk()));
					else
						throw new JPEGException('unknown JPEG marker: 0x' + marker.toString(16).toUpperCase());
					break;
			}
		}

		throw new JPEGException('not implemented');

	};

	return JPEG;

})();
