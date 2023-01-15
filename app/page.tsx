import { get } from '@vercel/edge-config'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic',
  runtime = 'edge'

function LinkCard({
  href,
  title,
  image,
}: {
  href: string
  title: string
  image?: string
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center w-full max-w-3xl p-1 mb-3 transition-all bg-gray-100 rounded-md hover:scale-105'
    >
      <div className='flex w-full text-center'>
        <div className='w-10 h-10'>
          {image && (
            <Image
              className='rounded-sm'
              alt={title}
              src={image}
              width={40}
              height={40}
            />
          )}
        </div>
        <h2 className='flex items-center justify-center w-full -ml-10 font-semibold text-gray-700'>
          {title}
        </h2>
      </div>
    </a>
  )
}

interface Data {
  name: string
  description?: string
  avatar: string
  links: Link[]
  socials: Social[]
}

interface Link {
  href: string
  title: string
  image?: string
}

interface Social {
  href: string
  title: string
}

export default async function HomePage() {
  const data: Data | undefined = await get('linktree')

  if (!data) {
    // not working yet https://github.com/vercel/next.js/issues/44232
    redirect('https://linktr.ee/selenagomez')
  }

  return (
    <div className='flex flex-col items-center justify-center w-full px-8 mx-auto mt-16'>
      <Image
        priority
        className='rounded-full'
        alt={data.name}
        src={data.avatar}
        width={96}
        height={96}
      />
      <h1 className='mt-4 text-xl font-bold text-white'>{data.name}</h1>
      <h2 className='mb-8 font-semibold text-gray-300'>{data.description}</h2>
      {data.links.map((link) => (
        <LinkCard key={link.href} {...link} />
      ))}
      <div className='flex items-center gap-4 mt-8 text-white'>
        {data.socials.map((social) => (
          <a
            aria-label={`${social.title} link`}
            key={social.href}
            href={social.href}
            target='_blank'
            rel='noopener noreferrer'
          >
            {social.href.includes('twitter') ? (
              <img
                height='24'
                width='24'
                src='https://cdn.simpleicons.org/twitter/F3F4F6'
              />
            ) : social.href.includes('github') ? (
              <img
                height='24'
                width='24'
                src='https://cdn.simpleicons.org/github/F3F4F6'
              />
            ) : social.href.includes('linkedin') ? (
              <img
                height='24'
                width='24'
                src='https://cdn.simpleicons.org/linkedin/F3F4F6'
              />
            ) : null}
          </a>
        ))}
      </div>
    </div>
  )
}
