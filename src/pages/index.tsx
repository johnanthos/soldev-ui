import { NextSeoProps } from 'next-seo';
import DefaultLayout from '@/layouts/default';
import PageHero from '@/components/core/PageHero';

import HomeCategoryCards from '@/components/home/HomeCategoryCards';
import HomeResourceCards from '@/components/home/HomeResourceCards';
import LargeCTACard from '@/components/core/LargeCTACard';
import FeaturedContentCards from '@/components/core/FeaturedContentCards';
import ContentCard from '@/components/core/ContentCard';

import { FEATURED_CONTENT_CARDS } from '@/lib/constants/home';
import { PLAYLIST_KEYS } from '@/lib/constants/playlists';
import { getChangelogRecords, getRecordsFromSlug } from '@/lib/queries';
import { computeImage } from '@/utils/content';

// define the on-page seo metadata
const seo: NextSeoProps = {
  title: undefined,
  description: ''
};

export async function getStaticProps() {
  // init an array of posts to display in the "Latest" section
  const latestPosts: ContentRecord[] = [];

  // fetch all the latest content from each of the major content sections
  const [changelog, coreCommunityCalls, superteamEcosystemCalls, validatorCommunityCalls] =
    await Promise.all([
      await getChangelogRecords(),
      await getRecordsFromSlug(PLAYLIST_KEYS.coreCommunityCalls),
      await getRecordsFromSlug(PLAYLIST_KEYS.superteamEcosystemCalls),
      await getRecordsFromSlug(PLAYLIST_KEYS.validatorCommunityCalls)
    ]);
  // TODO: update API to allow for better filtering and pagination

  // force update the `Url` to be local urls for the desired pages
  changelog[0].Url = `/changelog/${changelog[0].SK}`;
  coreCommunityCalls[0].Url = `/library/playlist/${'core-community-calls'}/${
    coreCommunityCalls[0].SK
  }`;
  superteamEcosystemCalls[0].Url = `/library/playlist/${'superteam-ecosystem-calls'}/${
    superteamEcosystemCalls[0].SK
  }`;
  validatorCommunityCalls[0].Url = `/library/playlist/${'validator-community-discussions'}/${
    validatorCommunityCalls[0].SK
  }`;
  const mikeHaleLastNewsletter = {
    Title: 'Issue #31: GameShift Beta, Breakpoint, and Hyperdrive Hackathon Winners',
    Url: 'https://mikehale.beehiiv.com/p/breakpoint-hyperdrive-gameshift-bigquery',
    Author: 'Mike Hale',
    Description:
      'Breakpoint Recap, Gameshift Beta, Google BigQuery, Hyperdrive Winners, RIP Holaplex',
    Img: 'https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/960f4838-fb68-4070-aa61-1bc1b77ccfc0/gameshift-beta.png'
  } as ContentRecord;

  // NOTE: the order of these will be the order they will be displayed on the page
  latestPosts.push(
    changelog[0],
    superteamEcosystemCalls[0],
    mikeHaleLastNewsletter,
    validatorCommunityCalls[0]
  );

  return {
    props: {
      latestPosts
    },
    revalidate: 300
  };
}

type PageProps = {
  latestPosts: ContentRecord[];
};

export default function Page({ latestPosts }: PageProps) {
  return (
    <DefaultLayout seo={seo}>
      <PageHero className="mb:py-20 container mb-16 py-20" heroSize="lg">
        {/*<AnnauncementBanner />*/}

        <h1>
          Your <span className="gradient-solana">Solana</span> homepage
        </h1>

        <p className="max-w-lg text-lg md:text-xl">
          Stay up-to-date with the latest updates, learning, and happenings in the Solana ecosystem.
        </p>
      </PageHero>

      <section className="space-y-8 py-8">
        <HomeCategoryCards className="-mt-24" />

        <FeaturedContentCards title="Latest" className="lg:grid-cols-5">
          {latestPosts.length > 0 &&
            latestPosts.map((post, id: number) => (
              <ContentCard
                key={id}
                className="w-72 max-w-[70%] lg:max-w-full"
                href={post.Url}
                title={post.Title}
                authorLabel={post.Author}
                imageSrc={computeImage(post)}
                description={post.Description}
              />
            ))}
        </FeaturedContentCards>

        <LargeCTACard
          title="Ironforge"
          text="Accelerate your Solana development."
          ctaLabel="Get Started!"
          ctaHref="https://www.ironforge.cloud"
        />

        <FeaturedContentCards title="Featured">
          {FEATURED_CONTENT_CARDS.map((item, id) => (
            <ContentCard
              key={id}
              className="w-72 max-w-[70%] lg:max-w-full"
              href={item.href}
              title={item.title}
              authorLabel={item.authorLabel}
              imageSrc={item.imageSrc}
              description={item.description}
            />
          ))}
        </FeaturedContentCards>

        <HomeResourceCards className="" />
      </section>
    </DefaultLayout>
  );
}
