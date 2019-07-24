$(function () {
	var defaultAction = 'login';
	var action = window.location.hash.substring(1) || defaultAction;
	var content = [$.ajax({
		url: "modules/authentication/view/" + action + ".html",
		async: false
	}).responseText, '<script src="modules/authentication/controller/' + action + '.js" type="text/javascript" charset="utf-8"></script>'];
	$('#mainwrap').html(content.join(""));

}());