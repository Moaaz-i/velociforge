import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "⚡ VelociForge Engine",
  description: "Next-Generation Virtualized Package Engine & Sub-Millisecond CI Restorer for Node.js",
  base: '/velociforge/',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '⚡ VelociForge Engine',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'CLI Reference', link: '/cli/reference' },
      { text: 'Benchmarks', link: '/guide/benchmarks' },
      { text: 'GitHub', link: 'https://github.com/Moaaz-i/velociforge' }
    ],
    sidebar: [
      {
        text: '🚀 Getting Started',
        items: [
          { text: 'Installation & Quickstart', link: '/guide/getting-started' },
          { text: 'Speed Benchmarks', link: '/guide/benchmarks' }
        ]
      },
      {
        text: '🛠️ Core Features',
        items: [
          { text: 'Ephemeral Runner (vforge run)', link: '/guide/ephemeral-runner' },
          { text: 'Security & SBOM Audit', link: '/guide/security-audit' },
          { text: 'Monorepo Guide', link: '/guide/monorepo-guide' },
          { text: 'Docker & CI/CD Setup', link: '/guide/docker-cicd' },
          { text: 'Troubleshooting & Doctor', link: '/guide/troubleshooting' }
        ]
      },
      {
        text: '📖 Reference',
        items: [
          { text: 'Complete CLI Reference', link: '/cli/reference' }
        ]
      }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 VelociForge Engine (vforge)'
    }
  }
})
