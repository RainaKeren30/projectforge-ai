// Main application controller for ProjectForge AI

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize background elements
  if (window.PF_Particles) {
    window.PF_Particles.initParticles();
  }
  if (window.PF_Hero3D) {
    window.PF_Hero3D.initHero3D();
  }

  // References to global components
  const Audio = window.PF_Audio;
  const Generator = window.PF_Generator;
  const Visualizer = window.PF_Visualizer;

  let activeBlueprint = null; // Store current generated blueprint object

  // --- AUDIO INTERACTION BINDINGS ---
  // Any interactions that hover or click should trigger audio
  function addAudioListeners() {
    // Hover listeners
    document.querySelectorAll('.btn, .select-card, .tech-tag, .timeline-btn, .tree-node-title, .roadmap-node-content, .color-swatch, #theme-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (Audio) Audio.playHover();
      });
    });
    // Click listeners
    document.querySelectorAll('.btn, .select-card, .tech-tag, .timeline-btn, #theme-toggle').forEach(el => {
      el.addEventListener('click', () => {
        if (Audio) Audio.playClick();
      });
    });
  }
  addAudioListeners();

  // --- DOMAIN SELECTOR CARDS ---
  const domainCards = document.querySelectorAll('.select-card');
  let selectedDomain = 'saas';

  domainCards.forEach(card => {
    card.addEventListener('click', () => {
      domainCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedDomain = card.getAttribute('data-domain');
      
      // Auto toggle stack options based on domain choice to feel smart
      adjustStackForDomain(selectedDomain);
    });
  });

  function adjustStackForDomain(domain) {
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
      const tech = tag.getAttribute('data-tech');
      if (domain === 'ai' && ['Python', 'Redis', 'WebGL'].includes(tech)) {
        tag.classList.add('active');
      } else if (domain === 'web3' && ['Solidity', 'React', 'Three.js'].includes(tech)) {
        tag.classList.add('active');
      } else if (domain === 'saas' && ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS'].includes(tech)) {
        tag.classList.add('active');
      } else if (domain === 'mobile' && ['React', 'Node.js', 'Redis'].includes(tech)) {
        tag.classList.add('active');
      }
    });
  }

  // --- EXPERIENCE SLIDER INTERACTION ---
  const rangeInput = document.getElementById('experience-range');
  const expLabels = document.querySelectorAll('.exp-labels span');
  let selectedExperience = 'pro';

  rangeInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    expLabels.forEach(lbl => lbl.classList.remove('active'));
    
    if (val === 1) {
      document.querySelector('.exp-labels span[data-val="1"]').classList.add('active');
      selectedExperience = 'novice';
    } else if (val === 2) {
      document.querySelector('.exp-labels span[data-val="2"]').classList.add('active');
      selectedExperience = 'pro';
    } else {
      document.querySelector('.exp-labels span[data-val="3"]').classList.add('active');
      selectedExperience = 'enterprise';
    }
  });

  expLabels.forEach(label => {
    label.addEventListener('click', () => {
      const val = parseInt(label.getAttribute('data-val'));
      rangeInput.value = val;
      expLabels.forEach(lbl => lbl.classList.remove('active'));
      label.classList.add('active');
      selectedExperience = val === 1 ? 'novice' : val === 2 ? 'pro' : 'enterprise';
    });
  });

  // --- TIMELINE SELECTION ---
  const timelineBtns = document.querySelectorAll('.timeline-btn');
  let selectedTimeline = '1m';

  timelineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timelineBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimeline = btn.getAttribute('data-val');
    });
  });

  // --- TECH TAGS MULTI-SELECT ---
  const techTags = document.querySelectorAll('.tech-tag');
  techTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  // --- THEME SWAPPER ---
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  const sunIcon = themeToggle.querySelector('.sun-icon');

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'light') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }

    // Trigger theme update in other elements
    window.dispatchEvent(new CustomEvent('theme-changed'));
  });

  // --- FORGE ACTION / CINEMATIC LOADING ---
  const forgeTrigger = document.getElementById('forge-trigger');
  const ideaTextarea = document.getElementById('project-idea');
  const loaderOverlay = document.getElementById('loading-overlay');
  const consoleLogTerminal = document.getElementById('terminal-console');

  forgeTrigger.addEventListener('click', () => {
    const ideaText = ideaTextarea.value.trim();
    if (!ideaText) {
      ideaTextarea.focus();
      ideaTextarea.placeholder = "Please enter your project vision here to initiate forge core...";
      return;
    }

    // Gather active tech stack options
    const activeTech = [];
    document.querySelectorAll('.tech-tag.active').forEach(tag => {
      activeTech.push(tag.getAttribute('data-tech'));
    });

    if (activeTech.length === 0) {
      alert("Please select at least one technology layer.");
      return;
    }

    // Start Audio Swell
    if (Audio) Audio.playSwell();

    // Trigger Overlay
    loaderOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling during loader
    consoleLogTerminal.innerHTML = ''; // Reset terminal logs

    // Log message sequence
    const sequences = [
      { text: `[CORE] Initializing Forge Neural core components...`, time: 200 },
      { text: `[PARAM] Ingesting parameters: Domain: ${selectedDomain.toUpperCase()}, Experience: ${selectedExperience.toUpperCase()}, Timeline: ${selectedTimeline}`, time: 700 },
      { text: `[RESOLVE] Mapping connections for technology stack: ${activeTech.join(', ')}`, time: 1300 },
      { text: `[SYNTH] Modeling folder structures & development blueprint schedules...`, time: 1900 },
      { text: `[TOPOLOGY] Synthesizing WebGL architecture coordinates...`, time: 2400 },
      { text: `[COMPLETE] Engine compilation complete. Formatting dashboard logs.`, time: 2900 }
    ];

    sequences.forEach((seq) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        const now = new Date();
        timestamp.textContent = `[${now.toTimeString().split(' ')[0]}]`;
        
        const content = document.createElement('span');
        content.textContent = seq.text;
        
        line.appendChild(timestamp);
        line.appendChild(content);
        
        if (seq.text.includes('[COMPLETE]')) {
          line.classList.add('success');
        }
        
        consoleLogTerminal.appendChild(line);
        consoleLogTerminal.scrollTop = consoleLogTerminal.scrollHeight;
      }, seq.time);
    });

    // Hydrate & transition dashboard
    setTimeout(() => {
      // 1. Generate payload
      if (Generator) {
        activeBlueprint = Generator.generateBlueprint(
          selectedDomain,
          selectedExperience,
          selectedTimeline,
          activeTech,
          ideaText
        );
      }

      // 2. Hydrate UI elements
      if (activeBlueprint) {
        hydrateDashboard(activeBlueprint);
      }

      // Play chime
      if (Audio) Audio.playSuccess();

      // Hide Loader & Unlock Scroll
      loaderOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';

      // Show Dashboard Section
      const dashboard = document.getElementById('dashboard-anchor');
      dashboard.classList.add('active');
      
      // Update Navigation Link
      const navLink = document.getElementById('nav-dashboard-link');
      navLink.style.display = 'block';
      
      // Scroll to dashboard
      dashboard.scrollIntoView({ behavior: 'smooth' });

      // Trigger re-binding of hover audio listeners for newly generated items
      addAudioListeners();

      // Stagger entrance reveals
      triggerDashboardReveal();

    }, 3200);

  });

  // --- DASHBOARD HYDRATION UTILITIES ---
  function hydrateDashboard(blueprint) {
    document.getElementById('result-project-name').textContent = blueprint.projectName;
    document.getElementById('result-project-overview').textContent = blueprint.overview;
    document.getElementById('result-complexity').textContent = blueprint.complexity;
    document.getElementById('result-summary').textContent = blueprint.overview;

    // Set stats
    document.getElementById('stat-hours').textContent = blueprint.effortHours;
    document.getElementById('stat-complexity').textContent = blueprint.complexity.split(' ')[0];
    document.getElementById('stat-tech-count').textContent = blueprint.techCount;

    // Badges list
    const badgeContainer = document.getElementById('result-tech-badges');
    badgeContainer.innerHTML = '';
    const activeTech = [];
    document.querySelectorAll('.tech-tag.active').forEach(tag => {
      activeTech.push(tag.getAttribute('data-tech'));
    });
    activeTech.forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'result-tech-badge';
      badge.textContent = tech;
      badge.style.borderColor = 'var(--color-persian-blue)';
      badge.style.color = 'var(--color-lavender)';
      badgeContainer.appendChild(badge);
    });

    // Features
    const featuresList = document.getElementById('result-features');
    featuresList.innerHTML = '';
    blueprint.features.forEach(feat => {
      const item = document.createElement('div');
      item.className = 'feature-item';
      item.innerHTML = `
        <div class="feature-title">
          <i data-lucide="shield-check"></i>
          ${feat.title}
        </div>
        <p class="feature-desc">${feat.desc}</p>
      `;
      featuresList.appendChild(item);
    });

    // Folder structure recursive rendering
    const folderContainer = document.getElementById('result-folder-tree');
    folderContainer.innerHTML = '';
    folderContainer.appendChild(createFolderTreeDom(blueprint.folderTree));

    // UI Swatches
    const paletteContainer = document.getElementById('result-ui-palette');
    paletteContainer.innerHTML = '';
    const swatches = [
      { color: '#450C3F', label: 'Violet' },
      { color: '#4D3EA3', label: 'Persian' },
      { color: '#758AD1', label: 'Glaucous' },
      { color: '#E1DAFB', label: 'Lavender' },
      { color: '#FFD2F4', label: 'Frost' }
    ];
    swatches.forEach(sw => {
      const el = document.createElement('div');
      el.className = 'color-swatch';
      el.style.backgroundColor = sw.color;
      el.innerHTML = `<span>${sw.color}</span>`;
      el.title = `${sw.label} swatches`;
      paletteContainer.appendChild(el);
    });

    // UI suggestions
    document.getElementById('result-ui-layout').textContent = blueprint.uiMoodboard.layout;
    document.getElementById('result-ui-fonts').textContent = blueprint.uiMoodboard.typography;

    // Roadmap items
    const roadmapContainer = document.getElementById('result-roadmap');
    roadmapContainer.innerHTML = '';
    blueprint.roadmap.forEach((step, idx) => {
      const node = document.createElement('div');
      node.className = `roadmap-node ${idx === 0 ? 'active' : ''}`;
      node.innerHTML = `
        <div class="roadmap-node-content">
          <div class="roadmap-phase">${step.phase}</div>
          <div class="roadmap-title">${step.title}</div>
          <div class="roadmap-desc">${step.desc}</div>
        </div>
      `;
      // Click node to activate
      node.addEventListener('click', () => {
        document.querySelectorAll('.roadmap-node').forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        if (Audio) Audio.playClick();
      });
      roadmapContainer.appendChild(node);
    });

    // Architecture summary
    document.getElementById('result-architecture-desc').textContent = blueprint.architecture;

    // Initialize 3D Network Graph Canvas
    const container3D = document.getElementById('blueprint-visual-container');
    const canvas3D = document.getElementById('blueprint-canvas');
    if (Visualizer && container3D && canvas3D) {
      // Re-trigger layout mount with delay to allow viewport offsets to render correct container sizing
      setTimeout(() => {
        Visualizer.render3DBlueprint(container3D, canvas3D, blueprint.networkGraph);
      }, 500);
    }

    // Refresh icons inside dynamically loaded tags
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Recursive folder tree builder
  function createFolderTreeDom(node) {
    const el = document.createElement('div');
    el.className = `tree-node ${node.type}`;
    
    const title = document.createElement('div');
    title.className = 'tree-node-title';
    
    // Add fold/unfold chevron for folder node
    if (node.type === 'folder') {
      const chevron = document.createElement('i');
      chevron.setAttribute('data-lucide', 'chevron-right');
      chevron.className = 'chevron-icon';
      title.appendChild(chevron);
      
      const folderIcon = document.createElement('i');
      folderIcon.setAttribute('data-lucide', 'folder');
      folderIcon.className = 'folder-icon';
      title.appendChild(folderIcon);
    } else {
      const docIcon = document.createElement('i');
      docIcon.setAttribute('data-lucide', 'file-text');
      title.appendChild(docIcon);
    }
    
    const label = document.createElement('span');
    label.textContent = node.name;
    title.appendChild(label);
    el.appendChild(title);

    // Render children recursively
    if (node.type === 'folder' && node.children) {
      const childrenWrapper = document.createElement('div');
      childrenWrapper.className = 'tree-node-children';
      node.children.forEach(child => {
        childrenWrapper.appendChild(createFolderTreeDom(child));
      });
      el.appendChild(childrenWrapper);
      
      // Expand click triggers
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        el.classList.toggle('expanded');
        if (Audio) Audio.playClick();
      });
    }
    
    return el;
  }

  // --- REVEAL EFFECTS (SCROLL REVEAL) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-element').forEach(el => {
    revealObserver.observe(el);
  });

  // Stagger entry inside the dashboard items
  function triggerDashboardReveal() {
    document.querySelectorAll('.dashboard-grid .glass-card').forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, idx * 120);
    });
  }

  // Header scroll backdrop effect
  window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- EXPORT PANEL FUNCTIONS ---
  const copyBtn = document.getElementById('export-copy-btn');
  const downloadBtn = document.getElementById('export-download-btn');
  const restartBtn = document.getElementById('forge-restart-btn');

  // Copy blueprint JSON configuration payload to clipboard
  copyBtn.addEventListener('click', () => {
    if (!activeBlueprint) return;
    
    const payload = JSON.stringify(activeBlueprint, null, 2);
    navigator.clipboard.writeText(payload).then(() => {
      const baseText = copyBtn.innerHTML;
      copyBtn.innerHTML = `<i data-lucide="check" style="color: var(--color-petal-frost);"></i> Payload Copied!`;
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        copyBtn.innerHTML = baseText;
        if (window.lucide) window.lucide.createIcons();
      }, 2000);
    }).catch(err => {
      console.error('Copy failed', err);
    });
  });

  // Download markdown document file
  downloadBtn.addEventListener('click', () => {
    if (!activeBlueprint) return;

    // Build standard structure document layout
    let md = `# ${activeBlueprint.projectName} - Project Blueprint\n\n`;
    md += `Generated by ProjectForge AI on ${new Date().toLocaleDateString()}\n`;
    md += `Experience Target: ${activeBlueprint.complexity} | Estimated Timeline: ${selectedTimeline}\n\n`;
    md += `## Overview\n${activeBlueprint.overview}\n\n`;
    md += `## Target Metrics\n`;
    md += `- Complexity Level: ${activeBlueprint.complexity}\n`;
    md += `- Estimated Development effort: ${activeBlueprint.effortHours}\n\n`;
    
    md += `## System Architecture Topology\n`;
    md += `${activeBlueprint.architecture}\n\n`;
    
    md += `## Key Features\n`;
    activeBlueprint.features.forEach(feat => {
      md += `### ${feat.title}\n${feat.desc}\n\n`;
    });
    
    md += `## UI Aesthetic Specifications\n`;
    md += `- Color Swatches: Violet, Persian Blue, Glaucous, Lavender, Petal Frost\n`;
    md += `- Dashboard Layout style: ${activeBlueprint.uiMoodboard.layout}\n`;
    md += `- Typography hierarchy: ${activeBlueprint.uiMoodboard.typography}\n\n`;

    md += `## Workspace Folder Structure Tree\n\n`;
    md += '```\n';
    
    // Quick helper to draw folder tree in text format
    function serializeTree(node, depth = 0) {
      let space = '  '.repeat(depth);
      let branch = node.type === 'folder' ? '📁 ' : '📄 ';
      let text = `${space}${branch}${node.name}\n`;
      if (node.children) {
        node.children.forEach(c => {
          text += serializeTree(c, depth + 1);
        });
      }
      return text;
    }
    
    md += serializeTree(activeBlueprint.folderTree);
    md += '```\n\n';

    md += `## Development Roadmap Milestones\n\n`;
    activeBlueprint.roadmap.forEach(step => {
      md += `### ${step.phase}: ${step.title}\n${step.desc}\n\n`;
    });

    md += `## Deployment Guidance\n`;
    md += `Frontend application stacks compiled as static layers will deploy directly on CDN edges, while backend API microservices launch inside containerized nodes (AWS ECS / Docker / Vercel Edge) connected to PostgreSQL and memory caching instances (Redis). Continuous Integration (CI/CD) pipelines push updates through automated tests before launch.\n`;

    // Download buffer payload trigger
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ProjectForge-Blueprint-${activeBlueprint.projectName}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Reset form and UI view to forge deck
  restartBtn.addEventListener('click', () => {
    // Clear textarea
    ideaTextarea.value = '';
    
    // Hide dashboard
    document.getElementById('dashboard-anchor').classList.remove('active');
    document.getElementById('nav-dashboard-link').style.display = 'none';

    // Clear WebGL blueprint visuals to release assets
    if (Visualizer) {
      Visualizer.cleanup3D();
    }
    activeBlueprint = null;

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
