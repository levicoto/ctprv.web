(function () {
  var root = document.documentElement;
  var switcher = document.querySelector(".lang-switch");

  function apply(lang, persist) {
    root.lang = lang;
    root.setAttribute("data-lang", lang);
    if (persist) {
      try {
        localStorage.setItem("lang", lang);
      } catch (e) {}
      if (window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        if (url.searchParams.has("lang")) {
          url.searchParams.set("lang", lang);
          window.history.replaceState(null, "", url);
        }
      }
    }
    var title = root.getAttribute(lang === "es" ? "data-title-es" : "data-title-en");
    var desc = root.getAttribute(lang === "es" ? "data-desc-es" : "data-desc-en");
    if (title) document.title = title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && desc) meta.setAttribute("content", desc);
    if (switcher) {
      switcher.setAttribute("aria-label", lang === "es" ? "Idioma" : "Language");
      var buttons = switcher.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        var on = buttons[i].getAttribute("data-set-lang") === lang;
        buttons[i].setAttribute("aria-pressed", on ? "true" : "false");
      }
    }
  }

  if (switcher) {
    switcher.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-set-lang]");
      if (!button) return;
      apply(button.getAttribute("data-set-lang"), true);
    });
  }

  apply(root.getAttribute("data-lang") || "en", false);
})();
