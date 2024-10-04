import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "Jitar",
  description: "Documentation",
  ignoreDeadLinks: [
    // ignore all localhost links
    /^https?:\/\/localhost/
  ],
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/icon.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 3],
    sidebar: [
      {
        text: 'INTRODUCTION',
        items: [
          { text: 'What is Jitar?', link: '/introduction/what-is-jitar' },
          { text: 'Installation', link: '/introduction/installation' },
          { text: 'Quick Start', link: '/introduction/quick-start' }
        ]
      },
      {
        text: 'FUNDAMENTALS',
        items: [
          { text: 'Building blocks', link: '/fundamentals/building-blocks' },
          { text: 'Runtime services', link: '/fundamentals/runtime-services' }
        ]
      },
      {
        text: 'DEVELOP',
        items: [
          { text: 'Application structure', link: '/develop/application-structure' },
          { text: 'Writing functions', link: '/develop/writing-functions' },
          { text: 'Data sharing', link: '/develop/data-sharing' },
          { text: 'Error handling', link: '/develop/error-handling' },
          { text: 'State management', link: '/develop/state-management' },
          { text: 'Data consistency', link: '/develop/data-consistency' },
          { text: 'Set up and tear down', link: '/develop/setup-and-teardown' },
          { text: 'Middleware', link: '/develop/middleware' },
          { text: 'Validation', link: '/develop/validation' },
          { text: 'Security', link: '/develop/security' },
          { text: 'Assets', link: '/develop/assets' },
          { text: 'Debugging', link: '/develop/debugging' }
        ]
      },
      {
        text: 'DEPLOY',
        items: [
          { text: 'Segmentation', link: '/deploy/segmentation' },
          { text: 'Environments', link: '/deploy/environments' },
          { text: 'Load balancing', link: '/deploy/load-balancing' },
          { text: 'Health checks', link: '/deploy/health-checks' },
          { text: 'Runtime settings', link: '/deploy/runtime-settings' }
        ]
      },
      {
        text: 'INTEGRATE',
        items: [
          { text: 'RPC API', link: '/integrate/rpc-api' },
          { text: 'VITE plugin', link: '/integrate/vite-plugin' }
        ]
      },
      {
        text: 'MONITOR',
        items: [
          { text: 'Logging', link: '/monitor/logging' },
          { text: 'Health', link: '/monitor/health' }
        ]
      },
      {
        text: 'GUIDES',
        items: [
          { text: 'Creating a cluster', link: '/guides/creating-a-cluster' },
          { text: 'Add Jitar to an existing project', link: '/guides/add-jitar-to-an-existing-project' },
          { text: 'Migrate away from Jitar', link: '/guides/migrate-away-from-jitar' }
        ]
      },
      {
        text: 'EXAMPLES',
        items: [
          { text: 'Concepts', link: '/examples/concepts' },
          { text: 'Full stack', link: '/examples/full-stack' }
        ]
      },
      {
        text: 'COMMUNITY',
        items: [
          { text: 'Get help', link: '/community/get-help' },
          { text: 'Give feedback', link: '/community/give-feedback' },
          { text: 'Contribute', link: '/community/contribute' }
        ]
      },
      {
        text: 'ABOUT',
        items: [
          { text: 'Our goal', link: '/about/our-goal' },
          { text: 'Our team', link: '/about/our-team' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/Bqwy8azp5R' },
      { icon: 'github', link: 'https://github.com/MaskingTechnology/jitar' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/jitar' }
    ],

    footer: {
      message: 'Jitar is a project by Masking Technology',
      copyright: 'Copyright © 2024 - Masking Technology B.V.'
    }
  }
});
