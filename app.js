(function () {
  "use strict";

  const modules = window.UAV_MODULES;
  const overview = window.UAV_OVERVIEW;
  const stage = document.getElementById("stage");
  const jumpNav = document.getElementById("module-jump-nav");

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const list = items => `<ul class="status-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  const statusCard = (title, items, kind) => items?.length ? `
    <details class="status-card ${kind}">
      <summary><span>${escapeHtml(title)}</span><span class="status-count">${items.length} مورد</span></summary>
      ${list(items)}
    </details>` : "";

  function setHeader(id, title) {
    document.getElementById("module-code").textContent = id;
    document.getElementById("module-title").textContent = title;
    document.title = `طراحی مقدماتی پهپاد | ${id}`;
  }

  function renderModuleJump(activeIndex) {
    jumpNav.innerHTML = `
      <button type="button" class="module-jump-home ${activeIndex === -1 ? "active" : ""}" id="overview-home" ${activeIndex === -1 ? 'aria-current="page"' : ""}>نمای کلی</button>
      <span class="module-jump-label">ماژول‌ها</span>
      <div class="module-jump-list" role="group" aria-label="ماژول‌های آماده">
        ${modules.map((module, index) => `
          <button type="button" class="module-jump-item ${index === activeIndex ? "active" : ""}" data-module-index="${index}" aria-label="رفتن به ${escapeHtml(module.id)}: ${escapeHtml(module.title)}" title="${escapeHtml(module.title)}" ${index === activeIndex ? 'aria-current="page"' : ""}>
            <span>${escapeHtml(module.id)}</span>
          </button>`).join("")}
      </div>
      <label class="module-jump-select"><span>انتخاب با عنوان</span>
        <select id="module-jump-select" aria-label="انتخاب ماژول بر اساس عنوان">
          <option value="" ${activeIndex === null ? "selected" : ""}>انتخاب ماژول…</option>
          <option value="overview" ${activeIndex === -1 ? "selected" : ""}>نمای کلی · Draft</option>
          ${modules.map((module, index) => `<option value="${index}" ${index === activeIndex ? "selected" : ""}>${escapeHtml(module.id)} · ${escapeHtml(module.title)}</option>`).join("")}
        </select>
      </label>`;

    jumpNav.querySelector("#overview-home").addEventListener("click", renderOverview);
    jumpNav.querySelectorAll("[data-module-index]").forEach(button => {
      button.addEventListener("click", () => renderModule(Number(button.dataset.moduleIndex)));
    });
    jumpNav.querySelector("#module-jump-select").addEventListener("change", event => {
      if (event.target.value === "overview") renderOverview();
      else if (event.target.value !== "") renderModule(Number(event.target.value));
    });
  }

  const renderTopic = topic => `
    <details class="topic">
      <summary class="topic-summary">
        <span class="topic-copy"><strong>${escapeHtml(topic.title)}</strong><span>${escapeHtml(topic.summary)}</span></span>
        <span class="topic-toggle" aria-hidden="true"></span>
      </summary>
      <div class="topic-body">${topic.body}</div>
    </details>`;

  const renderGroup = group => `
    <section class="topic-group">
      <h2>${escapeHtml(group.title)}</h2>
      <div class="topic-list">${group.topics.map(renderTopic).join("")}</div>
    </section>`;

  function renderOverview() {
    setHeader("DRAFT", overview.title);
    renderModuleJump(-1);
    const moduleButton = id => {
      const module = modules.find(item => item.id === id);
      return module ? `<button type="button" class="draft-module-link" data-overview-module="${escapeHtml(id)}" title="${escapeHtml(module.title)}"><bdi dir="ltr">${escapeHtml(id)}</bdi><span>${escapeHtml(module.title)}</span></button>` : "";
    };
    stage.innerHTML = `
      <div class="draft-page" id="overview-content">
        <section class="draft-hero" aria-labelledby="draft-title">
          <div><span class="draft-badge">DRAFT · نمای آغازین</span><h2 id="draft-title">از سامانه‌ی کامل تا انتخاب قطعات</h2><p>${escapeHtml(overview.lead)}</p></div>
          <span class="draft-hero-index" aria-hidden="true">00</span>
        </section>
        <section class="draft-primer" aria-labelledby="draft-primer-title">
          <div class="draft-section-head"><div><span class="section-kicker">تصویر کلی پرواز</span><h2 id="draft-primer-title">کوادروتور چطور کار می‌کند؟</h2></div><p>چهار مجموعه‌ی پیشرانش، زیر فرمان یک کنترلر، رانش و گشتاور لازم برای حرکت را می‌سازند.</p></div>
          <div class="draft-flow-card">
            <div class="draft-flow-heading"><span class="draft-flow-icon command" aria-hidden="true">⌁</span><div><h3>مسیر فرمان و اطلاعات</h3><p>فرمان به حرکت تبدیل می‌شود و حسگرها وضعیت واقعی را برمی‌گردانند.</p></div></div>
            <div class="draft-command-flow" dir="rtl">${overview.quadrotor.command.map((node, index) => `<div class="draft-flow-node"><strong>${escapeHtml(node.title)}</strong><span>${escapeHtml(node.detail)}</span></div>${index < overview.quadrotor.command.length - 1 ? '<span class="draft-flow-arrow" aria-hidden="true">←</span>' : ''}`).join("")}</div>
            <div class="draft-loop-note"><span aria-hidden="true">↶</span>${escapeHtml(overview.quadrotor.loop)}</div>
          </div>
          <div class="draft-flow-card power-card">
            <div class="draft-flow-heading"><span class="draft-flow-icon power" aria-hidden="true">ϟ</span><div><h3>مسیر انرژی</h3><p>توان پیشران و توان الکترونیک دو شاخه‌ی متفاوت از باتری‌اند.</p></div></div>
            <div class="draft-power-flow" dir="rtl">
              <div class="draft-flow-node battery-node"><strong>${escapeHtml(overview.quadrotor.power[0].title)}</strong><span>${escapeHtml(overview.quadrotor.power[0].detail)}</span></div>
              <span class="draft-flow-arrow" aria-hidden="true">←</span>
              <div class="draft-flow-node bus-node"><strong>${escapeHtml(overview.quadrotor.power[1].title)}</strong><span>${escapeHtml(overview.quadrotor.power[1].detail)}</span></div>
              <div class="draft-power-branches">
                <div class="draft-power-branch"><span class="draft-branch-arrow" aria-hidden="true">↓</span><div class="draft-flow-node"><strong>${escapeHtml(overview.quadrotor.power[2].title)}</strong><span>${escapeHtml(overview.quadrotor.power[2].detail)}</span></div></div>
                <div class="draft-power-branch"><span class="draft-branch-arrow" aria-hidden="true">↓</span><div class="draft-flow-node"><strong>${escapeHtml(overview.quadrotor.power[3].title)}</strong><span>${escapeHtml(overview.quadrotor.power[3].detail)}</span></div></div>
              </div>
            </div>
            <p class="draft-flow-caption">کنترلر با ولتاژ تنظیم‌شده کار می‌کند؛ Power Module می‌تواند ولتاژ و جریان باتری را هم اندازه‌گیری کند.</p>
          </div>
          <div class="draft-axis-grid" aria-label="حرکت‌های اصلی کوادروتور">${overview.quadrotor.axes.map(axis => `<article class="draft-axis-card"><bdi class="draft-axis-key" dir="ltr">${escapeHtml(axis.key)}</bdi><div><h3>${escapeHtml(axis.title)}</h3><p>${escapeHtml(axis.detail)}</p></div></article>`).join("")}</div>
          <div class="draft-module-count"><strong><bdi dir="ltr">12</bdi> زیرسامانه‌ی پایه <span aria-hidden="true">←</span> <bdi dir="ltr">15</bdi> ماژول آموزشی</strong><p>${escapeHtml(overview.quadrotor.moduleCountNote)}</p></div>
          <p class="draft-map-note">${escapeHtml(overview.quadrotor.note)}</p>
        </section>
        <section class="draft-map" aria-labelledby="draft-map-title">
          <div class="draft-section-head"><div><span class="section-kicker">نقشه‌ی سامانه</span><h2 id="draft-map-title">هفت حوزه، دو سطح جزئیات</h2></div><p>هر شاخه یک کارکرد را نشان می‌دهد. شناسه‌های زیر آن به ماژول‌های مربوط وصل‌اند.</p></div>
          <div class="draft-tree-root"><b>UAV</b><span>سامانه‌ی یکپارچه</span></div>
          <div class="draft-tree-stem" aria-hidden="true"></div>
          <div class="draft-domain-grid">
            ${overview.domains.map(domain => `
              <details class="draft-domain" open>
                <summary><span class="draft-domain-key" aria-hidden="true">${escapeHtml(domain.key)}</span><span class="draft-domain-name"><strong>${escapeHtml(domain.title)}</strong><small>${escapeHtml(domain.label)}</small></span><span class="draft-domain-toggle" aria-hidden="true"></span></summary>
                <div class="draft-branch-list">${domain.branches.map(branch => `
                  <div class="draft-branch"><h3>${escapeHtml(branch.title)}</h3><p>${escapeHtml(branch.detail)}</p><p class="draft-branch-help">${escapeHtml(branch.help)}</p><div class="draft-leaves">${branch.modules.map(moduleButton).join("")}</div></div>`).join("")}</div>
              </details>`).join("")}
          </div>
          <p class="draft-map-note">یک ماژول ممکن است در چند حوزه دیده شود، چون تصمیم‌های سازه، برق، حرارت و نرم‌افزار به هم وابسته‌اند.</p>
        </section>
        <section class="draft-process" aria-labelledby="draft-process-title">
          <div class="draft-section-head"><div><span class="section-kicker">روند طراحی</span><h2 id="draft-process-title">از نیاز تا نمونه‌ی قابل‌آزمون</h2></div><p>انتخاب قطعه پس از بستن نیاز، رابط و بودجه انجام می‌شود و با داده‌ی آزمون بازنگری می‌گردد.</p></div>
          <ol class="draft-process-grid">${overview.process.map((step, index) => `<li><span class="draft-step-num">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(step.label)}</strong><p class="draft-step-detail">${escapeHtml(step.detail)}</p><div class="draft-step-input"><b>ورودی</b><span>${escapeHtml(step.input)}</span></div><div class="draft-step-output"><b>خروجی</b><span>${escapeHtml(step.output)}</span></div></li>`).join("")}</ol>
          <div class="draft-feedback"><span aria-hidden="true">↺</span><p>${escapeHtml(overview.review)}</p></div>
        </section>
        <div class="draft-enter"><p>برای بررسی فرض‌ها، موارد باز و جزئیات فنی، از نقشه یا نوار بالای صفحه وارد ماژول‌ها شوید.</p><button type="button" class="module-button primary" id="draft-enter-modules">شروع از ماژول ۱</button></div>
      </div>`;
    stage.querySelectorAll("[data-overview-module]").forEach(button => {
      button.addEventListener("click", () => {
        const index = modules.findIndex(module => module.id === button.dataset.overviewModule);
        if (index >= 0) renderModule(index);
      });
    });
    document.getElementById("draft-enter-modules").addEventListener("click", () => renderModule(0));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function renderPlaceholder(item, previousIndex) {
    renderModuleJump(null);
    stage.innerHTML = `
      <section class="next-placeholder" aria-live="polite">
        <span class="section-kicker">${escapeHtml(item.id)} · ماژول بعدی</span>
        <h2>${escapeHtml(item.title)}</h2>
        <p>این بخش هنوز در حال آماده‌سازی است. با تکمیل محتوای این مرحله، همین‌جا به شکل تعاملی اضافه می‌شود.</p>
        <nav class="module-navigation" aria-label="بازگشت به ماژول قبلی">
          <button type="button" class="module-button secondary" id="previous-module">بازگشت به ماژول قبلی</button>
          <span class="previous-hint">محتوای این ماژول هنوز آماده نیست.</span>
        </nav>
      </section>`;
    setHeader(item.id, item.title);
    document.getElementById("previous-module").addEventListener("click", () => renderModule(previousIndex));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function renderModule(index) {
    const module = modules[index];
    if (!module) {
      const previous = modules[index - 1];
      renderPlaceholder(previous.nextModule, index - 1);
      return;
    }

    setHeader(module.id, module.title);
    renderModuleJump(index);
    const baseline = module.baseline.map(item => `
      <div class="baseline-item ${escapeHtml(item.kind)}"><span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.value)}</b></div>`).join("");
    const overviewTopics = module.overviewTopics.map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const nextExists = Boolean(modules[index + 1] || module.nextModule);

    stage.innerHTML = `
      <div id="module-content">
        <section class="module-intro">
          <div class="intro-copy"><span class="section-kicker">تعریف فعلی ماژول</span><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.purpose)}</p>
            <div class="covered-topics"><h3>موضوعات تحت پوشش</h3><ul>${overviewTopics}</ul></div>
          </div>
          <div class="baseline-grid" aria-label="مبنای اولیه طراحی">${baseline}</div>
        </section>
        <section class="status-strip" aria-label="وضعیت تصمیم‌های طراحی">
          ${statusCard("فرض‌های کاری", module.assumptions, "working")}
          ${statusCard("موارد باز", module.openItems, "open")}
          ${statusCard("نکات بحرانی", module.critical, "critical")}
        </section>
        <section class="explorer" aria-labelledby="explorer-title">
          <div class="explorer-heading"><div><span class="section-kicker">مطالب ماژول</span><h2 id="explorer-title">برای خواندن جزئیات، هر موضوع را باز کنید</h2></div>
            <div class="explorer-tools"><label class="search-box"><span class="sr-only">جست‌وجو در موضوعات</span><input id="topic-search" type="search" placeholder="جست‌وجو در موضوعات…" autocomplete="off"></label>
              <button type="button" id="expand-all">بازکردن همه</button><button type="button" id="collapse-all">بستن همه</button>
            </div>
          </div>
          <div id="topic-groups">${module.groups.map(renderGroup).join("")}</div>
          <p class="empty-search" id="empty-search" hidden>موضوعی با این عبارت پیدا نشد.</p>
        </section>
        <section class="closing-grid">
          <article class="closing-card conclusion"><span>جمع‌بندی ماژول</span><p>${escapeHtml(module.conclusion)}</p>${module.id === "M01" ? '<bdi class="target-mass" dir="ltr">m<sub>frame</sub> ≈ 300 g</bdi>' : ""}</article>
          <article class="closing-card next-module"><span>ادامه مسیر پیشنهادی</span><p>${escapeHtml(module.next)}</p></article>
        </section>
        <nav class="module-navigation" aria-label="جابه‌جایی بین ماژول‌ها">
          <div class="previous-hint">${index > 0 ? "بازگشت به محتوای ماژول قبلی" : "بازگشت به نمای کلی سامانه"}</div>
          <div class="module-nav-buttons"><button type="button" class="module-button secondary" id="previous-module">${index > 0 ? "ماژول قبلی" : "نمای کلی"}</button><button type="button" class="module-button primary" id="next-module" ${nextExists ? "" : "disabled"}>ادامه به ماژول بعدی</button></div>
        </nav>
      </div>`;

    const search = document.getElementById("topic-search");
    const groups = [...document.querySelectorAll(".topic-group")];
    search.addEventListener("input", () => {
      const query = search.value.trim().toLocaleLowerCase("fa");
      let matches = 0;
      groups.forEach(group => {
        const topics = [...group.querySelectorAll(".topic")];
        let groupMatches = 0;
        topics.forEach(topic => {
          const visible = !query || topic.textContent.toLocaleLowerCase("fa").includes(query);
          topic.hidden = !visible;
          if (visible) groupMatches += 1;
        });
        group.hidden = groupMatches === 0;
        matches += groupMatches;
      });
      document.getElementById("empty-search").hidden = matches !== 0;
    });

    document.getElementById("expand-all").addEventListener("click", () => {
      document.querySelectorAll(".topic:not([hidden])").forEach(topic => { topic.open = true; });
    });
    document.getElementById("collapse-all").addEventListener("click", () => {
      document.querySelectorAll(".topic").forEach(topic => { topic.open = false; });
    });
    document.getElementById("previous-module").addEventListener("click", () => index > 0 ? renderModule(index - 1) : renderOverview());
    document.getElementById("next-module").addEventListener("click", () => {
      if (modules[index + 1]) renderModule(index + 1);
      else renderPlaceholder(module.nextModule, index);
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const requestedIndex = modules.findIndex(module => module.id.toLowerCase() === window.location.hash.slice(1).toLowerCase());
  if (requestedIndex >= 0) renderModule(requestedIndex);
  else renderOverview();
})();
