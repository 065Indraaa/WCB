import Image from 'next/image';

export function HeaderBanner() {
  return (
    <div className="home-billboard-banner">
      <div className="home-billboard-frame">
        <Image
          src="/banner.jpg"
          alt="WCB promotional banner"
          width={1760}
          height={576}
          sizes="(max-width: 1180px) 92vw, 1120px"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
