$(function() {

	$('#rc > div > div > div > input[type="file"]').change(function(e) {

		var $input = $(this);
		var $box = $input.parents('.box').first();

		if ($input.is('.jpeginput')) {
			var file = this.files[0];
			if (file.type !== 'image/jpeg') {
				alert('Only JPEG files may be used as images.');
				this.value = '';
				return;
			} else {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				$(reader).load(function(e) {
					$box.find('img').attr('src', this.result);
				});
			}
		}

		switch ($box.attr('id').substring(0, 3))
		{
			case 'enc':
				runEncrypt();
				break;
			case 'dec':
				runDecrypt();
				break;
		}

	});

});

function runEncrypt()
{
	var $enci = $('#enci');
	var $encf = $('#encf');

	// TODO: clear enco
	
	var fi = $enci.find('input').get(0).files[0];
	var ff = $encf.find('input').get(0).files[0];
	if (!(fi && ff))
		return;

	var ri = new FileReader();
	var rf = new FileReader();
	ri.readAsArrayBuffer(fi);
	rf.readAsArrayBuffer(ff);

	$([ri, rf]).load(function(e) {
		if (ri.result && rf.result)
			runEncrypt2(ri.result, rf.result);
	});
}

function runEncrypt2(ai, af)
{
	console.log(ai);
	console.log(af);
}
