<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<h1>
	<a href={resolve('/')}>jtremesay.org</a>
</h1>

<nav>
	<ul>
		<li><a href={resolve('/a-propos.html')}>À propos</a></li>
		<li><a href={resolve('/atom.xml')}>Flux Atom</a></li>
		<li><a href={resolve('/cv.html')}>CV</a></li>
		<li><a href="https://duckduckgo.com/?t=ffab&q=site%3Ajtremesay.org&ia=web">[Recherche]</a></li>
	</ul>
</nav>
