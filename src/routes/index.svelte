<script context="module">
    // TODO better than via this redirect?

    /** @type {import('@sveltejs/kit').Load} */
    export async function load() {
		return {
      status: 302,
      redirect: '/page/1',
		};
	}
</script>