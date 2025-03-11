// import { listCategories } from "@lib/data/categories"
// import { listCollections } from "@lib/data/collections"
import { Heading, Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  // const { collections } = await listCollections({
  //   fields: "*products",
  // })
  // const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-10">
          <div className="flex flex-col gap-y-4">
            <Heading level="h2" className="mb-2 uppercase">
              Menu
            </Heading>
            <LocalizedClientLink
              href="/about-us"
              className="text-ui-fg-base hover:text-ui-fg-subtle"
            >
              About Us
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/gallery"
              className="text-ui-fg-base hover:text-ui-fg-subtle"
            >
              Gallery
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="text-ui-fg-base hover:text-ui-fg-subtle"
            >
              Contact
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account"
              className="text-ui-fg-base hover:text-ui-fg-subtle"
            >
              Account
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="text-ui-fg-base hover:text-ui-fg-subtle"
            >
              Store
            </LocalizedClientLink>
          </div>
          <div className="flex flex-col gap-y-4">
            <Heading level="h2" className="mb-2 uppercase">
              Simon Musical Instruments
            </Heading>
            <div className="flex flex-col items-center">
              <Text className="py-1">Phone:</Text>
              <Text className="text-ui-fg-muted">+40 744 960 722</Text>
              <Text className="text-ui-fg-muted">+40 365 100 422 (FAX)</Text>
            </div>
            <div className="flex flex-col items-center">
              <Text className="py-1">Email:</Text>
              <Text className="text-ui-fg-muted">paul.simon@simoninstruments.com</Text>
            </div>
            <div className="flex flex-col items-center">
              <Text className="py-1">Address:</Text>
              <Text className="text-ui-fg-muted">1 Decembrie 1918 street, no. 8</Text>
              <Text className="text-ui-fg-muted">545300 Reghin, ROMANIA</Text>
            </div>
          </div>

          {/* <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-ui-fg-base"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Medusa</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
          </div> */}
          <div className="flex flex-col gap-y-4 items-center">
            <Heading level="h2" className="mb-2 uppercase">
              Workshop
            </Heading>
            <div className="flex flex-row gap-x-2">
              <div className="overflow-hidden">
                <img src="/images/simon-instrumente.jpg" alt="Instrumente" className="transform transition-transform duration-300 hover:scale-110"/>
              </div>
              <div className="overflow-hidden">
                <img src="/images/simon-instrumente-ecaterina-simon.jpg" alt="Instrumente Ecaterina Simon" className="transform transition-transform duration-300 hover:scale-110"/>
              </div>
              <div className="overflow-hidden">
                <img src="/images/simon-instrumente-lacuite.jpg" alt="Instrumente Lacuite" className="transform transition-transform duration-300 hover:scale-110"/>
              </div>
              <div className="overflow-hidden">
                <img src="/images/simon-instrumente-paul-simon.jpg" alt="Instrumente Paul Simon" className="transform transition-transform duration-300 hover:scale-110"/>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-4 justify-center text-ui-fg-muted">
          <Text className="txt-compact-small">
            Simon Musical Instruments 2019 - All Rights Reserved. 
          </Text>
          {/* <MedusaCTA /> */}
        </div>
      </div>
    </footer>
  )
}
