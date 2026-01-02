import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/**
 * Docusaurus v3 configuration for the Cloud How-To knowledge base.
 */
const config: Config = {
  title: 'Cloud How-To',
  tagline: 'Mini runbooks for AWS & cloud tasks',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages deployment settings
  url: 'https://tanmayj-hub.github.io',
  baseUrl: '/cloud-how-to-v2/',
  organizationName: 'tanmayj-hub',
  projectName: 'cloud-how-to-v2',

  // Allow drafts / missing links during early authoring
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/tanmayj-hub/cloud-how-to-v2/blob/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    navbar: {
      title: 'Cloud How-To',
      logo: {
        alt: 'Cloud How-To Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/docs/intro', label: 'Start here', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Runbooks',
        },
        {
          href: 'https://github.com/tanmayj-hub/cloud-how-to-v2',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Start',
          items: [
            {label: 'Start here', to: '/docs/intro'},
            {label: 'Docs conventions', to: '/docs/conventions'},
            {label: 'Runbook template', to: '/docs/templates/runbook-template'},
          ],
        },
        {
          title: 'AWS',
          items: [
            {label: 'Route 53', to: '/docs/route53'},
            {label: 'S3', to: '/docs/s3'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/tanmayj-hub/cloud-how-to-v2'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Cloud How-To. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
