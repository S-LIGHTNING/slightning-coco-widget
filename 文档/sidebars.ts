import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  introductionSidebar: [{type: 'autogenerated', dirName: 'introduction'}],
  tutorialSidebar: [{type: 'autogenerated', dirName: 'tutorial'}],
  exampleSidebar: [{type: 'autogenerated', dirName: 'example'}],
  APISidebar: [{type: 'autogenerated', dirName: 'api'}],
  errorSidebar: [{type: 'autogenerated', dirName: 'error'}],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
