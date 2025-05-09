import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
  ShoppingBag, // Example Icon for products
} from 'lucide-react'
import Link from 'next/link'

const perks = [
  {
    name: 'Instant Delivery',
    Icon: ArrowDownToLine,
    description:
      'Get your items delivered to your email in seconds and download them right away.', // Adjusted for physical/digital flexibility
  },
  {
    name: 'Guaranteed Quality',
    Icon: CheckCircle,
    description:
      'Every item on HouseOfReika is verified by our team to ensure our highest quality standards. Not happy? We offer a 30-day refund guarantee.',
  },
  {
    name: 'Curated Collections', // Changed from "For the Planet" to something more e-commerce relevant
    Icon: ShoppingBag, // Changed icon
    description:
      "Discover unique and high-quality products curated just for you. We're passionate about style and quality.",
  },
]

export default function Home() {
  return (
    <>
      {/* Video Background Section */}
      <section className='video-background-section'>
        <video autoPlay loop muted playsInline> 
          <source src="/videos/test-video.mp4" type="video/mp4" /> */
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div> {/* Optional dark overlay */}
        <MaxWidthWrapper className='relative z-10 h-full flex flex-col justify-center'>
          <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl'>
            <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl'> {/* Text white for video bg */}
              HouseOfReika: Your destination for{' '}
              <span className='text-primary'> {/* Use primary color (Cherry Red) */}
                exclusive style
              </span>
              .
            </h1>
            <p className='mt-6 text-lg max-w-prose text-gray-200'> {/* Lighter text for video bg */}
              Welcome to HouseOfReika. Every item on our
              platform is selected to ensure the
              highest quality and unique appeal.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 mt-6'>
              <Link
                href='/products'
                className={buttonVariants({ variant: "default", size: "lg" })}> {/* Default will be cherry red */}
                Browse Trending
              </Link>
              <Button variant='outline' size='lg' className="text-black border-white hover:bg-white hover:text-black"> {/* Custom outline for video bg */}
                Our quality promise &rarr;
              </Button>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <MaxWidthWrapper>
        {/* Product Reel Section - This will be below the video hero */}
        <ProductReel
          query={{ sort: 'desc', limit: 4 }}
          href='/products?sort=recent'
          title='Brand New Arrivals'
        />
      </MaxWidthWrapper>

      {/* Perks Section - Background will be white by default now */}
      <section className='border-t border-border bg-background'> {/* Use CSS variables for border and bg */}
        <MaxWidthWrapper className='py-20'>
          <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
            {perks.map((perk) => (
              <div
                key={perk.name}
                className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
                <div className='md:flex-shrink-0 flex justify-center'>
                  <div className='h-16 w-16 flex items-center justify-center rounded-full bg-secondary text-primary'> {/* Secondary bg, Primary icon color */}
                    {<perk.Icon className='w-1/2 h-1/2' />} {/* Adjusted icon size for visibility */}
                  </div>
                </div>

                <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                  <h3 className='text-base font-medium text-foreground'> {/* Use foreground color */}
                    {perk.name}
                  </h3>
                  <p className='mt-3 text-sm text-muted-foreground'> {/* Use muted-foreground */}
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  )
}