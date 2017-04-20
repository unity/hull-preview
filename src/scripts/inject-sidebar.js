/* global document*/
function injectSidebar(/* src */) {
  const div = document.createElement("div");
  div.id = "hull-preview";
  div.setAttribute("style", "display: none; position: fixed;top: 0;right: 0;bottom: 0;width: 300px; height: 100%;background: white;z-index:9999;border: none;border-left: 1px solid rgba(123, 123, 156, 0.18);");
  document.body.appendChild(div);

  const p = document.createElement("p");
  p.id = "hull-preview-placeholder";
  p.innerText = "Select an email address and use context menu to look up the user in Hull Database";
  p.setAttribute("style", "font-family: sans-serif; margin: 50px 20px 10px; text-align: center;");
  div.appendChild(p);

  return div;
}
