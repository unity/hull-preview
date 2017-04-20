function loadIframe(src) {
  if (!document.getElementById("hull-preview-iframe")) {
    var iframe = document.createElement('iframe');
    iframe.id = "hull-preview-iframe"
    iframe.src = src;
    iframe.setAttribute("style", "width: 100%;height: 100%;border: none;")
    document.getElementById("hull-preview").appendChild(iframe);
  } else {
    var iframe = document.getElementById("hull-preview-iframe")
  }

  handleLoading(iframe, src);

  iframe.onload = function() {
    document.getElementById("hull-preview-placeholder").style.display = "none";
    iframe.style.display = "block";
  };

  return iframe;
}

function handleLoading(iframe, src) {
  var placeholder = document.getElementById("hull-preview-placeholder");
  placeholder.innerText = "loading";
  placeholder.style.display = "block";

  iframe.style.display = "none";

  if (iframe.src === src) {
    return;
  }

  iframe.src = src;

}

function hideIframe(iframe) {
  document.body.removeChild(iframe);
}
