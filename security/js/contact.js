// Placeholder. Replace SIGNAL_URL with the real Signal link.
var SIGNAL_URL = "[signal]";

(function () {
  var signal = document.querySelector("[data-signal]");
  if (signal) {
    signal.setAttribute("href", SIGNAL_URL);
  }

  var mail = document.querySelector("[data-mail]");
  if (!mail) return;

  mail.addEventListener("click", function () {
    var lang = document.documentElement.getAttribute("data-lang") === "es" ? "es" : "en";
    var local = ["levico", "security"].join("+");
    var host = ["mail", "grokbot", "com"].join(".");
    var address = local + String.fromCharCode(64) + host;
    var subject = lang === "es" ? "Consulta de seguridad" : "Security inquiry";
    var body = lang === "es"
      ? "Contame tu situación y qué servicio te interesa.\n\nSituación:\n\nServicio de interés:\n\n"
      : "Tell me your situation and which service you're interested in.\n\nSituation:\n\nService of interest:\n\n";
    window.location.href = "mailto:" + address + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
