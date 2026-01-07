import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Sidebar structure
 *
 * Keep this intentionally small and predictable:
 * - "Start here" and conventions up top
 * - Runbooks grouped by AWS service
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'conventions',
    'templates/runbook-template',

    {
      type: 'category',
      label: 'AWS',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Route 53',
          link: {type: 'doc', id: 'route53/index'},
          items: ['route53/buy-domain'],
        },
        {
          type: 'category',
          label: 'S3',
          link: {type: 'doc', id: 's3/index'},
          items: ['s3/static-site'],
        },
      ],
    },
    {
      type: 'category',
      label: 'GitHub',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'GitHub Pages',
          link: {type: 'doc', id: 'github-pages/index'},
          items: ['github-pages/static-site-ci-cd'],
        },
      ],
    },

  ],
};

export default sidebars;
