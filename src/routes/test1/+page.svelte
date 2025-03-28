<div id="kontener">
	<div class="urządzenie">
		<div class="właściwość">1</div>
		<div class="właściwość">2</div>
		<div class="właściwość">3</div>
		<div class="właściwość">4</div>
	</div>
	<div class="urządzenie">
		<div class="właściwość">1</div>
		<div class="właściwość">2</div>
		<div class="właściwość">3</div>
		<div class="właściwość"></div>
	</div>
	<!-- Możesz dodać więcej urządzeń -->
</div>

<style>
	#kontener {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.urządzenie {
		display: flex;
		gap: 10px;
		justify-content: flex-start;
		align-items: stretch;
		padding: 10px;
	}

	.właściwość {
		flex: 1; /* Wyrównuje wszystkie właściwości do tej samej szerokości */
		padding: 5px;
		text-align: center;
		min-width: 50px; /* Minimalna szerokość dla każdej właściwości */
	}
</style>
