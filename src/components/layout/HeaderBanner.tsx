import Image from 'next/image';

export function HeaderBanner() {
  return (
    <section className="site-header-banner" aria-label="WCB banner">
      <div className="site-header-banner-frame">
        <Image
          src="/banner.jpg"
          alt="WCB promotional banner"
          width={1760}
          height={576}
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
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
