import Image from 'next/image';

export function HeaderBanner() {
  return (
    <section className="home-hero-banner" aria-label="WCB promotional banner">
      <div className="home-hero-banner-frame">
        <Image
          src="/banner.jpg"
          alt="WCB promotional banner"
          width={1760}
          height={576}
          priority
          sizes="(max-width: 960px) 92vw, 928px"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </section>
  );
}
