import { memo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const LinksFragment = memo(() => {
    const { asPath } = useRouter();
    const fullLink = process.env.NEXT_PUBLIC_ORIGIN + asPath;

    return (
        <Head>
            <meta property="og:url" content={fullLink} />
            <link rel="canonical" href={fullLink} />
        </Head>
    );
});

const CommonHead = ({ lib, title, description }) => {
    const postfix = lib
        ? process.env.NEXT_PUBLIC_TITLE_PREFIX + "/" + lib
        : process.env.NEXT_PUBLIC_TITLE_PREFIX;

    const prefixedTitle = title ? `${title} | ${postfix}` : postfix;

    return (
        <>
            <LinksFragment />
            <Head>
                <title>{prefixedTitle}</title>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={prefixedTitle} />
                {description ? (
                    <>
                        <meta name="description" content={description} />
                        <meta property="og:description" content={description} />
                    </>
                ) : null}
            </Head>
        </>
    );
};

export default CommonHead;
