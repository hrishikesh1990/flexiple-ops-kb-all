import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Flexiple": "https://flexiple.com",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        // Sort folders and files by their name (which includes number prefix)
        // This ensures A-Foundation < B-Process-SOPs and 01-xxx < 02-xxx
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()

        // Folders first, then files
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1

        // Both same type — sort by name (alphabetical works because of number/letter prefixes)
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      },
      mapFn: (node) => {
        // Clean up display names for the explorer sidebar
        const name = node.displayName

        // Folder names: "A-Foundation" → "A — Foundation"
        const folderMatch = name.match(/^([A-F])-(.+)$/)
        if (folderMatch) {
          const letter = folderMatch[1]
          const rest = folderMatch[2]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
          node.displayName = `${letter} — ${rest}`
        }

        // File names: "01-company-overview" → "Company Overview"
        const fileMatch = name.match(/^\d{2}-(.+)$/)
        if (fileMatch) {
          node.displayName = fileMatch[1]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
        }
      },
      order: ["filter", "sort", "map"],
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      },
      mapFn: (node) => {
        const name = node.displayName
        const folderMatch = name.match(/^([A-F])-(.+)$/)
        if (folderMatch) {
          const letter = folderMatch[1]
          const rest = folderMatch[2]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
          node.displayName = `${letter} — ${rest}`
        }
        const fileMatch = name.match(/^\d{2}-(.+)$/)
        if (fileMatch) {
          node.displayName = fileMatch[1]
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
        }
      },
      order: ["filter", "sort", "map"],
    }),
  ],
  right: [],
}
