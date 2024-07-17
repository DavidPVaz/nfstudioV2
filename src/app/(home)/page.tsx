const MOBILE = [
    '4Hcgkw4tB33VJTtu9pPPev/b22e64dc307372246bd1bb469dc86c15/mobile1.webp',
    'UiYw4zq8F8m1Pdi1aQR8D/ebb2aa5943afd9fc544c7edfe86811f0/mobile2.webp',
    '7sXjNFohzJQy0k5RmzID9a/af1f465f0510d297efdbf8c7bb0319ba/mobile3.webp',
    '1LPVLEQTvPQZ36aPy4gsgR/a680029e412437c9b458b67e53555385/mobile4.webp',
    '26nOHFXgBi4osjSe8WMIxD/3e49f587fa5c28b617733ccc404ac22e/mobile5.webp',
    '29MOqLCEGwOfLb5VFG1kuP/89ae533aba3a2330b46a0bf3725e2b50/mobile6.webp',
    '7H3mFMSDHiFnOJxM3oa60J/51ab372b07f6ba32dde824a9b55b4fb1/mobile7.webp',
    'grmWgXPW6RBOtJYflUL9a/bbfa873959c52eee5d0661d83c9eaf3a/mobile8.webp',
    '5rwPvFTZU2aFIP2nXNsDtu/c161959b734b5dd3f65af545d58b1216/mobile9.webp',
    '1ndw8wrqBsg70xLBxcvdYo/a72c5220e24777125a59cfa69754d136/mobile10.webp',
    '5llLmTE9S9xDzjt8Gto9el/12f4087703555b17f0393ce28b5db721/mobile11.webp',
    '2AYnSiTzcoxDfyMMgSCWRJ/aaa1f27e5128173e877b303a07f39208/mobile12.webp',
    'AVCzMoq7YPpjpb3ZvmjBo/75febae8d46172f519f0bf81dd1d918c/mobile13.webp',
    '7oH7SasMGJUsQ3o7OwyLa3/3f66fa5d56519387b39a9cfd05c231b0/mobile14.webp',
    '1WhJWCXWJPkvkEqBWJ9TsE/8eef598b74cd012a65803ac26d3c2488/mobile15.webp',
    '12XSKpq47vXxX4jcPO0ks2/ab05eac0250c75e3849c19501ae9de91/mobile16.webp'
];

const prefix = 'https://images.ctfassets.net/ze23ubzzqb1s';

import { NFTCard, Gallery } from '@/components/molecules';

export default function Home() {
    return (
        <div className="relative flex w-full flex-col items-center justify-start gap-y-24 md:gap-y-36">
            <TopSection />
            <IntroSection />
            <CollectionsSection>
                <>
                    {MOBILE.map((src: string) => (
                        <NFTCard
                            imgAlt="temp"
                            key={src}
                            imgSrc={`${prefix}/${src}`}
                            href="/collections"
                        />
                    ))}
                </>
            </CollectionsSection>
        </div>
    );
}

const TopSection = () => {
    return (
        <section className="relative flex w-fit flex-row">
            <div className="hidden flex-col p-2 md:flex md:w-1/5">SOME TEXT</div>
            <Gallery className="md:w-4/5" />
        </section>
    );
};

const IntroSection = () => {
    return (
        <section className="flex flex-col gap-y-10">
            <h2 className="text-center text-3xl font-semibold leading-none sm:text-4xl lg:text-5xl xl:text-6xl">
                Elevate your NFT collection with ease!
            </h2>
            <span className="text-start text-lg sm:text-center sm:text-xl md:text-2xl lg:text-3xl">
                <strong>Create</strong> captivating <strong>social</strong> <strong>media</strong>{' '}
                <strong>banners</strong>, <strong>desktop</strong> and <strong>mobile</strong>{' '}
                <strong>wallpapers</strong> from your <strong>favorite</strong>{' '}
                <strong>NFTs</strong> in <strong>seconds</strong>. Our <strong>user</strong>
                <strong>-</strong>
                <strong>friendly</strong> <strong>interface</strong> makes it simple to create{' '}
                <strong>professional</strong>
                <strong>-</strong>
                <strong>looking</strong> <strong>graphics</strong> without the need for editing
                skills. Join the digital art revolution and showcase your NFTs like never before.
                Start converting your collection today!
            </span>
        </section>
    );
};

const CollectionsSection = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <section className="flex w-full flex-col justify-start gap-y-6 sm:gap-y-10">
            <h3 className="text-center text-2xl font-semibold leading-none sm:text-start sm:text-3xl">
                COLLECTIONS
            </h3>
            <div className="3xl:grid-cols-6 xs:grid-cols-2 2xs:grid-cols-3 grid w-full grid-cols-1 gap-3 md:grid-cols-4 xl:grid-cols-5">
                {children}
            </div>
        </section>
    );
};
