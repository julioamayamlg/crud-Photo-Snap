import { component$ } from '@builder.io/qwik';

export const Header = component$(() => {
    return (
        <header class="py-8 text-center">
        <h1 style="font-size:4rem;" class="text-alanturing-800">
            Photo&Snap
        </h1>
        <h2 style="font-size:3rem;" class="text-alanturing-400">
            Gestión de fotos
        </h2>
        </header>
    )
});