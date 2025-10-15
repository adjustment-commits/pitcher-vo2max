// =============================
// Flipbook ページ遷移＋PWA登録
// =============================
$(function () {
  const $pages = $(".page");
  let current = 1;
  const total = $pages.length;
  $("#tot").text(total);

  function showPage(n) {
    if (n < 1 || n > total) return;
    $pages.removeClass("active").eq(n - 1).addClass("active");
    current = n;
    $("#cur").text(current);
    $pages.eq(n - 1).scrollTop(0);
    history.replaceState(null, "", "#p=" + n);

    // ページ末尾・先頭でナビを非表示
    $("#prev").toggle(n > 1);
    $("#next").toggle(n < total);
  }

  // 初期表示（URLハッシュ対応）
  const hash = location.hash.match(/p=(\d+)/);
  if (hash) showPage(parseInt(hash[1], 10));
  else showPage(1);

  // ボタン操作
  $("#next").on("click", () => showPage(current + 1));
  $("#prev").on("click", () => showPage(current - 1));
  $("#home").on("click", () => showPage(1));

  // キーボード操作
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") showPage(current + 1);
    if (e.key === "ArrowLeft") showPage(current - 1);
    if (e.key === "Home") showPage(1);
  });

  // スワイプ操作
  let startX = 0;
  document.addEventListener("touchstart", e => (startX = e.touches[0].clientX), { passive: true });
  document.addEventListener(
    "touchend",
    e => {
      const endX = e.changedTouches[0].clientX;
      if (Math.abs(startX - endX) < 50) return;
      startX > endX ? showPage(current + 1) : showPage(current - 1);
    },
    { passive: true }
  );

  // =============================
  // ✅ Service Worker 登録
  // =============================
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(reg => console.log("[SW] Registered", reg.scope))
        .catch(err => console.warn("[SW] Registration failed:", err));
    });
  }
});
