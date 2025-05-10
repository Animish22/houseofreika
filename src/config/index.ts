export const PRODUCT_CATEGORIES = [
  {
    label: 'Tops',
    value: 'tops' as const,
    featured: [
      {
        name: 'Editor picks',
        href: `/products?category=tops`,
        imageSrc: '/nav/ui-kits/mixed.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=tops&sort=desc',
        imageSrc: '/nav/ui-kits/blue.jpg',
      },
      {
        name: 'Bestsellers',
        href: '/products?category=tops',
        imageSrc: '/nav/ui-kits/purple.jpg',
      },
    ],
  },
  {
    label: 'Co-Ords',
    value: 'co-ords' as const,
    featured: [
      {
        name: 'Editor picks',
        href: `/products?category=co-ords`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=co-ords&sort=desc',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Bestsellers',
        href: '/products?category=co-ords',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
  {
    label: 'Dresses',
    value: 'dresses' as const,
    featured: [
      {
        name: 'Editor picks',
        href: `/products?category=dresses`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=dresses&sort=desc',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Bestsellers',
        href: '/products?category=dresses',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
]
