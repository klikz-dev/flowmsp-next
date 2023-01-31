import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";
import axios from "axios";

import * as AdminAPI from "../api/AdminAPI";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MapContainer({}) {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  return <></>;
}

export async function getStaticProps(context) {
  console.log(context.params);
  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 15, // In seconds
  };
}

export async function getStaticPaths() {
  /**
   * Getting Token
   */
  //   let jwt = "";
  //   let tokenType = "";
  //   const credString = Buffer.from(
  //     "dewayne.johnson@toptal.com:Ldm.8.17"
  //   ).toString("base64");
  //   const tokenRes = await axios.post(
  //     `${process.env.API_BASE_URL}/api/auth/token`,
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Basic ${credString}`,
  //         "Accept-Encoding": "gzip",
  //       },
  //     }
  //   );

  //   if (!tokenRes.error) {
  //     jwt = tokenRes.data.accessToken;
  //     tokenType = tokenRes.data.tokenType;
  //   }

  //   const allUserRes = await axios.get(
  //     `${process.env.API_BASE_URL}/api/debugPanel/allUsersList`,
  //     {
  //       headers: {
  //         Authorization: `${tokenType} ${jwt}`,
  //         "X-FlowMSP-Source": "Web",
  //         "X-FlowMSP-Version": "2.40.0",
  //         "Accept-Encoding": "gzip",
  //       },
  //     }
  //   );

  /**
   * Getting All Users
   */
  //   const paths = allUserRes.data.data.map((user) => ({
  //     params: { id: user.customerSlug },
  //   }));

  /**
   * Temporary
   */
  const paths = [{ params: { id: "bellevillefi" } }];

  return { paths, fallback: "blocking" };
}
