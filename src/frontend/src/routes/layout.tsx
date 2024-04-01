import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
  <div class="flex flex-col" id="background" style="height: 247vh;background-image: url('/img/background.jpg');background-position: center;background-size: cover;background-attachment: fixed;">
    <Header />
    <Slot />
    <Footer/>
  </div>
  );
});
