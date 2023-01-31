import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const customerHref = JSON.parse(sessionStorage?.customer).href;
    const organization = customerHref.split("/")[4];
    sessionStorage.setItem("organization", organization);

    router.push("/" + organization);
  }, []);

  return <></>;
}
