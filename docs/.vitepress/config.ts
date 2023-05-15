import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  lang: 'en-US',
  title: "Jitar",
  description: "Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Docs', link: 'introduction/what-is-jitar' }
    ],
    outline: [2, 3],
    sidebar: [
      {
        text: 'INTRODUCTION',
        items: [
          { text: 'What is Jitar?', link: 'introduction/what-is-jitar' },
          { text: 'Installation', link: 'introduction/installation' },
          { text: 'Quick Start', link: 'introduction/quick-start' }
        ]
      },
      {
        text: 'FUNDAMENTALS',
        items: [
          { text: 'Overview', link: 'fundamentals/overview' },
          { text: 'Runtime services', link: 'fundamentals/runtime-services' }
        ]
      },
      {
        text: 'DEVELOP',
        items: [
          { text: 'Application structure', link: 'develop/application-structure' },
          { text: 'Writing functions', link: 'develop/writing-functions' },
          { text: 'Data sharing', link: 'develop/data-sharing' },
          { text: 'State management', link: 'develop/state-management' },
          { text: 'Data consistency', link: 'develop/data-consistency' },
          { text: 'Error handling', link: 'develop/error-handling' },
          { text: 'Middleware', link: 'develop/middleware' },
          { text: 'Validation', link: 'develop/validation' },
          { text: 'Security', link: 'develop/security' },
          { text: 'Assets', link: 'develop/assets' },
          { text: 'Debugging', link: 'develop/debugging' },
          { text: 'Integration', link: 'develop/integration' }
        ]
      },
      {
        text: 'DEPLOY',
        items: [
          { text: 'Segmentation', link: 'deploy/segmentation' },
          { text: 'Customization', link: 'deploy/customization' },
          { text: 'Environments', link: 'deploy/environments' },
          { text: 'Load balancing', link: 'deploy/load-balancing' },
          { text: 'Health checks', link: 'deploy/health-checks' },
          { text: 'CORS', link: 'deploy/cors' }
        ]
      },
      {
        text: 'MONITOR',
        items: [
          { text: 'Logging', link: 'monitor/logging' },
          { text: 'Health', link: 'monitor/health' },
          { text: 'Nodes', link: 'monitor/nodes' },
          { text: 'Procedures', link: 'monitor/procedures' }
        ]
      },
      {
        text: 'EXAMPLES',
        items: [
          { text: 'Concepts', link: 'examples/concepts' },
          { text: 'Apps', link: 'examples/apps' }
        ]
      },
      {
        text: 'TUTORIALS',
      },
      {
        text: 'LEFTOVERS',
      },
      {
        text: 'COMPARIZATIONS',
      },
      {
        text: 'COMMUNITY',
      },
      {
        text: 'ABOUT',
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MaskingTechnology/jitar' },
      { icon: 'discord', link: 'https://discord.gg/Bqwy8azp5R' }
    ],

    footer: {
      message: 'Jitar is a project by Masking Technology',
      copyright: 'Copyright © 2023 - Masking Technology B.V.'
    }
  }
})
