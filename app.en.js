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
      <summary><span>${escapeHtml(title)}</span><span class="status-count">${items.length} items</span></summary>
      ${list(items)}
    </details>` : "";

  function setHeader(id, title) {
    document.getElementById("module-code").textContent = id;
    document.getElementById("module-title").textContent = title;
    document.title = `Preliminary UAV Design | ${id}`;
  }

  function renderModuleJump(activeIndex) {
    jumpNav.innerHTML = `
      <button type="button" class="module-jump-home ${activeIndex === -1 ? "active" : ""}" id="overview-home" ${activeIndex === -1 ? 'aria-current="page"' : ""}>Overview</button>
      <span class="module-jump-label">Modules</span>
      <div class="module-jump-list" role="group" aria-label="Available modules">
        ${modules.map((module, index) => `
          <button type="button" class="module-jump-item ${index === activeIndex ? "active" : ""}" data-module-index="${index}" aria-label="Go to ${escapeHtml(module.id)}: ${escapeHtml(module.title)}" title="${escapeHtml(module.title)}" ${index === activeIndex ? 'aria-current="page"' : ""}>
            <span>${escapeHtml(module.id)}</span>
          </button>`).join("")}
      </div>
      <label class="module-jump-select"><span>Choose by title</span>
        <select id="module-jump-select" aria-label="Choose module by title">
          <option value="" ${activeIndex === null ? "selected" : ""}>Select a module…</option>
          <option value="overview" ${activeIndex === -1 ? "selected" : ""}>Overview · Draft</option>
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
          <div><span class="draft-badge">DRAFT · Opening view</span><h2 id="draft-title">From the complete system to component selection</h2><p>${escapeHtml(overview.lead)}</p></div>
          <span class="draft-hero-index" aria-hidden="true">00</span>
        </section>
        <section class="draft-primer" aria-labelledby="draft-primer-title">
          <div class="draft-section-head"><div><span class="section-kicker">Flight at a glance</span><h2 id="draft-primer-title">How does a quadrotor work?</h2></div><p>Four propulsion units, under one controller, produce the thrust and torque needed for motion.</p></div>
          <p class="draft-map-note project-note">${escapeHtml(overview.quadrotor.projectNote)}</p>
          <div class="draft-flow-card">
            <div class="draft-flow-heading"><span class="draft-flow-icon command" aria-hidden="true">⌁</span><div><h3>Command and information path</h3><p>Commands become motion, and Sensors report the actual state.</p></div></div>
            <div class="draft-command-flow" dir="ltr">${overview.quadrotor.command.map((node, index) => `<div class="draft-flow-node"><strong>${escapeHtml(node.title)}</strong><span>${escapeHtml(node.detail)}</span></div>${index < overview.quadrotor.command.length - 1 ? '<span class="draft-flow-arrow" aria-hidden="true">→</span>' : ''}`).join("")}</div>
            <div class="draft-loop-note"><span aria-hidden="true">↶</span>${escapeHtml(overview.quadrotor.loop)}</div>
          </div>
          <div class="draft-flow-card power-card">
            <div class="draft-flow-heading"><span class="draft-flow-icon power" aria-hidden="true">ϟ</span><div><h3>Energy path</h3><p>Propulsion power and electronic power are separate branches from the Battery.</p></div></div>
            <div class="draft-power-flow" dir="ltr">
              <div class="draft-flow-node battery-node"><strong>${escapeHtml(overview.quadrotor.power[0].title)}</strong><span>${escapeHtml(overview.quadrotor.power[0].detail)}</span></div>
              <span class="draft-flow-arrow" aria-hidden="true">→</span>
              <div class="draft-flow-node bus-node"><strong>${escapeHtml(overview.quadrotor.power[1].title)}</strong><span>${escapeHtml(overview.quadrotor.power[1].detail)}</span></div>
              <div class="draft-power-branches">
                <div class="draft-power-branch"><span class="draft-branch-arrow" aria-hidden="true">↓</span><div class="draft-flow-node"><strong>${escapeHtml(overview.quadrotor.power[2].title)}</strong><span>${escapeHtml(overview.quadrotor.power[2].detail)}</span></div></div>
                <div class="draft-power-branch"><span class="draft-branch-arrow" aria-hidden="true">↓</span><div class="draft-flow-node"><strong>${escapeHtml(overview.quadrotor.power[3].title)}</strong><span>${escapeHtml(overview.quadrotor.power[3].detail)}</span></div></div>
              </div>
            </div>
            <p class="draft-flow-caption">The controller runs on regulated voltage; a Power Module can also measure Battery voltage and current.</p>
          </div>
          <div class="draft-axis-grid" aria-label="Main quadrotor motions">${overview.quadrotor.axes.map(axis => `<article class="draft-axis-card"><bdi class="draft-axis-key" dir="ltr">${escapeHtml(axis.key)}</bdi><div><h3>${escapeHtml(axis.title)}</h3><p>${escapeHtml(axis.detail)}</p></div></article>`).join("")}</div>
          <div class="draft-module-count"><strong><bdi dir="ltr">12</bdi> core subsystems <span aria-hidden="true">→</span> <bdi dir="ltr">15</bdi> training modules</strong><p>${escapeHtml(overview.quadrotor.moduleCountNote)}</p></div>
          <p class="draft-map-note">${escapeHtml(overview.quadrotor.note)}</p>
        </section>
        <section class="draft-map" aria-labelledby="draft-map-title">
          <div class="draft-section-head"><div><span class="section-kicker">System map</span><h2 id="draft-map-title">Seven domains, two levels of detail</h2></div><p>Each branch represents a function. IDs beneath it link to the relevant modules.</p></div>
          <div class="draft-tree-root"><b>UAV</b><span>Integrated system</span></div>
          <div class="draft-tree-stem" aria-hidden="true"></div>
          <div class="draft-domain-grid">
            ${overview.domains.map(domain => `
              <details class="draft-domain" open>
                <summary><span class="draft-domain-key" aria-hidden="true">${escapeHtml(domain.key)}</span><span class="draft-domain-name"><strong>${escapeHtml(domain.title)}</strong><small>${escapeHtml(domain.label)}</small></span><span class="draft-domain-toggle" aria-hidden="true"></span></summary>
                <div class="draft-branch-list">${domain.branches.map(branch => `
                  <div class="draft-branch"><h3>${escapeHtml(branch.title)}</h3><p>${escapeHtml(branch.detail)}</p><p class="draft-branch-help">${escapeHtml(branch.help)}</p><div class="draft-leaves">${branch.modules.map(moduleButton).join("")}</div></div>`).join("")}</div>
              </details>`).join("")}
          </div>
          <p class="draft-map-note">A module may appear in multiple domains because structural, electrical, thermal, and software decisions are interdependent.</p>
        </section>
        <section class="draft-process" aria-labelledby="draft-process-title">
          <div class="draft-section-head"><div><span class="section-kicker">Design process</span><h2 id="draft-process-title">From needs to a testable prototype</h2></div><p>Select components after requirements, interfaces, and budgets are set, then revise the design from test data.</p></div>
          <ol class="draft-process-grid">${overview.process.map((step, index) => `<li><span class="draft-step-num">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(step.label)}</strong><p class="draft-step-detail">${escapeHtml(step.detail)}</p><div class="draft-step-input"><b>Input</b><span>${escapeHtml(step.input)}</span></div><div class="draft-step-output"><b>Output</b><span>${escapeHtml(step.output)}</span></div></li>`).join("")}</ol>
          <div class="draft-feedback"><span aria-hidden="true">↺</span><p>${escapeHtml(overview.review)}</p></div>
        </section>
        <div class="draft-enter"><p>Open a module from the map or top navigation to review assumptions, open items, and technical details.</p><button type="button" class="module-button primary" id="draft-enter-modules">Start with Module 1</button></div>
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
        <span class="section-kicker">${escapeHtml(item.id)} · Next module</span>
        <h2>${escapeHtml(item.title)}</h2>
        <p>This section is still being prepared. When this stage is complete, it will be added here as an interactive module.</p>
        <nav class="module-navigation" aria-label="Back to previous module">
          <button type="button" class="module-button secondary" id="previous-module">Back to previous module</button>
          <span class="previous-hint">This module's content is not ready yet.</span>
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
          <div class="intro-copy"><span class="section-kicker">Current module definition</span><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.purpose)}</p>
            <div class="covered-topics"><h3>Covered topics</h3><ul>${overviewTopics}</ul></div>
          </div>
          <div class="baseline-grid" aria-label="Initial design baseline">${baseline}</div>
        </section>
        <section class="status-strip" aria-label="Design decision status">
          ${statusCard("Working assumptions", module.assumptions, "working")}
          ${statusCard("Open items", module.openItems, "open")}
          ${statusCard("Critical notes", module.critical, "critical")}
        </section>
        <section class="explorer" aria-labelledby="explorer-title">
          <div class="explorer-heading"><div><span class="section-kicker">Module content</span><h2 id="explorer-title">Open a topic to read the details</h2></div>
            <div class="explorer-tools"><label class="search-box"><span class="sr-only">Search topics</span><input id="topic-search" type="search" placeholder="Search topics…" autocomplete="off"></label>
              <button type="button" id="expand-all">Expand all</button><button type="button" id="collapse-all">Collapse all</button>
            </div>
          </div>
          <div id="topic-groups">${module.groups.map(renderGroup).join("")}</div>
          <p class="empty-search" id="empty-search" hidden>No topics match this search.</p>
        </section>
        <section class="closing-grid">
          <article class="closing-card conclusion"><span>Module summary</span><p>${escapeHtml(module.conclusion)}</p>${module.id === "M01" ? '<bdi class="target-mass" dir="ltr">m<sub>frame</sub> ≈ 300 g</bdi>' : ""}</article>
          <article class="closing-card next-module"><span>Suggested next step</span><p>${escapeHtml(module.next)}</p></article>
        </section>
        <nav class="module-navigation" aria-label="Move between modules">
          <div class="previous-hint">${index > 0 ? "Back to previous module content" : "Back to system overview"}</div>
          <div class="module-nav-buttons"><button type="button" class="module-button secondary" id="previous-module">${index > 0 ? "Previous module" : "Overview"}</button><button type="button" class="module-button primary" id="next-module" ${nextExists ? "" : "disabled"}>Continue to next module</button></div>
        </nav>
      </div>`;

    const search = document.getElementById("topic-search");
    const groups = [...document.querySelectorAll(".topic-group")];
    search.addEventListener("input", () => {
      const query = search.value.trim().toLocaleLowerCase("en");
      let matches = 0;
      groups.forEach(group => {
        const topics = [...group.querySelectorAll(".topic")];
        let groupMatches = 0;
        topics.forEach(topic => {
          const visible = !query || topic.textContent.toLocaleLowerCase("en").includes(query);
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

