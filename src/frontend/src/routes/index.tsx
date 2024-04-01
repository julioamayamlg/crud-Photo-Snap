import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { UsersList } from "~/components/users-list";

export default component$(() => {
  return (
    <UsersList/>
  );
});

export const head: DocumentHead = {
  title: "Photo&Snap",
  meta: [
    {
      name: "description",
      content: "Gestión de fotos de Photo&Snap",
    },
  ],
};
