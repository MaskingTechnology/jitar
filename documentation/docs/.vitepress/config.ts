import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  lang: 'en-US',
  title: "Jitar",
  description: "Documentation",
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
          { text: 'Overview', link: '/fundamentals/overview' },
          { text: 'Runtime services', link: '/fundamentals/runtime-services' }
        ]
      },
      {
        text: 'DEVELOP',
        items: [
          { text: 'Application structure', link: '/develop/application-structure' },
          { text: 'Writing functions', link: '/develop/writing-functions' },
          { text: 'Creating segments', link: '/develop/creating-segments' },
          { text: 'Data sharing', link: '/develop/data-sharing' },
          { text: 'Error handling', link: '/develop/error-handling' },
          { text: 'State management', link: '/develop/state-management' },
          { text: 'Data consistency', link: '/develop/data-consistency' },
          { text: 'Middleware', link: '/develop/middleware' },
          { text: 'Validation', link: '/develop/validation' },
          { text: 'Security', link: '/develop/security' },
          { text: 'Assets', link: '/develop/assets' },
          { text: 'Debugging', link: '/develop/debugging' },
          { text: 'Integration', link: '/develop/integration' }
        ]
      },
      {
        text: 'DEPLOY',
        items: [
          { text: 'Segmentation', link: '/deploy/segmentation' },
          { text: 'Customization', link: '/deploy/customization' },
          { text: 'Environments', link: '/deploy/environments' },
          { text: 'Load balancing', link: '/deploy/load-balancing' },
          { text: 'Health checks', link: '/deploy/health-checks' },
          { text: 'CORS', link: '/deploy/cors' }
        ]
      },
      {
        text: 'MONITOR',
        items: [
          { text: 'Logging', link: '/monitor/logging' },
          { text: 'Health', link: '/monitor/health' },
          { text: 'Nodes', link: '/monitor/nodes' },
          { text: 'Procedures', link: '/monitor/procedures' }
        ]
      },
      {
        text: 'EXAMPLES',
        items: [
          { text: 'Concepts', link: '/examples/concepts' },
          { text: 'Apps', link: '/examples/apps' }
        ]
      },
      {
        text: 'GUIDES',
        items: [
          { text: 'Build a full-stack app', link: '/guides/build-a-full-stack-app' },
          { text: 'Build for scale', link: '/guides/build-for-scale' },
          { text: 'Integration with other apps', link: '/guides/integration-with-other-apps' },
          { text: 'Dynamically switch version', link: '/guides/dynamically-switch-version' },
          { text: 'Creating a cluster', link: '/guides/creating-a-cluster' },
          { text: 'Add Jitar to an existing project', link: '/guides/add-jitar-to-an-existing-project' },
          { text: 'Migrate away from Jitar', link: '/guides/migrate-away-from-jitar' }
        ]
      },
      {
        text: 'LEFTOVERS',
        items: [
          { text: 'REST API\s', link: '/leftovers/rest-apis' },
          { text: 'Caching', link: '/leftovers/caching' }
        ]
      },
      {
        text: 'COMPARIZATIONS',
        items: [
          { text: 'Jitar vs. Meteor', link: '/comparizations/jitar-vs-meteor' },
          { text: 'Jitar vs. tRPC', link: '/comparizations/jitar-vs-trpc' },
          { text: 'Jitar vs. Service Weaver', link: '/comparizations/jitar-vs-service-weaver' },
          { text: 'Jitar vs. Next.js', link: '/comparizations/jitar-vs-nextjs' }
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
      { icon: 'github', link: 'https://github.com/MaskingTechnology/jitar' },
      { icon: 'discord', link: 'https://discord.gg/Bqwy8azp5R' }
    ],

    footer: {
      message: 'Jitar is a project by Masking Technology',
      copyright: 'Copyright © 2023 - Masking Technology B.V.'
    }
  }
})
