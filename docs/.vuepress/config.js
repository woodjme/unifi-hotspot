


import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  title: "Unifi Hotspot",
  base: "/",
  lang: "en-GB",
  bundler: viteBundler(),
  theme: defaultTheme({
    sidebarDepth: 5,
  })
})

