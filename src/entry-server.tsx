// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// Inline script to prevent theme flash on page load
const themeScript = `
(function() {
  var theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
`;

// Copy button functionality for code blocks
const copyScript = `
(function() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.code-copy-btn');
    if (!btn) return;

    var wrapper = btn.closest('.code-block-wrapper');
    var code = wrapper.querySelector('code');
    if (!code) return;

    navigator.clipboard.writeText(code.textContent).then(function() {
      btn.classList.add('copied');
      setTimeout(function() {
        btn.classList.remove('copied');
      }, 2000);
    });
  });
})();
`;

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <script innerHTML={themeScript} />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
          <script innerHTML={copyScript} />
        </body>
      </html>
    )}
  />
));
